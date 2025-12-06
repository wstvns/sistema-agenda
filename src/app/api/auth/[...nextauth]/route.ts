import { handlers } from "@/lib/auth"
import { NextRequest } from "next/server"

// Debug: Log do callback
export async function GET(request: NextRequest) {
  const url = request.nextUrl
  if (url.pathname.includes("callback")) {
    console.log("🔍 Callback recebido:")
    console.log("  URL completa:", url.toString())
    console.log("  Query params:", Object.fromEntries(url.searchParams))
  }
  return handlers.GET(request)
}

export async function POST(request: NextRequest) {
  const url = request.nextUrl
  if (url.pathname.includes("callback")) {
    console.log("🔍 Callback POST recebido:")
    console.log("  URL completa:", url.toString())
  }
  return handlers.POST(request)
}
