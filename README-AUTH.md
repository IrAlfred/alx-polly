# Polly - Polling App with Supabase Authentication

A modern polling application built with Next.js 15, TypeScript, Supabase, and Shadcn UI components.

## Features

- ✅ **User Authentication** (Supabase Auth)
  - Email/password registration and login
  - Protected routes and pages
  - User profile management
  - Password reset functionality

- ✅ **Poll Management**
  - Create polls with multiple options
  - Real-time voting
  - Poll analytics and results
  - Public and private polls

- ✅ **Modern UI/UX**
  - Responsive design with Tailwind CSS
  - Shadcn UI component library
  - Dark/light mode support
  - Mobile-first approach

## Authentication System

### Setup

The authentication system uses Supabase Auth with the following components:

1. **Supabase Client** (`lib/supabase.ts`)
   - Configured with environment variables
   - Provides auth helper functions
   - Handles session management

2. **Auth Context** (`contexts/auth-context.tsx`)
   - Global authentication state management
   - React Context API for user session
   - Loading states and error handling

3. **Protected Routes** (`components/auth/protected-route.tsx`)
   - Route-level authentication guards
   - Automatic redirects for unauthorized access
   - Loading states during auth checks

### Auth Pages

- **Login**: `/auth/login`
- **Register**: `/auth/register`
- **Forgot Password**: `/auth/forgot-password`

### Protected Routes

- **Dashboard**: `/dashboard` (requires authentication)
- **Create Poll**: `/polls/create` (requires authentication)
- **User Settings**: `/settings` (requires authentication)

### Environment Variables

Create a `.env.local` file with your Supabase credentials:

\`\`\`bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

## Getting Started

### Installation

\`\`\`bash
npm install
\`\`\`

### Development

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Production

\`\`\`bash
npm run build
npm start
\`\`\`

## Project Structure

\`\`\`
src/
├── app/                    # Next.js 15 App Router pages
│   ├── auth/              # Authentication pages
│   │   ├── login/         # Login page
│   │   ├── register/      # Registration page
│   │   └── forgot-password/ # Password reset
│   ├── dashboard/         # Protected dashboard
│   ├── polls/             # Poll-related pages
│   │   ├── create/        # Create poll (protected)
│   │   └── [id]/         # View poll details
│   └── layout.tsx         # Root layout with AuthProvider
├── components/
│   ├── auth/              # Authentication components
│   │   ├── login-form.tsx
│   │   ├── register-form.tsx
│   │   ├── user-profile.tsx
│   │   └── protected-route.tsx
│   ├── polls/             # Poll-related components
│   └── ui/                # Shadcn UI components
├── contexts/
│   └── auth-context.tsx   # Authentication context
├── lib/
│   ├── supabase.ts        # Supabase client configuration
│   └── utils.ts           # Utility functions
└── types/
    └── index.ts           # TypeScript type definitions
\`\`\`

## Authentication Flow

1. **Registration**:
   - User fills registration form
   - Account created in Supabase Auth
   - Email verification sent (optional)
   - User logged in automatically

2. **Login**:
   - User enters email/password
   - Supabase validates credentials
   - Session created and stored
   - User redirected to dashboard

3. **Protected Routes**:
   - Auth state checked on route access
   - Unauthorized users redirected to login
   - Loading states shown during auth checks

4. **Logout**:
   - Session cleared from Supabase
   - User state reset in context
   - Redirect to home page

## Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Supabase** - Backend as a Service (Auth, Database, Storage)
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn UI** - Modern React component library
- **Lucide React** - Beautiful SVG icons

## Key Features Implemented

### ✅ Complete Authentication System
- User registration and login
- Session management
- Protected routes
- Password reset
- User profile dropdown

### ✅ Modern UI Components
- Responsive design
- Form validation
- Loading states
- Error handling
- Toast notifications

### ✅ Type Safety
- Full TypeScript integration
- Type-safe API calls
- Component prop validation
- Error type handling

## Next Steps

To extend the authentication system:

1. **Email Verification**: Implement email confirmation flow
2. **Social Auth**: Add Google, GitHub, or other OAuth providers  
3. **Role-Based Access**: Implement user roles and permissions
4. **Profile Management**: Add user profile editing capabilities
5. **Session Management**: Implement session timeout and refresh

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
