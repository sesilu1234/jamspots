import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

export async function DELETE(
	req: Request,
	context: { params: Promise<{ id: string }> },
) {
	try {
		// 1. read cookie (email, as YOU described)

		const session = await getServerSession(authOptions);

		if (!session?.user?.email) {
			return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
		}

		const email = session.user.email;
		const { id } = await context.params;

		const { data, error: authError } = await supabaseAdmin
			.from("profiles")
			.select("id, sessions!inner(id)")
			.eq("email", email)
			.eq("sessions.id", id) // session id from params
			.single();

		if (authError || !data) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
		}

		const { data: images, error: fetchError } = await supabaseAdmin
			.from("sessions")
			.select("images")
			.eq("id", id);

		if (fetchError) throw fetchError;

		// 2️⃣ Add folder prefix
		const imageNames = images[0].images.map(
			(path: string) => "images/" + path.substring(path.lastIndexOf("/") + 1),
		);

		// 3️⃣ Delete files from storage

		const { error: deleteErrorImages } = await supabaseAdmin.storage
			.from("jamspots_imageBucket")
			.remove(imageNames); // delete only this file

		if (deleteErrorImages) {
			return NextResponse.json(
				{ error: deleteErrorImages.message },
				{ status: 500 },
			);
		}

		const { error: deleteError } = await supabaseAdmin
			.from("sessions")
			.delete()
			.eq("id", id);

		if (deleteError) {
			return NextResponse.json({ error: deleteError.message }, { status: 500 });
		}

		return NextResponse.json({ success: true });
	} catch (e) {
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}
