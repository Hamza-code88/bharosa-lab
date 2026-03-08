'use server';

import { cookies } from 'next/headers';

export async function loginSuperAdmin(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  // .env file se asli id/pass uthayen
  const envUser = process.env.SUPER_ADMIN_USERNAME;
  const envPass = process.env.SUPER_ADMIN_PASSWORD;

  // Match karein
  if (username === envUser && password === envPass) {
    // 🛑 FIX: Next.js 15+ mein cookies() ko 'await' karna lazmi hai!
    const cookieStore = await cookies();
    
    cookieStore.set('super_admin_auth', 'true', { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });
    
    return { success: true };
  } else {
    // Agar ghalat hai toh error return karein
    return { success: false, error: 'Access Denied: Incorrect Username or Password.' };
  }
}