import { IconFileText, IconPlus, IconSend, IconX } from '@tabler/icons-react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import React, { useMemo, useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';

interface AttachmentPreview {
  uri: string;
  name: string;
  mimeType?: string;
  kind: 'photo' | 'file';
}

interface ComposerProps {
  value: string;
  onChangeText: (value: string) => void;
  onSend: () => void;
  isSending?: boolean;
}

function isImageAttachment(mimeType?: string, uri?: string): boolean {
  if (mimeType?.startsWith('image/')) {
    return true;
  }

  return Boolean(uri?.match(/\.(png|jpe?g|webp|heic|gif)$/i));
}

export function Composer({ value, onChangeText, onSend, isSending = false }: ComposerProps) {
  const [attachment, setAttachment] = useState<AttachmentPreview | null>(null);
  const canSend = value.trim().length > 0;

  const attachmentLabel = useMemo(() => {
    if (!attachment) {
      return '';
    }

    return attachment.kind === 'photo' ? 'Photo attached' : attachment.name;
  }, [attachment]);

  async function pickPhoto() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: false,
      quality: 0.85,
    });

    if (result.canceled || !result.assets[0]) {
      return;
    }

    const asset = result.assets[0];
    setAttachment({
      uri: asset.uri,
      name: asset.fileName ?? 'Photo attachment',
      mimeType: asset.mimeType,
      kind: 'photo',
    });
  }

  async function pickFile() {
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (result.canceled || !result.assets[0]) {
      return;
    }

    const asset = result.assets[0];
    setAttachment({
      uri: asset.uri,
      name: asset.name,
      mimeType: asset.mimeType,
      kind: isImageAttachment(asset.mimeType, asset.uri) ? 'photo' : 'file',
    });
  }

  function handlePickAttachment() {
    Alert.alert('Add attachment', 'Choose a media source', [
      { text: 'Photo library', onPress: () => void pickPhoto() },
      { text: 'Files', onPress: () => void pickFile() },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }

  function handleSend() {
    if (!canSend) {
      return;
    }

    onSend();
    setAttachment(null);
  }

  return (
    <View className="gap-3 border-t border-border bg-background px-4 pb-4 pt-3">
      {attachment ? (
        <View className="overflow-hidden rounded-2xl bg-surface p-3 shadow-sm shadow-slate-200/40">
          <View className="flex-row items-center gap-3">
            <View className="h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
              {attachment.kind === 'photo' ? (
                <Image source={{ uri: attachment.uri }} contentFit="cover" className="h-full w-full" />
              ) : (
                <IconFileText size={24} color="#64748b" />
              )}
            </View>

            <View className="flex-1 gap-0.5">
              <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>
                {attachmentLabel}
              </Text>
              <Text className="text-xs text-muted" numberOfLines={1}>
                {attachment.kind === 'photo' ? 'Ready to share as a photo attachment.' : attachment.name}
              </Text>
            </View>

            <Pressable onPress={() => setAttachment(null)} hitSlop={8} className="rounded-full bg-slate-100 p-1.5">
              <IconX size={14} color="#64748b" />
            </Pressable>
          </View>
        </View>
      ) : null}

      <View className="flex-row items-end gap-3 rounded-3xl bg-surface px-3 py-2 shadow-sm shadow-slate-200/50">
        <Pressable onPress={handlePickAttachment} hitSlop={10} className="mb-1 rounded-full bg-accent/10 p-2.5 active:opacity-80">
          <IconPlus size={18} color="#00264d" />
        </Pressable>

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Type a message"
          placeholderTextColor="#64748b"
          multiline
          className="min-h-[46px] max-h-28 flex-1 py-2 text-base leading-6 text-foreground"
        />

        <Pressable
          onPress={handleSend}
          disabled={!canSend || isSending}
          className={['mb-1 rounded-full px-3 py-3', canSend && !isSending ? 'bg-accent' : 'bg-slate-200'].join(' ')}
        >
          <IconSend size={18} color={canSend && !isSending ? '#ffffff' : '#64748b'} />
        </Pressable>
      </View>
    </View>
  );
}