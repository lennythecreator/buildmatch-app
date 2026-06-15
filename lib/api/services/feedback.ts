import { apiClient } from '../client';
import type { FeedbackSubmission, SubmitFeedbackRequest } from '../types';

export const feedbackService = {
  submit: (input: SubmitFeedbackRequest) =>
    apiClient.post<FeedbackSubmission>('/api/feedback', input),
};
