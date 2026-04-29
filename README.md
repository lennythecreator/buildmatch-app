# BuildMatch

BuildMatch is an Expo React Native marketplace for renovation projects. It connects real estate developers with contractors for project discovery, bidding, matching, payments, and dispute handling.

## Product Context

BuildMatch is designed around two primary user roles:

- Developers post renovation jobs, review bids, select contractors, and manage milestone-based work.
- Contractors browse available jobs, submit bids, get matched, and track active work.

Core flows represented in this repo include:

- Authentication and onboarding
- Developer and contractor dashboard experiences
- Job discovery and job detail views
- Bid and active-project surfaces
- Profile management
- API service and hook scaffolding for backend integration

## Tech Stack

- Expo + React Native
- Expo Router
- TypeScript
- TanStack Query
- Zustand
- React Hook Form
- Uniwind / Tailwind CSS v4

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Expo-compatible iOS simulator, Android emulator, or Expo Go

### Install dependencies

```bash
npm install
```

### Configure environment

Copy the example env file and update the API URL if needed:

```bash
cp .env.example .env
```

Current required public variable:

```bash
EXPO_PUBLIC_API_URL=http://localhost:3001
```

### Run the app

```bash
npm start
```

Platform-specific commands:

```bash
npm run android
npm run ios
npm run web
```

## Available Scripts

```bash
npm start
npm run android
npm run ios
npm run web
npm run lint
npm run type-check
```

## Project Structure

```text
app/                 Expo Router screens and layouts
components/          Reusable feature and UI components
components/ui/       Base UI primitives
data/                Mock data used by screens and flows
docs/                Setup and API integration docs
hooks/               App hooks and query integrations
lib/api/             API client, service modules, and shared API types
planning/            Product and implementation planning artifacts
screenshots/         Product screenshots and reference images
store/               Zustand stores
types/               Shared TypeScript domain types
```

## Environment and API

The app reads its backend URL from `EXPO_PUBLIC_API_URL`.

- Use `.env.example` as the onboarding template.
- Environment setup details live in [docs/ENVIRONMENT.md](docs/ENVIRONMENT.md).
- API integration details live in [docs/api-integration.md](docs/api-integration.md).

## Documentation

- [docs/README.md](docs/README.md)
- [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)
- [docs/ENVIRONMENT.md](docs/ENVIRONMENT.md)
- [docs/api.md](docs/api.md)
- [docs/api-integration.md](docs/api-integration.md)

## Notes

- This repository has moved beyond the default Expo starter and contains product-specific routes, components, docs, and planning assets for BuildMatch.
- Run `npm run lint` before opening a pull request.
