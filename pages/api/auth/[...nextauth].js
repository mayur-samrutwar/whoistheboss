import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Ethereum',
      credentials: {
        address: { label: "Address", type: "text" },
        signature: { label: "Signature", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.address || !credentials?.signature) {
          return null;
        }
        return { id: credentials.address };
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      session.address = token.sub;
      return session;
    }
  },
  session: {
    strategy: 'jwt'
  },
}

export default NextAuth(authOptions);
