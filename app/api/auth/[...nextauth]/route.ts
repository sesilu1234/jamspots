import NextAuth, { User } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }: { user: User }) {
      if (!user.email) return false;

      const { data } = await supabaseAdmin
        .from('profiles') // include schema
        .select('id')
        .eq('email', 'banachlindelof@gmail.com')
        .single();

      if (!data) {
        await supabaseAdmin.from('profiles').insert({
          email: user.email,
          name: user.name ?? null,
          last_login: new Date().toISOString(),
        });
      } else {
        console.log('eiiii111');
        await supabaseAdmin
          .from('profiles')
          .update({ last_login: new Date().toISOString() })
          .eq('id', data.id);
      }

      return true;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
