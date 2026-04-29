# BuildMatch App

A mobile marketplace connecting real estate developers with contractors for renovation projects.

## Tech Stack

- **Framework**: Expo (React Native)
- **Navigation**: Expo Router
- **Styling**: Uniwind (Tailwind CSS v4)
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Forms**: React Hook Form

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npx expo start`)

### Installation

```bash
npm install
```

### Environment Variables

Create `.env` in the project root:

```bash
EXPO_PUBLIC_API_URL=http://localhost:3001
```

### Run Development Server

```bash
npm start
```

## Project Structure

```
├── app/                    # Expo Router screens
│   ├── (auth)/            # Auth screens (login, register)
│   ├── (tabs)/            # Tab navigation
│   └── _layout.tsx        # Root layout
├── components/            # Reusable UI components
│   └── ui/                # Base UI components
├── hooks/                 # React Query hooks
├── lib/
│   ├── api/              # API client & services
│   └── query-client.tsx  # React Query setup
├── store/                # Zustand stores
└── types/                # TypeScript types
```

## Key Libraries

| Library | Purpose |
|---------|---------|
| `@tanstack/react-query` | Server state management |
| `zustand` | Client state |
| `react-hook-form` | Form handling |
| `@tabler/icons-react-native` | Icons |
| `@gorhom/bottom-sheet` | Bottom sheets |
| `expo-secure-store` | Secure token storage |

## Scripts

```bash
npm start        # Start dev server
npm run lint     # Run ESLint
npm run type-check  # TypeScript check
```

## API Integration

See [API Integration Guide](api-integration.md) for detailed documentation on using the API client and hooks.

## Backend Requirements

This app requires the BuildMatch backend running at `EXPO_PUBLIC_API_URL`.

See [API Documentation](../buildmatch-backend/docs/api.md) for backend setup.
