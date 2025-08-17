import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if user is authenticated by looking for session cookie
  const sessionCookie = request.cookies.get('session')
  
  // Protected routes that require authentication
  const protectedRoutes = ['/', '/interview']
  
  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )
  
  // If it's a protected route and user is not authenticated
  if (isProtectedRoute && !sessionCookie) {
    // Create the sign-in URL with callback
    const signInUrl = new URL('/sign_in', request.url)
    signInUrl.searchParams.set('callbackUrl', pathname)
    
    return NextResponse.redirect(signInUrl)
  }
  
  // If user is authenticated and trying to access auth pages, redirect to home
  if (sessionCookie && (pathname === '/sign_in' || pathname === '/sign_up')) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
