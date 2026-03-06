import { NextResponse } from "next/server"

function generateToken() {
  const arr = new Uint8Array(32)
  crypto.getRandomValues(arr)
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("")
}

const publicRoutes = ["/login", "/api/v1/auth"]

export function middleware(req) {
  const { pathname } = req.nextUrl
  const res = NextResponse.next()

  // Permite acesso livre a rotas públicas
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return res
  }

  const sessionToken = req.cookies.get("luma.session_token")?.value

  if (!sessionToken) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // Gera CSRF token se não existir (usado pelo useSecureFetch)
  const csrfCookie = req.cookies.get("csrf_token")
  if (!csrfCookie) {
    const csrfToken = generateToken()
    res.cookies.set("csrf_token", csrfToken, {
      httpOnly: false,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    })
  }

  return res
}

export const config = {
  matcher: [
    "/api/v1/users/:path*",
  ],
}