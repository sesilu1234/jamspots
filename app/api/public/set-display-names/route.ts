import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const generateFriendlyUsername = () => {
    const adjectives = ["Cosmic", "Shiny", "Swift", "Chill", "Bold", "Mighty", "Electric", "Silver", "Golden", "Hidden", "Silent", "Neon", "Dapper", "Wild", "Calm", "Brave", "Jolly", "Lunar", "Solar", "Frosty", "Spicy", "Crisp", "Loyal", "Clever", "Zesty", "Grand", "Keen", "Amber", "Zen", "Vivid"];
    const animals = ["Panda", "Fox", "Falcon", "Otter", "Tiger", "Badger", "Rhino", "Koala", "Shark", "Gecko", "Bison", "Eagle", "Wolf", "Lynx", "Owl", "Puffin", "Lemur", "Moose", "Seal", "Newt", "Heron", "Sloth", "Mamba", "Crane", "Raven", "Orca", "Puma", "Dolphin", "Beaver", "Stag"];
    
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const animal = animals[Math.floor(Math.random() * animals.length)];
    const numeric = Math.floor(100000 + Math.random() * 900000);
    
    return `${adj}${animal}${numeric}`;
};

export async function POST() {
    // 1. Get everyone
    const { data: users, error: fetchError } = await supabaseAdmin
        .from("profiles")
        .select("id");

    if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 });
    if (!users) return NextResponse.json({ message: "No users found" });

    // 2. Loop and update
    for (const user of users) {
        const newDisplayName = generateFriendlyUsername();
        await supabaseAdmin
            .from("profiles")
            .update({ display_name: newDisplayName })
            .eq("id", user.id);
            
        console.log(`Updated ${user.id} -> ${newDisplayName}`);
    }

    return NextResponse.json({ message: `Successfully updated ${users.length} users.` });
}