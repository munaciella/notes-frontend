# QuillNote Frontend

This project is a frontend for the QuillNote app, which is a simple Markdown note-taking application. It features a two-pane layout with a sidebar for notes and an editor/viewer for Markdown content. The app uses Clerk for authentication and has a responsive design that works well on both desktop and mobile devices.

---

## Live Demo
![QuillNote]()

---

## Live Demo Disclaimer

Please note that the live demo linked above is intended **only** for development and testing. To keep hosting costs low:
- New user registrations may be restricted or disabled at any time.
- Some features may be unstable or unavailable.
- Use this demo **at your own risk**; do **not** rely on it for production data.

---

## Employer / Hiring Inquiries

If you’re an employer interested in leveraging this project, or if you encounter an issue you’d like me to solve, please reach out!  
Email me at: **francesco.vurchio82@gmail.com** with:
1. A brief description of the problem or feature you need, and  
2. Any relevant deadlines or context.  
I’ll get back to you as soon as possible.

---

A Next.js + TypeScript web client for the QuillNote app, featuring:

* **Next.js 14** (App Router / Server & Client Components)
* **TypeScript** throughout
* **Tailwind CSS** + **shadcn-ui** components
* **Clerk** for authentication
* **Fetch API** hooks to your Express backend
* **Markdown editor** with live preview
* **Responsive** two-pane layout (sidebar + editor/viewer)

---

## 🚀 Getting Started

### 1. Clone & install

```bash
git clone <your-repo-url>
cd quillnote-frontend
npm install
# or
yarn
```

### 2. Environment Variables

Create a file at the project root named `.env.local` with:

```dotenv
# Clerk (frontend publishable key)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx

# Your backend API base URL
NEXT_PUBLIC_API_URL=https://notes-backend.example.com

# (Optional) NextAuth or Clerk secret if you require server-side auth
# CLERK_SECRET_KEY=sk_test_xxx
```

> **Note:** Clerk’s secret key is only needed in your **backend**; the frontend only uses the public key.

### 3. Run in development

```bash
npm run dev
# or
yarn dev
```

Open your browser at `http://localhost:3000`. The app will reload as you edit.

### 4. Build & deploy

```bash
npm run build
npm start
# or
yarn build && yarn start
```

Use any Node.js-capable host (Vercel, Render, etc.). Make sure to set your environment variables in the hosting dashboard.

---

## 📦 Available Scripts

* **`dev`**: Starts Next.js in development mode (`next dev`)
* **`build`**: Compiles the app for production (`next build`)
* **`start`**: Runs the built app (`next start`)
* **`lint`**: Runs ESLint
* **`format`**: Runs Prettier (if configured)

---

## 🔑 Authentication (Clerk)

1. Sign up at [Clerk.com](https://clerk.com) and create a Next.js application.
2. Copy your **Publishable Key** into `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`.
3. Clerk automatically injects `<ClerkProvider>` in your `_app.tsx` (or via the App Router).
4. Wrap protected pages (`/notes/*`) with `requireAuth()` or client-side `useAuth()` to ensure only signed-in users can view them.

---

## 📂 Project Structure

```
.
├── public/
│   └── logo.png              # Your quill icon
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root layout & <ClerkProvider>
│   │   ├── page.tsx          # Landing / welcome page
│   │   └── notes/            # Notes feature folder
│   │       ├── layout.tsx    # Two-pane layout with sidebar
│   │       ├── page.tsx      # Notes list
│   │       ├── new/
│   │       │   └── page.tsx  # Create new note with <NoteEditor>
│   │       └── [id]/
│   │           └── page.tsx  # Note detail & edit dialog
│   ├── components/           # Shared UI components
│   │   ├── NoteCard.tsx      # Animated note preview card
│   │   ├── NoteEditor.tsx    # Markdown + toolbar + preview
│   │   ├── NotesSidebar.tsx  # Responsive sidebar + sheet
│   │   ├── Navbar.tsx        # Logo + nav links + auth buttons
│   │   └── ui/               # shadcn-ui primitives (Button, Input, Sheet, etc.)
│   ├── context/
│   │   └── notes-refresh.tsx # React Context to force sidebar refresh
│   ├── lib/
│   │   └── api.ts            # `fetcher<T>` wrapper for your backend
│   ├── styles/
│   │   └── globals.css       # Tailwind + theming config
│   └── types/                # Shared TS types (e.g. Note)
├── tailwind.config.js        # Tailwind setup
├── next.config.js            # Next.js config
└── .env.local                # Local environment variables
```

---

## 📝 Key Components

### `fetcher<T>(path, token, options)`

A small wrapper around `fetch` that:

* Prepends `NEXT_PUBLIC_API_URL`
* Attaches `Authorization: Bearer <token>`
* Throws on non-2xx, otherwise returns `T`

### `NoteEditor`

* `<textarea>` + live Markdown preview
* Optional toolbar for headings, bold, lists
* Tag input & validation
* `onSave` callback that calls your backend

### `NotesSidebar`

* Searchable list of notes
* Mobile sheet with hamburger menu & full-screen drawer
* “+” button to create new notes
* Uses a `refreshKey` context to auto-update when notes change

### `NoteCard`

* Wraps a note’s title/summary/tags in a `motion(Link)`
* Animates in and on hover via Framer Motion
* Responsive grid layout

---

## 🎨 Styling

* **Tailwind CSS** with custom theming in `globals.css`
* **shadcn-ui** primitives (Dialog/Sheet, Button, Input) under `src/components/ui`
* Dark/light mode handled by CSS custom properties and a `ThemeToggle` button

---

## 📋 Deployment

* **Vercel**: Just connect your GitHub repo, set env vars in the dashboard, and deploy.
* **Render**: Use a Node.js service, set `npm run start`, and configure env vars.
* **Netlify**: Use the Next.js build plugin and set `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`.
