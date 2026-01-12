import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";
import wkx from "wkx";

export async function GET(
	req: Request,
	context: { params: Promise<{ id: string }> },
) {
	const { id } = await context.params; // aquí unwrap de la promesa

	const { data, error } = await supabaseAdmin
		.from("sessions_with_coords")
		.select("*")
		.eq("id", id)
		.maybeSingle();

	if (error)
		return NextResponse.json({ error: error.message }, { status: 500 });

	return NextResponse.json(data);
}
