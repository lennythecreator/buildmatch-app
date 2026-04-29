import { aiService } from '@/lib/api/services/ai';
import type { ParseJobInput } from '@/lib/api/services/ai';
import { useMutation } from '@tanstack/react-query';

export function useParseJob() {
  return useMutation({
    mutationFn: (input: ParseJobInput) => aiService.parseJob(input),
  });
}
