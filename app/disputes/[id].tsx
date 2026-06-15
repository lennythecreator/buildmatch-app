import { DisputeTimeline } from '@/components/disputes/dispute-timeline';
import { EvidenceCarousel } from '@/components/disputes/evidence-carousel';
import { MediationThread } from '@/components/disputes/mediation-thread';
import { UploadEvidence } from '@/components/disputes/upload-evidence';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  useAddDisputeEvidence,
  useAddDisputeMessage,
  useDispute,
  useDisputeEvidence,
  useDisputeMessages,
  useWithdrawDispute
} from '@/hooks/useDisputes';
import { logDisputeDebug } from '@/lib/debug/dispute-debug';
import { MediaPermissionError, pickImagesFromLibrary, uploadFile } from '@/lib/upload';
import { useAuthStore } from '@/store/auth';
import { IconChevronLeft } from '@tabler/icons-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DisputeDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const insets = useSafeAreaInsets();
  const [activeSegment, setActiveSegment] = useState<'DETAILS' | 'MEDIATION'>('DETAILS');
  const [isPickingEvidence, setIsPickingEvidence] = useState(false);

  const { data: dispute, isLoading: isLoadingDispute } = useDispute(id);
  const { data: evidence, isLoading: isLoadingEvidence } = useDisputeEvidence(id);
  const { data: messages, isLoading: isLoadingMessages } = useDisputeMessages(id);
  
  const { mutate: addMessage, isPending: isSendingMessage } = useAddDisputeMessage();
  const { mutate: addEvidence, isPending: isUploading } = useAddDisputeEvidence();
  const { mutate: withdrawDispute, isPending: isWithdrawing } = useWithdrawDispute();

  logDisputeDebug('DisputeDetails.render', {
    id,
    activeSegment,
    isLoadingDispute,
    isLoadingEvidence,
    isLoadingMessages,
    hasDispute: !!dispute,
    disputeType: dispute ? (Array.isArray(dispute) ? 'array' : typeof dispute) : null,
    disputeKeys: dispute && typeof dispute === 'object' ? Object.keys(dispute) : [],
    amountDisputedType: typeof dispute?.amountDisputed,
    jobTitle: dispute?.jobTitle ?? null,
    filedById: dispute?.filedById ?? null,
    againstId: dispute?.againstId ?? null,
    status: dispute?.status ?? null,
    userId: user?.id ?? null,
    evidenceType: Array.isArray(evidence) ? 'array' : typeof evidence,
    evidenceCount: Array.isArray(evidence) ? evidence.length : undefined,
    messagesType: Array.isArray(messages) ? 'array' : typeof messages,
    messagesCount: Array.isArray(messages) ? messages.length : undefined,
  });

  if (isLoadingDispute) {
    return (
      <View className="h-full justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#3b82f6" className="mb-4" />
        <Text className="text-muted-foreground">Loading dispute details...</Text>
      </View>
    );
  }

  if (!dispute || !user) {
    return (
      <View className="h-full justify-center items-center p-4 bg-background">
        <Text className="text-lg font-bold text-foreground mb-2">Dispute Not Found</Text>
        <Button onPress={() => router.back()} className="mt-4"><Text>Go Back</Text></Button>
      </View>
    );
  }

  // Access check
  const isFiledByMe = user.id === dispute.filedById;
  const isAgainstMe = user.id === dispute.againstId;
  const isAdmin = user.role === 'ADMIN';

  if (!isFiledByMe && !isAgainstMe && !isAdmin) {
    return (
      <View className="h-full justify-center items-center p-4 bg-background">
        <Text className="text-lg font-bold text-destructive mb-2">Access Denied</Text>
        <Text className="text-center text-muted-foreground mb-4">You do not have permission to view this dispute.</Text>
        <Button onPress={() => router.replace('/disputes')}><Text>Return Home</Text></Button>
      </View>
    );
  }

  const plaintiff = dispute.filedBy;
  const respondent = dispute.against;

  const handleUploadEvidence = async () => {
    try {
      setIsPickingEvidence(true);
      const [uri] = await pickImagesFromLibrary();
      if (!uri) {
        return; // user cancelled
      }
      const { publicUrl, contentType } = await uploadFile({
        bucket: 'dispute-evidence',
        userId: user.id,
        uri,
      });
      addEvidence({
        disputeId: dispute.id,
        type: contentType,
        url: publicUrl,
        description: 'Uploaded evidence',
      });
    } catch (error) {
      if (error instanceof MediaPermissionError) {
        Alert.alert('Permission needed', 'Enable photo access in Settings to upload evidence.');
      } else {
        Alert.alert('Upload failed', "We couldn't upload your file. Please try again.");
      }
    } finally {
      setIsPickingEvidence(false);
    }
  };

  const handleWithdraw = () => {
    Alert.alert(
      "Withdraw Dispute", 
      "Are you sure you want to withdraw this dispute? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Withdraw", 
          style: "destructive",
          onPress: () => withdrawDispute({ disputeId: dispute.id, reason: 'User requested withdrawal' }, {
            onSuccess: () => router.replace('/disputes')
          })
        }
      ]
    );
  };

  return (
    <SafeAreaView className="bg-background" style={{ flex: 1 }}>
      <View className="px-4 py-4 flex-row items-center border-b border-border bg-surface">
        <TouchableOpacity onPress={() => router.back()} className="mr-4 p-1">
          <IconChevronLeft size={24} color="#3b82f6" />
        </TouchableOpacity>
        <View className="min-w-0 grow">
          <Text className="text-lg font-bold text-foreground" numberOfLines={1}>{dispute.jobTitle}</Text>
          <Text className="text-xs text-muted-foreground px-1">${dispute.amountDisputed.toLocaleString()} Disputed</Text>
        </View>
      </View>

      {/* Tabs */}
      <View className="flex-row border-b border-border bg-surface px-4">
        <TouchableOpacity 
          onPress={() => setActiveSegment('DETAILS')}
          className={`py-3 mr-6 border-b-2 ${activeSegment === 'DETAILS' ? 'border-primary' : 'border-transparent'}`}
        >
          <Text className={`font-medium ${activeSegment === 'DETAILS' ? 'text-foreground' : 'text-muted-foreground'}`}>Details & Evidence</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setActiveSegment('MEDIATION')}
          className={`py-3 border-b-2 items-center flex-row ${activeSegment === 'MEDIATION' ? 'border-primary' : 'border-transparent'}`}
        >
          <Text className={`font-medium mr-1 ${activeSegment === 'MEDIATION' ? 'text-foreground' : 'text-muted-foreground'}`}>Mediation</Text>
          {dispute.messageCount > 0 && <Badge size="sm">{dispute.messageCount}</Badge>}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1, backgroundColor: '#fff' }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: Math.max(insets.bottom + 48, 56),
        }}
      >
        {activeSegment === 'DETAILS' ? (
          <View>
            <View className="items-center py-4 bg-surface border border-border rounded-2xl mb-6">
              <Text className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Parties</Text>
              <Text className="text-sm font-semibold text-foreground text-center">
                {plaintiff?.firstName} {plaintiff?.lastName} <Text className="font-normal text-muted-foreground">(Filed By)</Text>{'\n'}
                <Text className="text-muted-foreground text-xs font-normal">vs</Text>{'\n'}
                {respondent?.firstName} {respondent?.lastName} <Text className="font-normal text-muted-foreground">(Filed Against)</Text>
              </Text>
            </View>

            <DisputeTimeline status={dispute.status} />

            <Card className="mb-6">
              <Text className="text-sm font-bold text-foreground mb-2">What happened?</Text>
              <Text className="text-sm text-foreground/80 mb-4">{dispute.description}</Text>
              
              <Text className="text-sm font-bold text-foreground mb-2">Desired Outcome</Text>
              <Text className="text-sm text-foreground/80">{dispute.desiredOutcome}</Text>
            </Card>

            <View className="mb-6">
              <Text className="text-sm font-bold text-foreground mb-3 px-1">Evidence</Text>
              {isLoadingEvidence ? (
                <ActivityIndicator size="small" color="#a1a1aa" />
              ) : (
                <EvidenceCarousel evidence={evidence || []} dispute={dispute} />
              )}
              
              <UploadEvidence
                onUpload={handleUploadEvidence}
                isLoading={isUploading || isPickingEvidence}
              />
            </View>

            {(isFiledByMe && (dispute.status === 'UNDER_REVIEW' || dispute.status === 'AWAITING_EVIDENCE')) && (
              <Button variant="outline" className="border-destructive" onPress={handleWithdraw} disabled={isWithdrawing}>
                <Text className="text-destructive">{isWithdrawing ? 'Withdrawing...' : 'Withdraw Dispute'}</Text>
              </Button>
            )}
          </View>
        ) : (
          <View className="min-h-0">
            <Text className="text-sm text-muted-foreground px-2 mb-2 text-center">
              This is a secure channel mediated by BuildMatch.
            </Text>
            {isLoadingMessages ? (
               <ActivityIndicator size="small" color="#3b82f6" />
            ) : (
              <MediationThread 
                messages={messages || []} 
                onSendMessage={(content) => addMessage({ disputeId: dispute.id, content })} 
                isLoading={isSendingMessage} 
              />
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
