import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"

// Debug. Verificar configuracao pro ambiente de dev
if (process.env.NODE_ENV === "development") {
  console.log("🔍 Verificando configuração OAuth:")
  console.log("  NEXTAUTH_URL:", process.env.NEXTAUTH_URL || "❌ NÃO CONFIGURADO")
  console.log("  GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID 
    ? `${process.env.GOOGLE_CLIENT_ID.substring(0, 30)}...` 
    : "❌ NÃO CONFIGURADO")
  console.log("  GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET 
    ? "✅ Configurado" 
    : "❌ NÃO CONFIGURADO")
  
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.error("⚠️  ERRO: GOOGLE_CLIENT_ID ou GOOGLE_CLIENT_SECRET não configurados!")
  }
  
  if (process.env.GOOGLE_CLIENT_ID && !process.env.GOOGLE_CLIENT_ID.includes(".apps.googleusercontent.com")) {
    console.error("⚠️  AVISO: GOOGLE_CLIENT_ID não parece estar no formato correto!")
    console.error("   Deve terminar com: .apps.googleusercontent.com")
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as any,
  trustHost: true, // auth v5
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        session.user.role = (user as any).role || "client"
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "database",
  },
})

// auth internamente
// Next auth v5 entra automaticamente com o handler
export async function getServerSession() {
  return await auth()
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string
    }
  }
}