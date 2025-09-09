# Polly - Next.js Polling Application

A modern, responsive polling application built with Next.js, TypeScript, and Shadcn UI components.

## 🚀 Features

### ✅ Implemented (Scaffolded)
- **User Authentication**
  - Login and registration forms
  - User profile management
  - Mock authentication system
- **Poll Management**
  - Create polls with multiple options
  - View all polls
  - Poll details with real-time results
  - Vote on polls
- **Dashboard**
  - User statistics
  - Manage personal polls
  - Analytics overview
- **Responsive UI**
  - Modern design with Shadcn UI
  - Mobile-friendly interface
  - Dark/light theme support

### 🔄 Ready for Implementation
- Real authentication (NextAuth.js, Auth0, etc.)
- Database integration (PostgreSQL, MongoDB, etc.)
- Real-time voting with WebSockets
- Poll sharing and embedding
- Advanced analytics
- Email notifications
- Poll expiration handling

## 📁 Project Structure

```
alx-polly/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with AuthProvider
│   ├── page.tsx                 # Homepage with landing page
│   ├── auth/                    # Authentication pages (placeholder)
│   ├── polls/
│   │   ├── page.tsx            # All polls listing
│   │   ├── create/
│   │   │   └── page.tsx        # Create new poll
│   │   └── [id]/
│   │       └── page.tsx        # Individual poll details
│   └── dashboard/
│       └── page.tsx            # User dashboard
├── components/
│   ├── auth/                    # Authentication components
│   │   ├── login-form.tsx      # Login form with validation
│   │   ├── register-form.tsx   # Registration form
│   │   └── user-profile.tsx    # User profile dropdown
│   ├── layout/                  # Layout components
│   │   ├── header.tsx          # Navigation header
│   │   └── footer.tsx          # Site footer
│   ├── polls/                   # Poll-related components
│   │   ├── create-poll-form.tsx # Create poll form
│   │   ├── poll-card.tsx       # Poll display card
│   │   ├── poll-details.tsx    # Detailed poll view
│   │   └── poll-list.tsx       # List of polls
│   └── ui/                      # Shadcn UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── ... (other UI components)
├── hooks/                       # Custom React hooks
│   ├── use-auth.tsx            # Authentication context & hook
│   └── use-polls.tsx           # Poll management hook
├── lib/
│   └── utils.ts                # Utility functions (cn, etc.)
├── types/
│   └── index.ts                # TypeScript type definitions
└── public/                     # Static assets
```
