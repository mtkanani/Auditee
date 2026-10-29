# Auditee

Practice-management SaaS for CA / audit firms: clients, tasks, compliance deadlines, invoices, attendance, leave, documents, meetings, reports.
Roles: SUPER_ADMIN, FIRM_ADMIN, USER/EMPLOYEE, CLIENT.

## Layout
- `Backend/` — Node 18+, Express, Prisma (PostgreSQL). Entry `src/index.js`, app `src/app.js`. Feature modules in `src/modules/<module>/` (`*.routes.js`, `*.controller.js`, `*.service.js`, `*.repository.js`, `*.validation.js`).
- `frontend/` — React 19, Vite 8, Tailwind 4 (`@tailwindcss/vite`), React Router 7, TanStack React Query 5.
- Deploy: frontend on Vercel (`vercel.json`) or nginx (`frontend/nginx.conf`); backend on a Dokploy VPS, built from `Backend/Dockerfile` (port 8080). Domains go through Cloudflare.
  - Backend env vars are set in Dokploy → app → Environment (redeploy after changes). The frontend needs `VITE_API_URL` set in Vercel (baked in at build time, so redeploy after changes); without it a deployed build cannot reach the API.
  - There is no Railway setup any more; don't add Railway URLs or config back.

## Commands
- Frontend: `cd frontend && npm run dev | npm run build | npx oxlint src`
- Backend: `cd Backend && npm run dev`; schema change → `npx prisma migrate dev --name <name>`
- Always run `npm run build` and `npx oxlint src` (0 errors) before saying frontend work is done.

## Frontend conventions (follow these)
- **Data fetching:** only through React Query hooks in `src/queries/use<Module>.js`. Query keys live in `src/queries/keys.js`. Never fetch inside `useEffect`. Paginated/searchable lists use `placeholderData: keepPreviousData`. Mutations invalidate their module keys and `dashboardKeys.all` when dashboard numbers change.
- `src/lib/queryClient.js` is the single QueryClient. `AuthContext` calls `queryClient.clear()` on login and logout — keep that.
- Services in `src/services/*Service.js` wrap axios (`services/axiosInstance.js`). Role-dependent base URLs use `getRole()` from `utils/helpers.js` (reads `userData` in localStorage).
- **UI:** pop-ups use `components/common/Modal` (accessible, focus-trapped, stackable; props `title, maxWidth, headerActions, footer`). Confirmations use `useConfirm()` from `components/common/ConfirmProvider` — never `window.confirm`/`alert`. Loading: `TableSkeleton` / `CardSkeleton` from `components/common/Skeleton`; empty lists: `components/common/EmptyState`. `DataTable` takes `isLoading` and `emptyState`.
- Icons: `lucide-react` only. Toasts: `react-hot-toast` only. Font: self-hosted `@fontsource-variable/inter`.
- Routes are lazy-loaded in `src/routes/AppRoutes.jsx`; heavy libraries (recharts, fullcalendar, framer-motion) must not end up on the login page.
- Do not change visual design unless asked. Keep components under ~250 lines; large screens are folders (`<Name>/index.jsx` + section files), e.g. `pages/firm-admin/Reports/`.

## Backend conventions
- Prisma schema has performance `@@index`es on firmId/deletedAt/status etc. Add an index for any new frequently filtered column.
- No N+1: aggregate with `groupBy` / `_count` / `_sum`, batch lookups with `in: [...]`, run independent queries with `Promise.all`.
- Emails are stored lowercase; look them up with exact match (indexed), not `mode: 'insensitive'`.
- `middlewares/auth.middleware.js` caches sessions for 60s; call `invalidateSessionCache(token)` wherever sessions are deleted.

## Git workflow
- Work on a branch per task (`refactor/...`, `ui/...`, `fix/...`), commit per step, merge to `main` only after the manual checklist passes.

## Roadmap (what's left)
- **Phase 5B — split large files, one per branch, in this order:** AddMasterClientModal (787 lines) → ClientDetailModal (720) → LeadDetailModal (666) → FirmTaskManagement (584) → Compliance (570) → InAppVideoRoom (569) → InvoiceDetailModal (546) → DualPanelAssignment (544) → LeaveManagement (479) → UserManagement (472) → FirmForm (469) → ClientPaymentModal (464) → TaskDetailModal (461) → LeadManagement (436) → Register (413) → ClientManagement (402).
  Pure refactor: same behaviour and markup, outer export name and import path unchanged, index.jsx < 200 lines.
- **Phase 6 — accessibility and responsiveness:** `aria-label` on icon-only buttons; check every table and kanban at 375px (scroll or cards); keyboard-only pass through login → tasks → create invoice.
- **Phase 7 (optional) — light theme:** move hard-coded colours (`bg-slate-950` etc.) into CSS variables in `src/index.css` first, then add light values.
- **Backend follow-ups:** invoice numbers use `count + 1` (race condition / duplicates after delete) → use a per-firm counter in a transaction or a Postgres sequence. `npm start` runs `prisma db push`; switch to `prisma migrate deploy`. Client accounts can't use delete-account (service only looks up `users`).
<!-- cloude-code-toolbox:mcp-skills-awareness-begin -->

### MCP & Skills awareness (Claude Code ToolBox)

_Last synced: 2026-10-27T11:17:09.628Z._

- **Full report:** `.claude/cloude-code-toolbox-mcp-skills-awareness.md` in this workspace (auto-overwritten on each scan). Use it as ground truth for configured servers and skill folders.
- **MCP:** For **live tools** in Claude Code, enable the matching server via `/mcp`. Servers are configured in `~/.claude.json` (user) and `.mcp.json` (project).
- **When the user’s task matches a server** (e.g. Confluence work and a **Confluence** / **Atlassian** MCP is listed), **prefer that server id** and plan on tool use—not only file search.
- **Skills:** Folders below contain `SKILL.md`; attach or cite paths in chat when relevant.

#### Workspace MCP

- `e:\Auditee\Auditee\.mcp.json` _(workspace: Auditee)_ — _file missing_

_No active workspace servers in mcp.json._

#### User MCP

- `C:\Users\archa\.claude.json` — _no servers defined_

_No active user-scoped servers in mcp.json._

#### Project skills

_None found (or no workspace open)._

#### User skills

_None found._

<!-- cloude-code-toolbox:mcp-skills-awareness-end -->
