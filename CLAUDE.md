# CLAUDE.md

Instructions for Claude Code when working in this repository.

## Repository layout (Turborepo + pnpm)

```
apps/
  web/            Next.js app — UI only. Calls the API over HTTP. No business logic here.
  api/            Hono REST API (standalone Node server). ONE backend shared by web, desktop and mobile.
  desktop/        (future) desktop client — consumes the same API
  mobile/         (future) mobile client — consumes the same API
packages/
  shared/         Framework-agnostic: zod schemas, inferred types, endpoint path constants, error shape
  api-client/     (to create) Framework-agnostic axios instance + per-feature API functions + query keys
  ui/             Web UI package (@repo/ui): shadcn components, hooks, utils, theme CSS
  eslint-config/  tsconfig/   shared tooling
```

Rules of the layout:

- **The API is global.** Never put business logic in `apps/web` (no Next.js route handlers for app features). Web, desktop and mobile all talk to `apps/api`, so every endpoint must work for any client: JSON in/out, `Authorization: Bearer <token>` auth (not cookies), no web-only assumptions.
- **`packages/shared` is the contract.** Request/response shapes are zod schemas defined once in `packages/shared` and imported by `apps/api` (to validate) and every client (to type and parse). Never redefine a type on one side.
- **Dependency direction:** `apps/*` -> `packages/*`. `packages/shared` and `packages/api-client` must not import React, Next.js, Hono, or any platform API.
- **Shared code lives in packages, not copied between apps.** See "Reuse first" below.

## Reuse first (no repeated code)

Before writing anything, search the repo for an existing component, hook, function, schema, or constant that already does it (`Grep`/`Glob`, then `packages/ui`, `apps/web/src/components`, `apps/web/src/hooks`, `apps/web/src/lib`, `packages/shared`). Extend or reuse it; do not write a second version.

- **Second use = extract.** The moment the same JSX, logic, regex, type, or constant is needed a second time, extract it to the right home below and import it from both places. Do not copy-paste "just this once".
- **Compose, don't fork.** Need a variation? Add a prop/variant/option to the existing component or function instead of cloning it. For UI, use `packages/ui` components (`Button`, `Card`, `Dialog`, `Empty`, `Skeleton`, `Spinner`, …) before writing custom markup.
- **One home per kind of thing:**

| What | Where |
|---|---|
| Design-system primitives (shadcn) | `packages/ui/src/components` (generated — see exception below) |
| Cross-feature web component (used by 2+ features) | `apps/web/src/components/` |
| Feature-only component | `apps/web/src/features/<feature>/_components/` |
| Cross-feature hook (`useDebounce`, `useDisclosure`…) | `apps/web/src/hooks/` |
| Feature-only hook (TanStack query/mutation) | `apps/web/src/features/<feature>/hook/` |
| Pure helper (formatting, parsing, `getErrorMessage`) | `apps/web/src/lib/` — or `packages/shared` if desktop/mobile need it too |
| Zod schema / type / endpoint path / enum / constant used by API **and** a client | `packages/shared` |
| axios instance, API functions, query keys used by more than one client | `packages/api-client` |
| API middleware (auth, error handling, validation) | `apps/api/src/middleware/` — never inline per route |

- Extract repeated patterns inside a single file too (a local helper beats three near-identical blocks).
- Keep extracted units small and single-purpose; name them for what they do, and add the comment required below.

## Code flow

```
apps/web/src/app/**/page.tsx                      thin page: renders one feature view, nothing else
  -> features/<feature>/_components/*-view.tsx    UI; consumes hooks only (no axios, no toasts)
    -> features/<feature>/hook/use-*.ts           TanStack Query hooks (queries, mutations, toasts, invalidation)
      -> features/<feature>/api/index.ts          axios functions only (or re-export from @repo/api-client)
        -> HTTP  ->  apps/api  routes -> service  (validated with schemas from @repo/shared)
```

API side (`apps/api/src`):

