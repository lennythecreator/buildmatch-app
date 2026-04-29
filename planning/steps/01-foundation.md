# Tier 1: Foundation & Environment Setup

**Status**: In Progress  
**Owner**: Team  
**Estimated**: 2-3 hours  

## Overview
Establish core infrastructure, environment variables, and build configuration. This tier ensures the project is deployable and maintainable from day one.

## Acceptance Criteria
- [ ] Environment files created (dev, staging, prod)
- [ ] Environment variables documented in README
- [ ] Build config updated if needed
- [ ] Linting and type-checking pass
- [ ] No console errors on dev run
- [ ] Team can spin up project with single command

## Key Decisions
1. **No secrets in repo** — all `.env` files ignored
2. **Single source of truth for config** — centralized env definitions
3. **Transparent initialization** — logs confirm which environment is active

## Micro-Steps

### Step 1.1: Create Environment Files
**Prompt**: Create three environment configuration files at project root:
- `.env.local` (development, git-ignored)
- `.env.staging` (staging deployment)
- `.env.production` (production deployment)

**What to include**:
```
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_ENV=development
EXPO_PUBLIC_LOG_LEVEL=debug
```

**Rules**:
- Prefix with `EXPO_PUBLIC_` for client-side access
- Use `EXPO_` prefix for Expo-specific vars
- Document all variables in table format

### Step 1.2: Update .gitignore
**Prompt**: Add to `.gitignore`:
```
.env.local
.env.*.local
```

Ensure `.env.staging` and `.env.production` are tracked (they contain no secrets).

### Step 1.3: Create Environment Setup Document
**File**: `docs/ENVIRONMENT_SETUP.md`  
**Content**:
- Required variables and defaults
- How to switch environments (e.g., `EXPO_ENV=staging npx expo start`)
- What each variable controls
- Example values for new developers

**Template**:
```markdown
# Environment Variables

| Variable | Default | Required | Purpose |
|----------|---------|----------|---------|
| EXPO_PUBLIC_API_URL | http://localhost:3000 | Yes | API base URL |
| EXPO_PUBLIC_ENV | development | Yes | Environment name |
| EXPO_PUBLIC_LOG_LEVEL | debug | No | Console log verbosity |
```

### Step 1.4: Verify Configuration
**Checklist**:
- [ ] `npx expo start` runs without env-related warnings
- [ ] Console logs show active environment
- [ ] `npm run type-check` passes
- [ ] `npm run lint` passes
- [ ] Team member can clone and run locally

---

## Testing Notes
1. **Manual Test**: Clear cache, run `npx expo start`, verify env logged to console
2. **Type Check**: `npm run type-check` must pass with no errors
3. **Linting**: `npm run lint` must pass
4. **Device Test**: Run on physical device/emulator to ensure no runtime errors

---

## Agent Prompt
Use this when executing this tier:

```
You are setting up the BuildMatch project foundation.

**Goal**: Establish environment configuration and build setup.

**What to do**:
1. Create .env.local, .env.staging, .env.production files at project root
2. Add to .gitignore: .env.local and .env.*.local
3. Create docs/ENVIRONMENT_SETUP.md documenting all variables
4. Run npm run lint and npm run type-check; ensure both pass
5. Test with: npx expo start (watch for env-related output)

**Constraints** (from codex-config.md):
- No secrets (.env.local is git-ignored)
- Use EXPO_PUBLIC_ prefix for client-side vars
- Document every variable in a table
- Keep configuration files under 100 lines

**Acceptance Criteria**:
- .env files created and configured
- .gitignore updated
- Documentation complete
- Linting and type-checking pass
- No console errors on startup

**Files to touch**:
- .env.local (new)
- .env.staging (new)
- .env.production (new)
- .gitignore (edit)
- docs/ENVIRONMENT_SETUP.md (new)

**When done**: Update progress-plan.md (mark Tier 1 as Complete), add entry to change-log.md with date and what was completed.
```

---

**Last Updated**: 2026-04-13  
**Next Tier**: 02-authentication.md
