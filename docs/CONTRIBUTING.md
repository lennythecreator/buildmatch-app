# Contributing

## Code Style

- Use TypeScript for all new code
- Prefer functional components with hooks
- Use named exports
- Follow existing patterns in the codebase

## TypeScript Types

All API types are in `lib/api/types.ts`. When adding new features:

1. Add types matching the API contract
2. Add service functions in `lib/api/services/`
3. Add React Query hooks in `hooks/`
4. Export from index files

## Components

- Place reusable components in `components/ui/`
- Use Uniwind (Tailwind CSS v4) for styling
- Follow naming conventions: `PascalCase.tsx`

## Testing

Run type checking and linting before committing:

```bash
npm run type-check
npm run lint
```

## API Changes

When the backend API changes:

1. Update types in `lib/api/types.ts`
2. Update service functions in `lib/api/services/`
3. Update hooks if needed
4. Update documentation
