import { Button } from '@/components/ui/button';
import { getAgreementPreview } from '@/lib/agreements/agreement-preview-store';
import { IconFileText, IconSignature } from '@tabler/icons-react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Alert, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function createPdfViewerHtml(base64: string, fileName: string) {
  return `<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    <style>
      html, body {
        margin: 0;
        min-height: 100%;
        background: #f8fafc;
        color: #0f172a;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      #header {
        position: sticky;
        top: 0;
        z-index: 2;
        padding: 12px 14px;
        background: rgba(248, 250, 252, 0.96);
        border-bottom: 1px solid #e2e8f0;
        font-size: 13px;
        font-weight: 700;
      }
      #viewer {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 14px;
        padding: 14px;
      }
      canvas {
        width: 100%;
        max-width: 820px;
        height: auto;
        background: white;
        border: 1px solid #e2e8f0;
        box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
      }
      #status {
        padding: 20px;
        font-size: 14px;
        line-height: 20px;
        color: #64748b;
      }
    </style>
  </head>
  <body>
    <div id="header">${escapeHtml(fileName)}</div>
    <div id="status">Loading agreement preview...</div>
    <div id="viewer"></div>
    <script type="module">
      import * as pdfjsLib from 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs';

      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs';

      function base64ToBytes(base64) {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);

        for (let index = 0; index < binary.length; index += 1) {
          bytes[index] = binary.charCodeAt(index);
        }

        return bytes;
      }

      async function renderPdf() {
        const status = document.getElementById('status');
        const viewer = document.getElementById('viewer');
        const pdf = await pdfjsLib.getDocument({ data: base64ToBytes('${base64}') }).promise;

        status.textContent = 'Rendering ' + pdf.numPages + ' page' + (pdf.numPages === 1 ? '' : 's') + '...';

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
          const page = await pdf.getPage(pageNumber);
          const viewport = page.getViewport({ scale: 1.35 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');

          canvas.width = viewport.width;
          canvas.height = viewport.height;
          viewer.appendChild(canvas);
          await page.render({ canvasContext: context, viewport }).promise;
        }

        status.remove();
      }

      renderPdf().catch((error) => {
        document.getElementById('status').textContent = 'Could not render agreement preview: ' + error.message;
      });
    </script>
  </body>
</html>`;
}

export default function AgreementPreviewRoute() {
  const params = useLocalSearchParams<{ previewId?: string | string[] }>();
  const previewId = Array.isArray(params.previewId) ? params.previewId[0] : params.previewId;
  const preview = previewId ? getAgreementPreview(previewId) : null;

  const html = React.useMemo(() => {
    if (!preview) {
      return null;
    }

    return createPdfViewerHtml(preview.pdf.base64, preview.pdf.fileName);
  }, [preview]);

  function handleContinueToDocuSign() {
    Alert.alert(
      'DocuSign not connected yet',
      'The next step is creating a DocuSign envelope and opening the embedded signing URL from this screen.'
    );
  }

  if (!preview || !html) {
    return (
      <View className="flex-1 items-center justify-center gap-4 bg-background px-6">
        <Stack.Screen options={{ title: 'Agreement Preview' }} />
        <View className="rounded-2xl bg-accent/10 p-4">
          <IconFileText size={28} color="#00264d" />
        </View>
        <Text selectable className="text-center text-xl font-extrabold text-foreground">
          Agreement preview expired
        </Text>
        <Text selectable className="text-center text-sm leading-5 text-foreground/60">
          Generate the agreement PDF again to open a fresh preview.
        </Text>
        <Button variant="primary" className="w-full" onPress={() => router.back()}>
          Back to Agreement
        </Button>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen options={{ title: 'Agreement Preview' }} />
      <View className="flex-1 border-y border-border bg-background">
        <WebView
          originWhitelist={['*']}
          source={{ html }}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState
          mixedContentMode="always"
        />
      </View>
      <View className="gap-3 border-t border-border bg-surface p-4">
        <Button variant="primary" onPress={handleContinueToDocuSign}>
          <View className="flex-row items-center justify-center gap-2">
            <IconSignature size={18} color="#ffffff" />
            <Text className="font-semibold text-accent-foreground">
              Continue to DocuSign
            </Text>
          </View>
        </Button>
      </View>
    </View>
  );
}
