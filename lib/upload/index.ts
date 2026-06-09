import * as ImagePicker from 'expo-image-picker';
import { uploadService } from '@/lib/api/services/upload';

/**
 * Shared image-upload helpers.
 *
 * Flow (see docs/api.md "Upload"):
 *   1. Ask our backend for a presigned Supabase Storage URL scoped to a bucket + path.
 *   2. PUT the raw file bytes directly to that signed URL.
 *   3. Hand the resulting public URL back to whatever API needs it
 *      (avatar, job photos, dispute evidence, ...).
 *
 * The signed URL is self-authenticating, so this does NOT require the Supabase
 * publishable key — only EXPO_PUBLIC_SUPABASE_URL, to build public read URLs.
 */

const SUPABASE_URL = (process.env.EXPO_PUBLIC_SUPABASE_URL ?? '').replace(/\/+$/, '');

export type UploadBucket =
  | 'avatars'
  | 'job-photos'
  | 'dispute-evidence'
  | 'draw-evidence'
  | 'estimate-photos';

export interface UploadResult {
  /** Storage path inside the bucket, e.g. `${userId}/1700000000-0.jpg`. */
  path: string;
  /** Public read URL — usable directly as an <Image> source for public buckets. */
  publicUrl: string;
  /** Resolved MIME type that was sent in the PUT. */
  contentType: string;
}

/** Thrown when the user denies photo-library access. Callers can catch to show a friendly prompt. */
export class MediaPermissionError extends Error {
  constructor(message = 'Photo library access was denied.') {
    super(message);
    this.name = 'MediaPermissionError';
  }
}

const MIME_BY_EXT: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  heic: 'image/heic',
  heif: 'image/heif',
};

function extFromUri(uri: string): string {
  const match = /\.([a-zA-Z0-9]+)(?:[?#].*)?$/.exec(uri);
  return match ? match[1].toLowerCase() : 'jpg';
}

function publicUrlFor(bucket: string, path: string): string {
  // Each path segment is encoded individually so slashes stay intact.
  const encoded = path.split('/').map(encodeURIComponent).join('/');
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${encoded}`;
}

/**
 * Open the system photo library and return the picked local file URIs.
 * Returns an empty array if the user cancels. Throws MediaPermissionError if denied.
 */
export async function pickImagesFromLibrary(
  options: { multiple?: boolean } = {}
): Promise<string[]> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    throw new MediaPermissionError();
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsMultipleSelection: options.multiple ?? false,
    quality: 0.8,
  });

  if (result.canceled) {
    return [];
  }

  return result.assets.map((asset) => asset.uri);
}

export interface UploadFileInput {
  bucket: UploadBucket;
  /** Current user id — uploads must live under `${userId}/` per backend policy. */
  userId: string;
  /** Local file URI returned by the image picker. */
  uri: string;
  /** Disambiguates files picked within the same millisecond during batch uploads. */
  index?: number;
}

/**
 * Upload a single local file to Supabase Storage via a backend-issued presigned URL.
 */
export async function uploadFile({
  bucket,
  userId,
  uri,
  index = 0,
}: UploadFileInput): Promise<UploadResult> {
  const ext = extFromUri(uri);
  const contentType = MIME_BY_EXT[ext] ?? 'application/octet-stream';
  const path = `${userId}/${Date.now()}-${index}.${ext}`;

  // 1. Presign — bucket-scoped, path must start with `${userId}/`.
  const { signedUrl, path: storedPath } = await uploadService.presign({ bucket, path });

  // 2. Read the picked file as bytes. blob() is unreliable in React Native
  //    (often yields an empty body on PUT); arrayBuffer() is the supported path.
  const bytes = await fetch(uri).then((res) => res.arrayBuffer());

  // 3. PUT directly to storage. signedUrl may be absolute or storage-relative.
  const uploadUrl = /^https?:\/\//i.test(signedUrl) ? signedUrl : `${SUPABASE_URL}${signedUrl}`;
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': contentType },
    body: bytes,
  });

  if (!response.ok) {
    throw new Error(`Upload to storage failed (HTTP ${response.status})`);
  }

  const finalPath = storedPath ?? path;
  return { path: finalPath, publicUrl: publicUrlFor(bucket, finalPath), contentType };
}

/** Upload several local files sequentially, preserving order. */
export async function uploadFiles(
  bucket: UploadBucket,
  userId: string,
  uris: string[]
): Promise<UploadResult[]> {
  const results: UploadResult[] = [];
  for (let index = 0; index < uris.length; index += 1) {
    results.push(await uploadFile({ bucket, userId, uri: uris[index], index }));
  }
  return results;
}
