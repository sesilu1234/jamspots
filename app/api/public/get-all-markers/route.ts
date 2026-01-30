import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

export async function GET() {

	try {
	const { data, error } = await supabaseAdmin
	.from("sessions_with_coords")
	.select("id, lat, lng")
	.eq("validated", true);

	if (error)
		return NextResponse.json({ error: error.message }, { status: 500 });

	return NextResponse.json(data);

	} catch (e) {
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}
