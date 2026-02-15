import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      display_name?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    display_name?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    display_name?: string | null;
  }
}