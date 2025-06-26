// import NextAuth from 'next-auth'
// import { authOptions } from '../../../../lib/auth/config'

// const handler = NextAuth(authOptions)

// export { handler as GET, handler as POST }

// Placeholder for NextAuth route - commented out due to missing next-auth dependency
export async function GET() {
  return new Response('NextAuth route not configured', { status: 503 })
}

export async function POST() {
  return new Response('NextAuth route not configured', { status: 503 })
} 