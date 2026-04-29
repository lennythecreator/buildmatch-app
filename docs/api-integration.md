# API Integration Guide

This document covers how the BuildMatch frontend integrates with the backend API.

## Environment Setup

Create a `.env` file in the project root:

```bash
# Backend API URL
EXPO_PUBLIC_API_URL=http://localhost:3001

# For production:
# EXPO_PUBLIC_API_URL=https://api.buildmatch.us
```

## Project Structure

```
lib/
├── api/
│   ├── client.ts          # Base API client with auth
│   ├── token-storage.ts   # Secure token storage
│   ├── types.ts           # TypeScript types
│   ├── index.ts           # Re-exports
│   └── services/          # API service modules
│       ├── auth.ts        # Authentication
│       ├── jobs.ts        # Jobs CRUD
│       ├── bids.ts        # Bids
│       ├── contractors.ts # Contractor profiles
│       ├── messages.ts    # Messaging
│       ├── disputes.ts    # Disputes
│       ├── draws.ts       # Draw schedules
│       ├── contracts.ts   # Contracts
│       ├── saved.ts       # Saved contractors
│       ├── estimator.ts   # Property estimator
│       ├── billing.ts     # Payment methods
│       ├── notifications.ts
│       ├── upload.ts      # File uploads
│       └── ai.ts          # AI features

hooks/
├── useAuth.ts         # Auth hooks (login, register, etc.)
├── useJobs.ts         # Job hooks
├── useBids.ts         # Bid hooks
├── useContractors.ts  # Contractor hooks
├── useMessages.ts     # Message hooks
├── useDisputes.ts     # Dispute hooks
├── useEstimator.ts    # Estimator hooks
└── index.ts           # Re-exports

store/
└── auth.ts            # Zustand auth store
```

## API Client

The API client handles:
- Automatic JWT token injection
- Error parsing
- Response unwrapping

```typescript
import { apiClient, ApiError } from '@/lib/api/client';

try {
  const user = await apiClient.get<User>('/api/auth/me');
} catch (error) {
  if (error instanceof ApiError) {
    console.log(error.status); // HTTP status code
    console.log(error.message); // Error message
    console.log(error.errors); // Validation errors
  }
}
```

## Authentication Flow

### Using Hooks (Recommended)

```typescript
import { useLogin, useRegister, useLogout } from '@/hooks';

// Login
const login = useLogin();
await login.mutateAsync({ email, password });

// Register
const register = useRegister();
await register.mutateAsync({
  email,
  password,
  firstName,
  lastName,
  role: 'INVESTOR' | 'CONTRACTOR',
});

// Logout
const logout = useLogout();
await logout.mutateAsync();
```

### Auth Store

```typescript
import { useAuthStore } from '@/store/auth';

const { user, isAuthenticated, login, logout } = useAuthStore();
```

## Data Fetching

### Queries

```typescript
import { useJobs, useJob, useBids } from '@/hooks';

// List jobs with filters
const { data, isLoading, error } = useJobs({ status: 'OPEN', city: 'Dallas' });

// Single job
const { data: job } = useJob('job-id');

// Job bids
const { data: bids } = useBids('job-id');
```

### Mutations

```typescript
import { useCreateJob, useCreateBid } from '@/hooks';

const createJob = useCreateJob();

await createJob.mutateAsync({
  title: 'Kitchen Renovation',
  description: '...',
  tradeType: 'GENERAL',
  budgetMin: 15000,
  budgetMax: 25000,
  city: 'Dallas',
  state: 'TX',
  zipCode: '75201',
});
```

## Available Hooks

| Hook | Purpose |
|------|---------|
| `useLogin()` | Authenticate user |
| `useRegister()` | Create new account |
| `useLogout()` | End session |
| `useCurrentUser()` | Fetch current user |
| `useUpdateProfile()` | Update user profile |
| `useJobs(filters?)` | List jobs |
| `useJob(id)` | Get single job |
| `useCreateJob()` | Create job |
| `useBids(jobId)` | List bids for job |
| `useCreateBid()` | Submit bid |
| `useContractors(filters?)` | List contractors |
| `useConversations()` | List conversations |
| `useMessages(conversationId)` | Get messages |
| `useDispute(id)` | Get dispute |
| `useProperties()` | List properties |
| `useEstimate(id)` | Get estimate |

## API Response Types

All API responses follow this shape:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}
```

The client automatically unwraps `data` from responses.

## Error Handling

```typescript
import { ApiError } from '@/lib/api/client';

try {
  await createJob.mutateAsync(data);
} catch (error) {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 400: // Validation error
        console.log(error.errors);
        break;
      case 401: // Unauthorized
        // Redirect to login
        break;
      case 403: // Forbidden
        break;
      default:
        console.log(error.message);
    }
  }
}
```

## File Uploads

```typescript
import { uploadService } from '@/lib/api/services';

// Get presigned URL
const { signedUrl, token, path } = await uploadService.presign({
  bucket: 'job-photos',
  path: `${userId}/photo-123.jpg`,
});

// Upload file to Supabase Storage
await fetch(signedUrl, {
  method: 'PUT',
  body: file,
  headers: { 'Content-Type': file.type },
});
```
