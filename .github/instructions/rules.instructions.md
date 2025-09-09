---
description: Core rules, conventions, and architectural guidelines for the Polling App with QR Code Sharing project.
---

# Polly - Polling App with QR Code Sharing

## 🎯 Project Context
This is a full-stack polling application built with Next.js 15, TypeScript, and Supabase. Users can register, create polls, share them via unique links and QR codes, and vote on polls in real-time.

**CRITICAL**: Adhere strictly to all rules, patterns, and conventions outlined in this document. Every code suggestion must comply with these guidelines.

## Technology Stack
The project uses the following technologies. Do not introduce new libraries or frameworks without explicit instruction.

- Language: TypeScript
- Main Framework: Next.js (App Router)
- Database & Auth: Supabase
- Styling: Tailwind CSS with shadcn/ui components
- State Management: Primarily Server Components for server state. Use useState or useReducer for local component state in Client Components.
- API Communication: Use Next.js Server Actions for mutations (creating polls, voting). Fetch data in Server Components using the Supabase client.
- Utility Libraries: A library like qrcode.react for generating QR codes.


## Architecture & Code Style

- Directory Structure: Follow the standard Next.js App Router structure.
    - `/app` for routes and pages.
    - `/components/ui` for `shadcn/ui` components.
    - `/components/` for custom, reusable components.
    - `/lib` for Supabase client setup, utility functions, and Server Actions.

- Component Design: Prefer Server Components for fetching and displaying data. Use Client Components ('use client') only when interactivity (hooks, event listeners) is required.
- Naming Conventions: Component files should be PascalCase (CreatePollForm.tsx). Utility and action functions should be camelCase (submitVote.ts).
- Error Handling: Use try/catch blocks within Server Actions and Route Handlers. Use Next.js error.tsx files for handling errors within route segments.
- API Keys & Secrets: Never hardcode secrets. Use environment variables (.env.local) for Supabase URL and keys, accessed via process.env.NEXT_PUBLIC_SUPABASE_URL and process.env.SUPABASE_SECRET_KEY.

## Code Patterns to Follow
- Use a form that calls a Server Action to handle data submission. This keeps client-side JavaScript minimal.
- Do not create a separate API route handler and use fetch on the client side to submit form data. Use Server Actions instead.
- Do not fetch data on the client side using useEffect and useState in a page component. Fetch data directly in a Server Component.

## Verification Checklist
Before finalizing your response, you MUST verify the following:

- Does the code use the Next.js App Router and Server Components for data fetching?
- Are Server Actions used for data mutations (forms)?
- Is the Supabase client used for all database interactions?
- Are shadcn/ui components used for the UI where appropriate?
- Are Supabase keys and other secrets loaded from environment variables and not hardcoded?

## 🚫 What NOT to Do

- Never use `useEffect` and `useState` for server data fetching in pages
- Never create API routes when Server Actions can be used
- Never hardcode Supabase keys or URLs
- Never use client components unless interactivity is required
- Never introduce new dependencies without explicit permission
- Never ignore TypeScript errors or use `any` types unnecessarily

## ✅ Code Examples

### Correct Server Component Pattern:
```tsx
// app/polls/page.tsx
import { supabase } from '@/lib/supabase'

export default async function PollsPage() {
  const { data: polls } = await supabase.from('polls').select('*')
  
  return (
    <div>
      {polls?.map(poll => <PollCard key={poll.id} poll={poll} />)}
    </div>
  )
}
```

### Correct Server Action Pattern:
```tsx
// lib/actions.ts
'use server'

import { supabase } from '@/lib/supabase'

export async function createPoll(formData: FormData) {
  const title = formData.get('title') as string
  
  const { error } = await supabase
    .from('polls')
    .insert({ title })
    
  if (error) throw error
}
```

### Correct Form with Server Action:
```tsx
// components/CreatePollForm.tsx
import { createPoll } from '@/lib/actions'

export function CreatePollForm() {
  return (
    <form action={createPoll}>
      <input name="title" required />
      <button type="submit">Create Poll</button>
    </form>
  )
}
```

## 🎯 Priority Rules
1. **Server-first**: Always prefer server components and server actions
2. **Type Safety**: Use TypeScript strictly with proper types
3. **Performance**: Minimize client-side JavaScript
4. **Security**: Never expose sensitive data or keys
5. **Consistency**: Follow established patterns throughout the codebase