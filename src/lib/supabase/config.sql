-- ============================================
-- SUPABASE GOOGLE OAUTH CONFIGURATION
-- ============================================
-- This file documents the required configuration
-- for Google OAuth authentication.
-- 
-- Execute these steps in the Supabase Dashboard:
-- 1. Go to: Authentication > Providers > Google
-- 2. Enable the Google provider
-- 3. Enter your Google Cloud OAuth credentials
-- ============================================

-- Required Environment Variables (set in Supabase Dashboard > Settings > Environment Variables):
-- 
-- SUPABASE_GOOGLE_CLIENT_ID: Your Google Cloud OAuth Client ID
-- SUPABASE_GOOGLE_CLIENT_SECRET: Your Google Cloud OAuth Client Secret

-- ============================================
-- REDIRECT URLS TO CONFIGURE
-- ============================================
-- Add these authorized redirect URLs in Google Cloud Console:
--
-- For local development:
-- http://localhost:3000/auth/callback
--
-- For production:
-- https://your-domain.com/auth/callback
--
-- Add these in Supabase Dashboard:
-- Authentication > URL Configuration > Site URL
-- Authentication > URL Configuration > Redirect URLs

-- ============================================
-- ADMIN EMAIL RESTRICTION (Optional)
-- ============================================
-- To restrict CMS access to specific emails, create a function:

/*
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN AS $$
DECLARE
  user_email TEXT;
BEGIN
  -- Get current user's email from auth
  SELECT auth.jwt()->>'email' INTO user_email;
  
  -- Add your admin emails here
  RETURN user_email IN (
    'admin@elprofeta.com',
    'your-admin@email.com'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
*/

-- Then use this in RLS policies:
/*
CREATE POLICY "admin_only_orders"
ON orders FOR ALL
USING (is_admin_user())
WITH CHECK (is_admin_user());
*/

-- ============================================
-- AUTHENTICATION CALLBACK HANDLER
-- ============================================
-- Next.js route handler at /auth/callback
-- This handles the OAuth redirect:

/*
import { createServerClient, cookies } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/cms'

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          },
        },
      }
    )
    
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
*/