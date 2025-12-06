import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Rotas que precisam de autenticacao
  const protectedRoutes = [
    "/dashboard",
    "/client",
    "/api/services",
    "/api/schedule",
    "/api/appointments",
    "/api/payments",
    "/api/ai",
  ]

  const isProtected = protectedRoutes.some(route => pathname.startsWith(route))

  if (!isProtected) {
    return NextResponse.next()
  }

  // Verifica se tem cookie de sessão, não acessa o edge runtime
  // seguindo o stackoverflow o next 5 usa nomes diferentes de cookies, entao tem que checar todos
  const hasSession = 
    request.cookies.has("authjs.session-token") ||
    request.cookies.has("__Secure-authjs.session-token") ||
    request.cookies.has("next-auth.session-token") ||
    request.cookies.has("__Secure-next-auth.session-token") ||
    request.cookies.has("__Host-authjs.session-token")

  if (!hasSession) {
    const signInUrl = new URL("/auth/signin", request.url)
    signInUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/client/:path*",
    "/api/services/:path*",
    "/api/schedule/:path*",
    "/api/appointments/:path*",
    "/api/payments/:path*",
    "/api/ai/:path*",
  ],
}

