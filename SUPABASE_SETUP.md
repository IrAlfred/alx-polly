# 🚀 Setting Up Real Supabase for Polly

Follow these steps to switch from mock authentication to real Supabase.

## Step 1: Database Setup

1. **Open your Supabase project dashboard**
2. **Go to the SQL Editor**
3. **Copy and paste the entire content of `database/supabase_setup.sql`**
4. **Run the SQL**

This will create:
- ✅ User profiles table
- ✅ Polls, poll options, and votes tables
- ✅ Row Level Security policies
- ✅ Automatic profile creation on signup
- ✅ Vote counting triggers
- ✅ Sample data (optional)

## Step 2: Environment Variables

Make sure your `.env.local` file has:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Step 3: Code Changes (Already Done)

✅ Updated `contexts/auth-context.tsx` to use real Supabase
✅ Created `lib/supabase-services.ts` for database operations  
✅ Updated `hooks/use-polls.tsx` to use real data
✅ Updated types to match database structure

## Step 4: Test the Setup

1. **Register a new account** - should create user in Supabase Auth + profile in profiles table
2. **Login with the account** - should work seamlessly 
3. **Create a poll** - should save to database
4. **Vote on polls** - should update vote counts
5. **Check dashboard** - should show your polls

## Step 5: Verify in Supabase Dashboard

After testing, check your Supabase dashboard:

1. **Authentication > Users** - should see your registered users
2. **Table Editor > profiles** - should see user profiles
3. **Table Editor > polls** - should see created polls
4. **Table Editor > poll_options** - should see poll options
5. **Table Editor > votes** - should see votes when you vote

## Features You Get with Real Supabase

🔄 **Real-time updates** - Vote counts update instantly
🔐 **Secure authentication** - Production-ready auth
📊 **Persistent data** - Data survives page refreshes
👥 **Multi-user support** - Multiple users can interact
🛡️ **Row Level Security** - Users can only edit their own polls
📈 **Analytics ready** - Real data for insights

## Troubleshooting

### If you get authentication errors:
- Check your environment variables
- Verify Supabase URL and key are correct
- Make sure RLS policies are set up correctly

### If polls don't load:
- Check browser console for errors
- Verify the database tables were created
- Check if RLS policies allow reading polls

### If voting doesn't work:
- Make sure you're logged in
- Check if the vote triggers are working
- Verify RLS policies allow inserting votes

## Next Steps

Now that you have real Supabase:
- 🎨 Customize the UI
- 📊 Add analytics
- 🔔 Add email notifications  
- 📱 Add mobile optimizations
- 🌐 Deploy to production

Your polling app is now production-ready! 🎉
