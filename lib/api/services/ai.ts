import { apiClient } from '../client';

export interface ChatInput {
  message: string;
  context?: Record<string, unknown>;
}

export interface ChatResponse {
  message: string;
  conversationId?: string;
}

export interface ClassifyPreviewInput {
  text: string;
}

export interface ClassifyPreviewResponse {
  tradeType?: string;
  category?: string;
  confidence: number;
}

export interface PolishReplyInput {
  message: string;
  tone?: string;
}

export interface SummarizeResponse {
  summary: string;
  keyPoints: string[];
}

export interface MatchingResponse {
  matches: Array<{
    contractorId: string;
    score: number;
    reasons: string[];
  }>;
}

export interface SearchInput {
  query: string;
  filters?: Record<string, unknown>;
}

export interface SearchResponse {
  results: Array<{
    contractorId: string;
    relevance: number;
    highlights: string[];
  }>;
}

export interface JobAssistantQuestionsResponse {
  questions: Array<{
    id: string;
    question: string;
    options?: string[];
    required: boolean;
  }>;
}

export interface JobAssistantGenerateInput {
  title?: string;
  description?: string;
  budget?: { min: number; max: number };
  location?: { city: string; state: string };
  additionalContext?: string;
}

export interface JobAssistantGenerateResponse {
  title: string;
  description: string;
  tradeType: string;
  budgetMin: number;
  budgetMax: number;
}

export interface BidsAnalysisResponse {
  summary: string;
  recommendations: string[];
  bidAnalysis: Array<{
    bidId: string;
    score: number;
    strengths: string[];
    concerns: string[];
  }>;
}

export interface ReliabilityScoreResponse {
  score: number;
  factors: Array<{
    name: string;
    impact: number;
    description: string;
  }>;
}

export interface ScopeEstimateInput {
  photoIds: string[];
  propertyType?: string;
  location?: { city: string; state: string };
}

export interface ScopeEstimateResponse {
  estimateLow: number;
  estimateHigh: number;
  confidence: number;
  categories: Array<{
    name: string;
    estimateLow: number;
    estimateHigh: number;
  }>;
}

export interface ParseJobInput {
  text: string;
}

export interface ParseJobResponse {
  title?: string;
  description?: string;
  tradeType?: string;
  budgetMin?: number;
  budgetMax?: number;
  city?: string;
  state?: string;
  zipCode?: string;
  confidence: number;
}

export const aiService = {
  chat: (input: ChatInput) =>
    apiClient.post<ChatResponse>('/api/ai/chat', input),

  classifyPreview: (input: ClassifyPreviewInput) =>
    apiClient.post<ClassifyPreviewResponse>('/api/ai/classify-preview', input),

  polishReply: (input: PolishReplyInput) =>
    apiClient.post<{ polished: string }>('/api/ai/polish-reply', input),

  summarizeJob: (jobId: string) =>
    apiClient.get<SummarizeResponse>(`/api/ai/summarize/${jobId}`),

  getMatching: (jobId: string) =>
    apiClient.get<MatchingResponse>(`/api/ai/matching/${jobId}`),

  clearMatchingCache: (jobId: string) =>
    apiClient.delete<void>(`/api/ai/matching/${jobId}/cache`),

  search: (input: SearchInput) =>
    apiClient.post<SearchResponse>('/api/ai/search', input),

  getJobAssistantQuestions: (jobId: string) =>
    apiClient.post<JobAssistantQuestionsResponse>(
      '/api/ai/job-assistant/questions',
      { jobId }
    ),

  generateJobPosting: (input: JobAssistantGenerateInput) =>
    apiClient.post<JobAssistantGenerateResponse>('/api/ai/job-assistant/generate', input),

  analyzeBids: (jobId: string) =>
    apiClient.get<BidsAnalysisResponse>(`/api/ai/bids/${jobId}/analysis`),

  getReliabilityScore: () =>
    apiClient.get<ReliabilityScoreResponse>('/api/ai/reliability/me'),

  scopeEstimate: (input: ScopeEstimateInput) =>
    apiClient.post<ScopeEstimateResponse>('/api/ai/scope-estimate', input),

  parseJob: (input: ParseJobInput) =>
    apiClient.post<ParseJobResponse>('/api/ai/parse-job', input),
};
