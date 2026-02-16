import NextAuth, { NextAuthOptions, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const MAX_TRIALS = 5;

const generateFriendlyUsername = () => {
    const adjectives = [
        "Cosmic", "Shiny", "Swift", "Chill", "Bold", "Mighty", "Electric", "Silver", 
        "Golden", "Hidden", "Silent", "Neon", "Dapper", "Wild", "Calm", "Brave", 
        "Jolly", "Lunar", "Solar", "Frosty", "Spicy", "Crisp", "Loyal", "Clever", 
        "Zesty", "Grand", "Keen", "Amber", "Zen", "Vivid"
    ];
    const animals = [
        "Panda", "Fox", "Falcon", "Otter", "Tiger", "Badger", "Rhino", "Koala", 
        "Shark", "Gecko", "Bison", "Eagle", "Wolf", "Lynx", "Owl", "Puffin", 
        "Lemur", "Moose", "Seal", "Newt", "Heron", "Sloth", "Mamba", "Crane", 
        "Raven", "Orca", "Puma", "Dolphin", "Beaver", "Stag"
    ];
    
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const animal = animals[Math.floor(Math.random() * animals.length)];
    const numeric = Math.floor(100000 + Math.random() * 900000);
    
    return `${adj}${animal}${numeric}`;
};

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({ user }) {
            if (!user.email) return false;

            // 1. Check if user already exists
            const { data: existingUser } = await supabaseAdmin
                .from("profiles")
                .select("id")
                .eq("email", user.email)
                .single();

            if (!existingUser) {
                let inserted = false;
                let trials = 0;
                

                // 2. Retry loop for Unique Constraint collisions
                while (!inserted && trials < MAX_TRIALS) {
                    const newDisplayName = generateFriendlyUsername();
                    const { error } = await supabaseAdmin.from("profiles").insert({
                        email: user.email,
                        name: user.name ?? null,
                        display_name: newDisplayName,
                        last_login: new Date().toISOString(),
                    });

                    if (!error) {
                        inserted = true;
                    } else {
                        console.error("Database Insert Error:", error);
                        trials++;
                    }
                }
                if (!inserted) return false; 
            } else {
                // 3. Update existing user
                await supabaseAdmin
                    .from("profiles")
                    .update({ last_login: new Date().toISOString() })
                    .eq("id", existingUser.id);
            }

            return true;
        },

        async jwt({ token, user }) {
            // Only fetch from DB on sign in or if token is missing display_name
            if (!token.display_name && token.email) {
                const { data } = await supabaseAdmin
                    .from("profiles")
                    .select("display_name")
                    .eq("email", token.email)
                    .single();
                
                if (data) {
                    token.display_name = data.display_name;
                }
            }
            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.display_name = token.display_name;
            }
            return session;
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };