import type { AgreementPdfApiResponse } from '@/lib/agreements/agreement-draft-api';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

function base64ToBytes(base64: string) {
  if (typeof atob !== 'function') {
    throw new Error('Base64 decoding is unavailable on this device.');
  }

  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

async function openAgreementPdfPreview(pdf: AgreementPdfApiResponse) {
  const file = new File(Paths.cache, pdf.fileName);
  file.create({ overwrite: true });
  file.write(base64ToBytes(pdf.base64));

  const isSharingAvailable = await Sharing.isAvailableAsync();

  if (!isSharingAvailable) {
    throw new Error('PDF preview is not available on this device.');
  }

  await Sharing.shareAsync(file.uri, {
    mimeType: pdf.mimeType,
    dialogTitle: 'Preview Agreement',
    UTI: 'com.adobe.pdf',
  });
}

export { openAgreementPdfPreview };
