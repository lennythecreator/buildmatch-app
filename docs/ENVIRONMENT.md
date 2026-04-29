# Environment Variables

## Frontend (Expo)

Variables prefixed with `EXPO_PUBLIC_` are exposed to the client bundle.

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `EXPO_PUBLIC_API_URL` | No | `http://localhost:3001` | Backend API URL |

## Creating .env Files

Start by copying the tracked example file:

```bash
cp .env.example .env
```

### Example template (.env.example)

```bash
EXPO_PUBLIC_API_URL=http://localhost:3001
```

### Development (.env)

```bash
EXPO_PUBLIC_API_URL=http://localhost:3001
```

### Production (.env.production)

```bash
EXPO_PUBLIC_API_URL=https://api.buildmatch.us
```

## Notes

- Restart the dev server after changing `.env` files
- Never put secrets in `EXPO_PUBLIC_` variables because they are visible in the app bundle
- Keep `.env.example` committed and `.env` uncommitted
- For backend secrets, use the backend's own `.env` file