```
index.ts                    boot: create app, mount routers, serve()
app.ts                      (optional) app factory: global middleware (cors, error handler, auth)
modules/<feature>/
  <feature>.routes.ts       Hono router: parse + validate input, call service, return JSON. NO business logic.
  <feature>.service.ts      business logic + data access. Framework-free, unit-testable.
middleware/                 auth, error handler, request validation helpers
lib/                        env, db client, shared server helpers
```

- Routes are thin: validate with the zod schema from `@repo/shared`, call the service, return typed JSON. Services never touch `Context`.
- Every error response uses the shared error shape (`{ error: { code, message } }`, defined in `packages/shared`) via one global error handler — never hand-build error JSON in a route.
- CORS: `WEB_ORIGIN` accepts a comma-separated allowlist so web, desktop and mobile dev origins can all be listed. Native/desktop clients don't send browser cookies, which is why auth is Bearer-token based.
- Adding an endpoint = (1) schema + types in `packages/shared`, (2) service + route in `apps/api/src/modules/<feature>`, (3) API function (+ query key) in the client layer, (4) hook in the feature. Do them in that order and don't skip a layer.

## Calling the API (TanStack Query v5 + axios)

All client-side API calls go through TanStack Query v5 + axios, layered per feature. Check the TanStack Query docs (Context7) for v5 API details before writing non-trivial usage.

### Setup

- `@tanstack/react-query` is installed and `apps/web/src/app/providers.tsx` holds the single `QueryClient` (already mounted in `app/layout.tsx`). Tune defaults there (30s `staleTime`, no retry on 4xx) — don't create other `QueryClient`s.
- **To create (axios is not installed yet):** add `axios`, then one shared instance `api` — `baseURL` from `process.env.NEXT_PUBLIC_API_URL` (default `http://localhost:4000`), a request interceptor that attaches the Bearer token. Paths are relative to the base: `"/logs"`, not `"http://…/logs"`. Never call `fetch`/`axios.create` ad hoc in components or hooks. (The current `app/page.tsx` health check uses `fetch` directly — migrate it to this layer when touching it.)
- **To create:** `getErrorMessage(error, fallback)` — reads the shared error shape from an axios error. One definition; never re-define it in a hook file.
- When desktop/mobile are added, move the `api` instance factory (`createApiClient({ baseUrl, getToken })`), API functions, and query keys into `packages/api-client` so all clients import the same code. Hooks stay per-app because toasts/navigation are platform-specific.
- Parse responses with the shared zod schema when the data crosses a trust boundary (`healthSchema.parse(data)`); otherwise rely on the typed generic.

### API functions — `features/<feature>/api/index.ts`

- `const` + arrow, relative URLs, typed generics (types from `@repo/shared`), return the unwrapped `data`.
- GET params go in `{ params }`; DELETE bodies go in `{ data }`.

```ts
// Fetches a page of run logs.
export const getLogs = async ({ page, pageSize }: { page: number; pageSize: number }) => {
  const { data } = await api.get<LogsResponse>("/logs", { params: { page, pageSize } });
  return data;
};
```

### Query hooks — `features/<feature>/hook/use-<x>.ts`

- Names: `useGet<Plural>` for lists, otherwise verb-first (`useAgentTools`). Extension is `.ts` unless the file contains JSX.
- Query keys are kebab-case arrays: `["get-logs", page, pageSize]`. Reuse the exact same key when invalidating; if a key is shared across features, export it from one constants file (no retyped string literals).
- Use `enabled` for gated fetches, `placeholderData: keepPreviousData` for pagination, and an optional `options?: { refetchInterval?: number }` argument for opt-in polling.

```ts
// Paginated run logs; keeps the previous page visible while the next one loads.
export const useGetLogs = (page: number, pageSize: number, options?: { refetchInterval?: number }) =>
  useQuery({
    queryFn: () => getLogs({ page, pageSize }),
    queryKey: ["get-logs", page, pageSize],
    placeholderData: keepPreviousData,
    refetchInterval: options?.refetchInterval,
  });
```

### Mutation hooks

Every mutation has `mutationFn`, `mutationKey` (kebab-case verb phrase), `onSuccess` (invalidate the owning query key + success toast) and `onError` (error toast using `getErrorMessage`). No optimistic updates unless explicitly requested. If several mutations repeat the same invalidate-and-toast logic, extract a small shared helper instead of repeating it.

