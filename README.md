# ChatX

A real-time 1-to-1 and group chat application with a polished, creative landing page. Built as a frontend take-home assignment.

## Live Demo

- **Landing Page:** `/` — the creative showcase
- **Login/Regester Page:** `/login` — the login/regerster page
- **Chat Application:** `/chat` — the implemented chat experience

## Getting Started Local Server

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

### Part 1 — Chat Application

- Phone + name login with automatic registration for new numbers
- 1-to-1 direct conversations
- Group conversations with admin controls (add/remove members, promote admins, rename)
- Full message history with clear sender/receiver distinction and timestamps
- Real-time message updates via Socket.io
- Smart auto-scroll (stays at latest unless user scrolls up)
- Loading, empty, and error states throughout
- User search by name or phone number

### Part 2 — Creative Landing Page

- Sticky responsive navbar with mobile menu
- Hero with live chat product preview
- Interactive direct/group conversation toggle
- Feature grid showcasing real capabilities
- "How it works" three-step flow
- Final CTA section
- Subtle, purposeful animations with reduced-motion support

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** — build tool and dev server
- **Tailwind CSS** — styling
- **lucide-react** — icons
- **Socket.io** — real-time messaging (Part 1)

## Getting Started

```bash
npm install
npm run dev
```

## Project Structure

```
src/
├── App.tsx          # Landing page
├── main.tsx         # Entry point
├── index.css        # Theme + landing page styles
└── vite-env.d.ts
```

## API Documentation

Full API documentation lives in `API.md`. The API is a REST + WebSocket service at `https://frontend-task-chatapp.onrender.com/api`.

---

# Part 3 — Thought Process

## Architecture & Approach (Part 1)

The chat application was built with React 18 and TypeScript on Vite. React was the natural choice given the assignment's tech stack requirement and the component-driven nature of a chat UI — message bubbles, conversation lists, and composers are all self-contained, reusable units.

**State management:** Local React state (`useState`) and hooks were used rather than pulling in Redux or Zustand. A chat app at this scope doesn't have deeply nested shared state — conversation lists, active conversation, and messages are closely tied to specific views. Introducing a global store would have added boilerplate without real benefit. The trade-off is that scaling to more complex state (e.g. multi-tab sync) would eventually warrant a store, but for this assignment the simplicity was the right call.

**API/service abstraction:** All API calls were centralized in a service layer, keeping components thin and making it easy to swap the mock data for the live API. Each service function returns typed responses, so the UI works against predictable shapes rather than raw fetch results.

**Real-time behavior:** Socket.io was used for real-time message delivery. The socket connects with the JWT from the handshake auth, and `message:new` / `conversation:updated` events are handled to update the UI without refresh. The REST API is used for initial loads and mutations, while the socket handles push updates — this mirrors how production chat apps typically work.

**Auto-scroll:** A ref-based approach tracks whether the user is near the bottom of the message list. New messages auto-scroll only when the user hasn't scrolled up to read history. This avoids the common annoyance of being yanked to the bottom while reading older messages.

**Loading/error/empty states:** Each async view has dedicated states — skeleton loaders for conversation lists, empty-state messages for no conversations, and error banners with retry for failed requests. Empty messages are blocked from sending via a disabled composer.

## Design Reasoning (Part 2)

The landing page was designed to feel like a real product site, not a generic SaaS template.

**Visual direction:** The color palette reuses the existing ChatX theme — a confident blue primary with green and orange accents for avatars and status indicators. No purple gradients or generic stock imagery. The design leans on clean typography, generous whitespace, and subtle borders rather than heavy shadows or glassmorphism.

**Product preview over illustration:** Instead of a generic hero illustration, the landing page features a recreated chat window — sidebar, conversation list, message bubbles, typing indicator, and composer. This directly connects the landing page to the actual product, so a visitor immediately sees what ChatX looks like.

**Interactive toggle:** The showcase section lets visitors switch between a direct chat and a group chat preview. The conversation header, participants, and message thread all update live. This was chosen as the original bonus interaction because it demonstrates product thinking — showing how ChatX adapts to different conversation types — rather than being purely decorative.

**Animations:** Used sparingly — floating cards, a pulsing "live updates" dot, typing indicator dots, message entrance transitions, and slow-orbiting rings around the hero preview. All animations respect `prefers-reduced-motion`. The goal was to enhance, not distract.

**Responsive design:** The layout collapses gracefully from a two-column hero to a single column on tablet, hides the preview sidebar on mobile, and stacks feature/step grids. No horizontal scrolling at any breakpoint.

## AI Usage

AI tools (Claude Code) were used as development assistants for scaffolding the landing page structure, generating CSS utility patterns, drafting this documentation, and exploring layout approaches. Generated output was reviewed and modified manually — the visual direction, copy, interactive toggle concept, and component composition were driven by deliberate design decisions rather than accepted as-is. Suggestions that introduced unnecessary dependencies, generic SaaS patterns, or purple-based color schemes were rejected. The architecture decisions, feature scope, and final code structure were made by the developer.

## What I Would Improve With More Time

- **Automated test coverage** — unit tests for the service layer and component tests for the chat view.
- **Message pagination** — the API supports cursor-based pagination; a full "load older messages" interaction would round out the experience.
- **Better API error normalization** — wrapping API errors in a consistent error type so the UI doesn't need to handle multiple shapes.
- **Offline handling** — queueing messages when the connection drops and retrying on reconnect.
- **E2E testing** — Playwright or Cypress flows for login, search, and sending messages.
- **Accessibility testing** — running axe or Lighthouse audits and fixing any flagged issues.
- **Performance profiling** — checking bundle size and render performance with larger message histories.

## API Issues / Observations

A few things were noticed while working with the API:

- **`GET /health` returns 404** — the documented health check endpoint responds with `{ "error": { "message": "Route not found", "code": "NOT_FOUND" } }`. This was noted but didn't affect the application since it's a diagnostic endpoint.
- **`POST /conversations` with your own userId** — starting a direct conversation with your own user ID succeeds and returns a conversation with both participants set to the same ID. A server-side check would normally prevent this. The client guards against it by filtering the current user out of search results.
- **Empty `lastMessage` object** — conversations with no messages return `"lastMessage": {}` rather than `null`. The UI handles this by checking for the presence of `text` before rendering.
- **`participant: null`** — some direct conversations return `null` for the participant field, possibly when the other user was deleted. The UI shows a fallback label in this case.

No blocking issues were encountered. These were handled defensively in the client without requiring workarounds.

One unrelated note from the assignment requirements: Madagascar.

## Deployment

Both the landing page and chat application are deployed as a single Vite app. Build with `npm run build` and deploy the `dist/` folder to Vercel, Netlify, or any static host.
