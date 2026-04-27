# Concerns

**Analysis Date:** 2026-04-26

## Known Issues

| Issue                        | Location                | Severity | Notes                                                                       |
| ---------------------------- | ----------------------- | -------- | --------------------------------------------------------------------------- |
| No application code exists   | Project not initialized | high     | The Next.js application has not been created yet - only planning docs exist |
| Hardcoded API keys in config | `.env`, `.mcp.json`     | high     | API keys and tokens are hardcoded in plaintext                              |

## Technical Debt

| Item                        | Impact                         | Effort | Location               |
| --------------------------- | ------------------------------ | ------ | ---------------------- |
| Project not initialized     | Cannot run or deploy the store | high   | No Next.js app created |
| Missing package.json        | No way to install dependencies | high   | Root directory         |
| No TypeScript/ESLint config | No code quality tooling        | medium | Not created yet        |
| No Tailwind setup           | No styling system              | medium | Not created yet        |
| No test setup               | No testing infrastructure      | low    | Not created yet        |

## Security Concerns

| Concern                                    | Severity | Location            |
| ------------------------------------------ | -------- | ------------------- |
| Hardcoded Gemini API key in `.env`         | high     | `.env:2`            |
| Hardcoded Google Auth token in `.mcp.json` | high     | `.mcp.json:16`      |
| Hardcoded 21st Dev API key in `.mcp.json`  | high     | `.mcp.json:24`      |
| No environment variable rotation process   | medium   | Project setup       |
| Secrets in committed config files          | high     | `.env`, `.mcp.json` |

**Details:**

1. **`.env` file contains hardcoded API key:**

   ```
   GEMINI_API_KEY='AIzaSyAODXGfjctBP6wb_g7disLxEEzWauIGkQo'
   ```

   This API key is committed to the repository.

2. **`.mcp.json` contains multiple hardcoded credentials:**
   - `GOOGLE_AUTH_TOKEN` (line 16)
   - `API_KEY` for 21st Dev (line 24)
   - `GEMINI_API_KEY` duplicated (line 7)

## Performance Concerns

| Concern                   | Impact                                 | Location                |
| ------------------------- | -------------------------------------- | ----------------------- |
| No application to measure | N/A                                    | Project not initialized |
| Static JSON data source   | Limited scalability for large catalogs | `data/products.json`    |
| No image optimization     | Large images will slow load times      | Not implemented         |

## Improvement Opportunities

| Area                            | Description                          | Priority |
| ------------------------------- | ------------------------------------ | -------- |
| **Initialize Next.js project**  | Create the actual application code   | high     |
| **Move secrets to environment** | Use env vars, remove hardcoded keys  | high     |
| **Add package.json**            | Define dependencies and scripts      | high     |
| **Set up type checking**        | Add TypeScript configuration         | medium   |
| **Add testing framework**       | Set up Vitest or Jest                | low      |
| **Add CI/CD**                   | Set up GitHub Actions for deployment | low      |

## Dependencies to Update

| Package | Current | Recommended | Risk |
| ------- | ------- | ----------- | ---- |
| None    | N/A     | N/A         | N/A  |

_Note: No dependencies exist yet because the project has not been initialized._

## Project State Summary

**Current State:** Pre-initialization - The project exists only as documentation and planning files.

| Planned Component           | Status         |
| --------------------------- | -------------- |
| `app/` (Next.js App Router) | Not created    |
| `components/`               | Not created    |
| `context/CartContext.tsx`   | Not created    |
| `lib/whatsapp.ts`           | Not created    |
| `package.json`              | Not created    |
| Tailwind CSS                | Not configured |
| TypeScript                  | Not configured |

## Action Items

1. **Remove hardcoded secrets** from `.env` and `.mcp.json` before any real code exists
2. **Initialize Next.js project** with `npx create-next-app@latest`
3. **Set up proper environment variable handling** using Next.js env var system
4. **Add package.json** with required dependencies

---

_Concerns audit: 2026-04-26_
