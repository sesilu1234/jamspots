import NextAuth, { User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

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






       const bb = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("email", 'uPR@ucm.es')
    .single(); // returns one row or null

  if (bb.error) {
    console.error("Error fetching user:", bb.error);
   
  }

  console.log("User data:", bb.data);







  
      const { data } = await supabaseAdmin
        .from("profiles")  // include schema
        .select("uuid")
        .eq("email", user.email)
        .single();

      if (!data) {
        await supabaseAdmin.from("profiles").insert({
          email: user.email,
          name: user.name ?? null,
          last_login: new Date().toISOString(),
        });
      } else {
        await supabaseAdmin.from("profiles")
          .update({ last_login: new Date().toISOString() })
          .eq("uuid", data.uuid);
      }

            return true;
          },
        },
      };

      const handler = NextAuth(authOptions);
      export { handler as GET, handler as POST };
