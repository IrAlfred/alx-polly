# ALX Polly - Modern Polling Application

A comprehensive, production-ready polling application built with Next.js 15, TypeScript, Supabase, and modern React patterns. Create, share, and participate in polls with real-time results and advanced analytics.

## 🎯 Overview

ALX Polly is a full-stack polling platform that enables users to:
- Create sophisticated polls with multiple options and settings
- Participate in real-time voting with instant result updates  
- Manage personal polling campaigns through an intuitive dashboard
- Track detailed analytics and voting patterns
- Share polls across platforms with customizable embed options

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - App Router with Server Components and Client Components
- **TypeScript** - Type-safe development with strict mode enabled
- **React 18** - Modern hooks, context, and concurrent features
- **Tailwind CSS** - Utility-first styling with custom design system
- **Shadcn/ui** - High-quality, accessible component library
- **Lucide Icons** - Consistent iconography

### Backend & Database  
- **Supabase** - PostgreSQL database with real-time subscriptions
- **Row Level Security (RLS)** - Database-level authorization
- **Supabase Auth** - JWT-based authentication with social providers
- **Edge Functions** - Serverless API endpoints

### Development Tools
- **ESLint** - Code linting with Next.js recommended rules
- **Prettier** - Code formatting and style consistency
- **TypeScript Strict Mode** - Enhanced type checking
- **Git Hooks** - Pre-commit validation

## 🚀 Features

### ✅ Core Features (Implemented)
- **🔐 Authentication System**
  - Secure email/password authentication via Supabase Auth
  - JWT token management with automatic refresh
  - Protected routes with middleware-level authorization
  - User session persistence across browser sessions
  
- **📊 Poll Management**
  - Rich poll creation with title, description, and multiple options
  - Real-time poll results with live vote counting
  - Poll visibility controls (public/private)
  - Comprehensive poll analytics and voting patterns
  
- **🗳️ Voting System**
  - Single-choice and multiple-choice voting mechanisms
  - Duplicate vote prevention with user tracking
  - Real-time vote updates using Supabase subscriptions
  - Vote history and audit trails
  
- **📱 User Dashboard**
  - Personal poll management interface
  - Voting history and participation tracking
  - Performance analytics with charts and metrics
  - Account settings and profile management

- **🎨 Modern UI/UX**
  - Fully responsive design optimized for all devices
  - Accessible components following WCAG guidelines
  - Dark/light theme support with system preference detection
  - Smooth animations and micro-interactions

### 🔄 Advanced Features (Ready for Enhancement)
- **Real-time Collaboration** - Live voting sessions with WebSocket connections
- **Poll Embedding** - Shareable widgets for external websites
- **Advanced Analytics** - Geographic voting patterns, time-based analysis
- **Social Integration** - Share polls across social media platforms
- **Email Notifications** - Automated updates for poll creators and participants

## ⚡ Quick Start

