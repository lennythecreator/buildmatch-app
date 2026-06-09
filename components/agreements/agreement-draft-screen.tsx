import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ProjectAgreementDraft } from '@/lib/agreements/project-agreement-draft';
import { IconAlertTriangle, IconCircleCheck, IconCircleDashed, IconFileText, IconInfoCircle, IconSignature } from '@tabler/icons-react-native';
import { Alert, ScrollView, Text, View } from 'react-native';

interface AgreementDraftScreenProps {
  draft: ProjectAgreementDraft;
  isReadyForSignature: boolean;
}

function getRiskColor(severity: string) {
  switch (severity) {
    case 'high':
      return 'danger';
    case 'medium':
      return 'warning';
    default:
      return 'default';
  }
}

function showSignaturePlaceholder() {
  Alert.alert(
    'DocuSign not connected yet',
    'This draft preview is ready for the next integration step: generating a PDF and sending it through DocuSign.'
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View className="gap-1">
      <Text selectable className="text-xl font-extrabold text-foreground">
        {title}
      </Text>
      {subtitle ? (
        <Text selectable className="text-sm leading-5 text-foreground/60">
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

function SummaryList({ items }: { items: string[] }) {
  return (
    <View className="gap-3">
      {items.map((item) => (
        <View key={item} className="flex-row gap-3 rounded-2xl bg-background p-4">
          <View className="mt-1 h-2 w-2 rounded-full bg-accent" />
          <Text selectable className="flex-1 text-sm leading-5 text-foreground/70">
            {item}
          </Text>
        </View>
      ))}
    </View>
  );
}

export function AgreementDraftScreen({ draft, isReadyForSignature }: AgreementDraftScreenProps) {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 48 }}
    >
      <View className="gap-4 rounded-3xl border border-border bg-surface p-5">
        <View className="flex-row items-start gap-3">
          <View className="rounded-2xl bg-accent/10 p-3">
            <IconFileText size={24} color="#00264d" />
          </View>
          <View className="flex-1 gap-2">
            <Badge color="primary" variant="flat" size="sm">
              AI-assisted draft
            </Badge>
            <Text selectable className="text-2xl font-extrabold leading-8 text-foreground">
              {draft.title}
            </Text>
            <Text selectable className="text-sm leading-5 text-foreground/60">
              {draft.disclaimer}
            </Text>
          </View>
        </View>

        <View className="flex-row flex-wrap gap-3">
          <View className="min-w-[140px] flex-1 rounded-2xl bg-background p-4">
            <Text className="text-[11px] font-bold uppercase tracking-widest text-foreground/50">
              Template
            </Text>
            <Text selectable className="mt-2 text-base font-bold text-foreground">
              {draft.template.name}
            </Text>
            <Text selectable className="mt-1 text-xs text-foreground/50">
              v{draft.template.version} · {draft.template.reviewStatus.replace(/-/g, ' ')}
            </Text>
          </View>
          {draft.parties.map((party) => (
            <View key={party.label} className="min-w-[140px] flex-1 rounded-2xl bg-background p-4">
              <Text className="text-[11px] font-bold uppercase tracking-widest text-foreground/50">
                {party.label}
              </Text>
              <Text selectable className="mt-2 text-base font-bold text-foreground">
                {party.name}
              </Text>
              <Text selectable className="mt-1 text-xs text-foreground/50">
                {party.role}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View className="gap-4 rounded-3xl border border-border bg-surface p-5">
        <SectionHeader title="Shared Contract Draft" subtitle="This is the single agreement both parties would review and sign." />
        {draft.contractSections.map((section) => (
          <View key={section.title} className="gap-2 rounded-2xl bg-background p-4">
            <Text selectable className="text-base font-bold text-foreground">
              {section.title}
            </Text>
            <Text selectable className="text-sm leading-6 text-foreground/70">
              {section.body}
            </Text>
          </View>
        ))}
      </View>

      <View className="gap-4 rounded-3xl border border-border bg-surface p-5">
        <SectionHeader title="Developer Summary" subtitle="Plain-English obligations and checks for the project owner." />
        <SummaryList items={draft.developerSummary} />
      </View>

      <View className="gap-4 rounded-3xl border border-border bg-surface p-5">
        <SectionHeader title="Contractor Summary" subtitle="Plain-English obligations and checks for the service provider." />
        <SummaryList items={draft.contractorSummary} />
      </View>

      <View className="gap-4 rounded-3xl border border-border bg-surface p-5">
        <View className="flex-row items-center gap-2">
          <IconAlertTriangle size={20} color="#dc2626" />
          <SectionHeader title="Clause Risk Review" />
        </View>
        {draft.riskFlags.map((riskFlag) => (
          <View key={riskFlag.title} className="gap-2 rounded-2xl bg-background p-4">
            <View className="flex-row items-center justify-between gap-3">
              <Text selectable className="flex-1 text-base font-bold text-foreground">
                {riskFlag.title}
              </Text>
              <Badge color={getRiskColor(riskFlag.severity)} variant="flat" size="sm">
                {riskFlag.severity}
              </Badge>
            </View>
            <Text selectable className="text-sm leading-5 text-foreground/70">
              {riskFlag.description}
            </Text>
          </View>
        ))}
      </View>

      <View className="gap-4 rounded-3xl border border-border bg-surface p-5">
        <SectionHeader title="Draft Readiness" subtitle="These inputs should be complete before PDF generation and DocuSign." />
        {draft.readinessItems.map((item) => (
          <View key={item.id} className="flex-row gap-3 rounded-2xl bg-background p-4">
            {item.isComplete ? (
              <IconCircleCheck size={20} color="#10b981" />
            ) : (
              <IconCircleDashed size={20} color="#64748b" />
            )}
            <View className="flex-1 gap-1">
              <Text selectable className="text-base font-bold text-foreground">
                {item.label}
              </Text>
              <Text selectable className="text-sm leading-5 text-foreground/60">
                {item.detail}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View className="gap-4 rounded-3xl border border-border bg-surface p-5">
        <View className="flex-row items-center gap-2">
          <IconInfoCircle size={20} color="#64748b" />
          <Text selectable className="flex-1 text-sm leading-5 text-foreground/60">
            Next step is backend PDF generation and DocuSign envelope creation. This preview does not save a contract.
          </Text>
        </View>
        <Button
          variant="primary"
          disabled={!isReadyForSignature}
          onPress={showSignaturePlaceholder}
        >
          <View className="flex-row items-center justify-center gap-2">
            <IconSignature size={18} color="#ffffff" />
            <Text className="font-semibold text-accent-foreground">Prepare for DocuSign</Text>
          </View>
        </Button>
      </View>
    </ScrollView>
  );
}
