import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth';
import { tokenStorage } from '@/lib/api/token-storage';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export function ApiQueryClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

export async function invalidateAuthQueries() {
  await queryClient.invalidateQueries({ queryKey: ['auth'] });
}

export async function invalidateUserQueries() {
  await queryClient.invalidateQueries({ queryKey: ['user'] });
}

export async function invalidateContractorQueries() {
  await queryClient.invalidateQueries({ queryKey: ['contractors'] });
}

export async function invalidateJobQueries() {
  await queryClient.invalidateQueries({ queryKey: ['jobs'] });
}

export async function invalidateBidQueries() {
  await queryClient.invalidateQueries({ queryKey: ['bids'] });
}

export async function invalidateMessageQueries() {
  await queryClient.invalidateQueries({ queryKey: ['messages'] });
}

export async function invalidateDisputeQueries() {
  await queryClient.invalidateQueries({ queryKey: ['disputes'] });
}

export function clearAllQueries() {
  queryClient.clear();
}
