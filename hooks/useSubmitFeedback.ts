import { feedbackService } from '@/lib/api/services/feedback';
import type { FeedbackSentiment } from '@/lib/api/types';
import { useMutation } from '@tanstack/react-query';

export interface SubmitFeedbackInput {
  sentiment: FeedbackSentiment;
  comment: string;
}

export type SubmitFeedbackResult = Awaited<ReturnType<typeof feedbackService.submit>>;

export function useSubmitFeedback() {
  return useMutation<SubmitFeedbackResult, Error, SubmitFeedbackInput>({
    mutationFn: (input) => feedbackService.submit(input),
  });
}