### Prerequisites
- **Node.js 18+** - Download from [nodejs.org](https://nodejs.org/)
- **npm/yarn/pnpm** - Package manager (npm comes with Node.js)
- **Supabase Account** - Sign up at [supabase.com](https://supabase.com)
- **Git** - Version control system

### 🔧 Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/IrAlfred/alx-polly.git
   cd alx-polly
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or  
   pnpm install
   ```

3. **Supabase Configuration**
   
   **A. Create a New Supabase Project**
   - Visit [supabase.com](https://supabase.com) and create an account
   - Click "New Project" and fill in the details
   - Wait for the project to be provisioned (usually 2-3 minutes)
   
   **B. Get Your Project Credentials**
   - Go to Settings → API in your Supabase dashboard
   - Copy the "Project URL" and "anon public" API key
   
   **C. Set Up Database Schema**
   - Navigate to SQL Editor in your Supabase dashboard  
   - Copy the contents of `database/supabase_setup.sql`
   - Paste and execute the SQL to create tables and RLS policies

4. **Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Optional: Custom Configuration  
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   # or
   yarn dev 
   # or
   pnpm dev
   ```

6. **Open in Browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

### 🧪 Testing the Setup

1. **Create an Account**
   - Go to `/auth/register`
   - Fill in your email, password, and name
   - Click "Create Account"

2. **Verify Authentication**
   - You should be redirected to the dashboard
   - Check that your name appears in the header navigation

3. **Create Your First Poll**
   - Click "Create Poll" from the dashboard or navigation
   - Add a title: "What's your favorite programming language?"
   - Add options: "JavaScript", "TypeScript", "Python", "Go"  
   - Click "Create Poll"

4. **Test Voting**
   - Navigate to the polls page
   - Click on your newly created poll
   - Vote for an option and verify the results update

## 📖 Usage Examples

### Creating a Poll

```typescript
// Example poll creation data structure
const pollData = {
  title: "What's the best JavaScript framework in 2024?",
  description: "Help us understand the current preferences in the JS ecosystem",
  options: [
    { text: "React", description: "Facebook's UI library" },
    { text: "Vue.js", description: "Progressive framework" },
    { text: "Angular", description: "Full-featured framework" },
    { text: "Svelte", description: "Compile-time optimized" }
  ],
  settings: {
    allowMultipleVotes: false,
    requireAuth: true,
    expiresAt: "2024-12-31"
  }
}
```

### Voting on a Poll

The voting system automatically:
- Prevents duplicate votes from the same user
- Updates results in real-time across all connected clients  
- Maintains vote history for analytics
- Respects poll settings (auth requirements, expiration, etc.)

### Dashboard Analytics

Users can view:
- **Poll Performance**: Vote counts, engagement rates, completion rates
- **Audience Insights**: Voting patterns, peak activity times  
- **Personal Stats**: Polls created, votes received, participation level

## 🏗️ Development

### Project Structure Deep Dive

#### **Authentication Flow** (`/auth/*`)
- `/auth/login` - JWT-based login with Supabase Auth
- `/auth/register` - Account creation with email verification
- `/auth/forgot-password` - Password reset via email

#### **Poll Management** (`/polls/*`)  
- `/polls` - Browse all public polls with filtering and search
- `/polls/create` - Multi-step poll creation wizard
- `/polls/[id]` - Individual poll voting page with real-time results

#### **User Dashboard** (`/dashboard`)
- Personal poll management interface
- Analytics and performance metrics
- Account settings and preferences

### 🔐 Authentication System

The app uses Supabase Auth for secure user management:

```typescript
// Authentication Context provides:
interface AuthContextType {
  user: AuthUser | null           // Current authenticated user
  session: Session | null         // JWT session data
  loading: boolean               // Auth state loading indicator
  signIn: (email, password) => Promise<AuthResult>
  signUp: (email, password, name) => Promise<AuthResult>  
  signOut: () => Promise<void>
}
```

### 🗃️ Database Schema

**Core Tables:**
- `users` - User profiles and metadata
- `polls` - Poll definitions and settings  
- `poll_options` - Individual poll choices
- `votes` - User voting records with timestamps

**Security:**
- Row Level Security (RLS) enabled on all tables
- Users can only modify their own polls and votes
- Public polls are readable by all authenticated users

### 🎨 Styling & Theming

- **Tailwind CSS** - Utility-first CSS framework
- **CSS Variables** - Custom properties for theming
- **Dark Mode** - System preference detection with manual toggle
- **Responsive Design** - Mobile-first approach with breakpoint system

### 🧪 Testing

```bash
# Run type checking
npm run type-check

# Run linting  
npm run lint

# Run formatting
npm run format

# Build for production
npm run build
```

## 📚 API Reference

### Authentication Endpoints
- `POST /auth/login` - User authentication
- `POST /auth/register` - Account creation  
- `POST /auth/logout` - Session termination

### Poll Management
- `GET /api/polls` - List all polls with pagination
- `POST /api/polls` - Create new poll (authenticated)
- `GET /api/polls/[id]` - Get poll details with results
- `PUT /api/polls/[id]` - Update poll (owner only)
- `DELETE /api/polls/[id]` - Delete poll (owner only)

### Voting System  
- `POST /api/polls/[id]/vote` - Cast vote on poll
- `GET /api/polls/[id]/results` - Get real-time results
- `GET /api/user/votes` - Get user voting history

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "feat: initial deployment setup"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Visit [vercel.com](https://vercel.com) and sign in with GitHub
   - Import your `alx-polly` repository
   - Add environment variables in the Vercel dashboard
   - Deploy automatically on every push to main

3. **Configure Environment Variables**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```

### Other Platforms

**Netlify:**
- Build Command: `npm run build`
- Publish Directory: `.next`

**Railway:**
- Automatically detects Next.js configuration
- Add environment variables in Railway dashboard

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the Repository**
2. **Create Feature Branch** (`git checkout -b feature/amazing-feature`)
3. **Commit Changes** (`git commit -m 'feat: add amazing feature'`)
4. **Push to Branch** (`git push origin feature/amazing-feature`)  
5. **Open Pull Request**

### Development Guidelines
- Follow TypeScript strict mode requirements
- Add comprehensive docstrings for new functions
- Include unit tests for business logic
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs via [GitHub Issues](https://github.com/IrAlfred/alx-polly/issues)  
- **Discussions**: Join conversations in [GitHub Discussions](https://github.com/IrAlfred/alx-polly/discussions)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend-as-a-Service
- [Shadcn/ui](https://ui.shadcn.com/) - Component library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Lucide Icons](https://lucide.dev/) - Icon library

---

**Built with ❤️ for the ALX Software Engineering Program**
