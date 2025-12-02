import { getToken } from 'next-auth/jwt';
import { NextResponse, NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const url = req.nextUrl.clone();

  // If NOT logged in → redirect to sign in page
  if (!token) {
    url.pathname = '/signIn_page';
    return NextResponse.redirect(url);
  }

  // Otherwise allow access
  return NextResponse.next();
}

export const config = {
  matcher: ['/jams_list_signIn'],
};