```ts
// Deletes an agent, then refreshes the agents list.
export const useDeleteAgent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAgent,
    mutationKey: ["delete-agent"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-agents"] });
      toast.success("Agent deleted");
    },
    onError: (error) => {
      toast.error("Couldn't delete agent", { description: getErrorMessage(error, "Please try again.") });
    },
  });
};
```

- Toasts use `toast` from `sonner` (the `Toaster` is mounted in `providers.tsx`).
- Components pass per-call callbacks only for UI follow-up: `mutate(vars, { onSuccess: () => onOpenChange(false) })`.
- Extra variables used only for the toast (e.g. `agentName`) may ride along in the mutation variables; note that in a comment.
- Per-item pending state: `mutation.isPending && mutation.variables?.id === item.id`.

### Components

Render states in this order: `isPending` -> `isError` -> empty -> data. Use `isPending` consistently (not `isLoading`). Use the shared `Skeleton`, `Empty`, `Alert`, and `Spinner` from `@repo/ui` for those states — one loading/empty/error treatment, not a custom one per view. Mutation buttons: `disabled={isPending}`, a `Spinner`, and a label swap ("Saving…").

## Function/component declaration style

| What you're writing | Style |
|---|---|
| React component | `const` + arrow, exported directly — `export const NavUser = () => { ... }` |
| Custom hook | `const` + arrow — `export const useIsMobile = () => { ... }` |
| Plain helper/utility function | `const` + arrow — `const getInitials = (name) => { ... }` |
| Default-exported page/layout component | named `const` first, then `export default` — `const Page = () => {...}; export default Page;` |
| Hono route / service function | `const` + arrow — `export const getLogs = async (...) => { ... }`; routes as `router.get("/logs", handler)` |
| Inline/anonymous (event handlers, `.map`/`.filter`, `useEffect`/`useState` bodies) | arrow function |

**Exception:** `packages/ui/src/{components,hooks,lib}` is shadcn CLI output (`function ComponentName(props) { ... }`). Never convert it — leave it in generated style so future `npx shadcn add`/updates don't get overwritten or diverge.

## shadcn / UI

- Add components with the shadcn CLI run from `apps/web` (`pnpm dlx shadcn@latest add <name>`); they land in `packages/ui/src/components`. Import as `@repo/ui/components/<name>`; `cn` is `@repo/ui/lib/utils`.
- After any CLI add, verify imports resolve (no `from "cn"`, no `@/…` inside `packages/ui`) and run `pnpm typecheck`.
- Follow the shadcn skill rules: semantic color tokens, `gap-*` not `space-*`, `FieldGroup`/`Field` for forms, full `Card`/`Dialog` composition.

## Comment style

Every new component, hook, function, and non-obvious variable should carry a short comment explaining intent — not restating the code.

- **Components** get a JSDoc-style block above the declaration, using `@` tags:

  ```tsx
  /**
   * @component NavUser
   * @description Renders the signed-in user's avatar and account dropdown in the sidebar footer.
   */
  export const NavUser = () => { ... }
  ```

  Add `@param` for non-trivial props when it clarifies usage.

- **Hooks, plain functions, API routes/services, and important/non-obvious variables** get a single `//` line directly above them, stating *why*/*what*, not a restatement of the syntax:

  ```ts
  // Tracks whether the viewport is below the mobile breakpoint.
  export const useIsMobile = () => { ... }

  // Extracts up to two initials from a full name for the avatar fallback.
  const getInitials = (name: string) => { ... }

  // Debounce timer id — cleared on unmount to avoid a stray state update.
  const timeoutRef = useRef<NodeJS.Timeout>();
  ```

- Skip comments only for self-evident local variables (loop indices, trivial destructures) and for generated code under `packages/ui`.

## Commands

```bash
pnpm dev          # turbo: web (:3000) + api (:4000)
pnpm typecheck    # run after every change set; must pass
pnpm lint
pnpm build
```

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
