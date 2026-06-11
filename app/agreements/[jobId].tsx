import { AgreementDraftScreen } from '@/components/agreements/agreement-draft-screen';
import { Button } from '@/components/ui/button';
import { useBids, useMyBid } from '@/hooks/useBids';
import { useJob } from '@/hooks/useJobs';
import { requestAgreementDraft, requestAgreementPdf, type AgreementPdfApiResponse } from '@/lib/agreements/agreement-draft-api';
import { openAgreementPdfPreview } from '@/lib/agreements/agreement-pdf-preview';
import { createProjectAgreementInput } from '@/lib/agreements/project-agreement-input';
import { generateProjectAgreementDraftFromInput, type ProjectAgreementDraft } from '@/lib/agreements/project-agreement-draft';
import { useAuthStore } from '@/store/auth';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Alert, Text, View } from 'react-native';

function getAiProviderName(provider: string) {
  switch (provider) {
    case 'openrouter':
      return 'OpenRouter';
    case 'groq':
      return 'Groq';
    case 'ollama':
      return 'Qwen';
    default:
      return 'AI';
  }
}

export default function AgreementDraftRoute() {
  const params = useLocalSearchParams<{ jobId?: string | string[]; bidId?: string | string[] }>();
  const jobId = Array.isArray(params.jobId) ? params.jobId[0] : params.jobId;
  const selectedBidId = Array.isArray(params.bidId) ? params.bidId[0] : params.bidId;
  const userRole = useAuthStore((state) => state.user?.role);
  const isInvestor = userRole === 'INVESTOR';
  const [generatedDraft, setGeneratedDraft] = React.useState<ProjectAgreementDraft | null>(null);
  const [preparedPdf, setPreparedPdf] = React.useState<AgreementPdfApiResponse | null>(null);
  const [isPreparingForDocuSign, setIsPreparingForDocuSign] = React.useState(false);

  const jobQuery = useJob(jobId ?? '');
  const bidsQuery = useBids(jobId ?? '', { enabled: isInvestor });
  const myBidQuery = useMyBid(jobId ?? '', { enabled: userRole === 'CONTRACTOR' });

  const bid = React.useMemo(() => {
    if (isInvestor) {
      const bids = bidsQuery.data?.bids ?? [];
      return bids.find((item) => item.id === selectedBidId) ?? bids.find((item) => item.status === 'ACCEPTED') ?? null;
    }

    return myBidQuery.data?.status === 'ACCEPTED' ? myBidQuery.data : null;
  }, [bidsQuery.data, isInvestor, myBidQuery.data, selectedBidId]);

  if (!jobId) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text selectable className="text-center text-danger">
          Missing job id.
        </Text>
      </View>
    );
  }

  if (jobQuery.isLoading || (isInvestor ? bidsQuery.isLoading : myBidQuery.isLoading)) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <ActivityIndicator size="large" />
        <Text selectable className="mt-4 text-center text-sm font-medium text-foreground/60">
          Preparing agreement draft...
        </Text>
      </View>
    );
  }

  if (jobQuery.isError || !jobQuery.data) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text selectable className="text-center text-danger">
          Failed to load this job for agreement drafting.
        </Text>
        <Button variant="primary" className="mt-6 w-full" onPress={() => router.back()}>
          Back
        </Button>
      </View>
    );
  }

  const agreementInput = createProjectAgreementInput(jobQuery.data, bid);
  const draft = generatedDraft ?? generateProjectAgreementDraftFromInput(agreementInput);
  const isReadyForSignature = Boolean(bid) && jobQuery.data.status === 'AWARDED';

  async function handlePreviewAgreement(pdf: AgreementPdfApiResponse) {
    try {
      await openAgreementPdfPreview(pdf);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not open the generated agreement preview.';
      Alert.alert('Could not preview agreement', message);
    }
  }

  async function handlePrepareForDocuSign() {
    if (!isReadyForSignature) {
      Alert.alert('Agreement not ready', 'Accept a bid before preparing the agreement for DocuSign.');
      return;
    }

    setIsPreparingForDocuSign(true);

    try {
      const response = await requestAgreementDraft(agreementInput);
      const pdfResponse = await requestAgreementPdf(response.draft);

      setGeneratedDraft(response.draft);
      setPreparedPdf(pdfResponse);

      Alert.alert(
        response.didFallback ? 'Template PDF prepared' : 'AI PDF prepared',
        response.didFallback
          ? `AI fallback reason: ${response.fallbackReason ?? 'Unknown error.'}\n\nThe app used the template draft and generated ${pdfResponse.fileName}.`
          : `${getAiProviderName(response.provider)} generated a contract-ready draft with ${response.model}, then generated ${pdfResponse.fileName}.`,
        [
          {
            text: 'Preview Agreement',
            onPress: () => {
              void handlePreviewAgreement(pdfResponse);
            },
          },
        ]
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not prepare the agreement draft.';
      Alert.alert('Could not prepare agreement', message);
    } finally {
      setIsPreparingForDocuSign(false);
    }
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Project Agreement',
          headerTitleAlign: 'center',
          headerShadowVisible: false,
        }}
      />
      <AgreementDraftScreen
        draft={draft}
        isReadyForSignature={isReadyForSignature}
        isPreparingForDocuSign={isPreparingForDocuSign}
        preparedPdf={preparedPdf}
        onPrepareForDocuSign={handlePrepareForDocuSign}
        onPreviewAgreement={preparedPdf ? () => {
          void handlePreviewAgreement(preparedPdf);
        } : undefined}
      />
    </>
  );
}
