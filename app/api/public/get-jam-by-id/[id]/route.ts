import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";
import { DateTime } from 'luxon';

export async function GET(
	req: Request,
	context: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await context.params;

		// run both queries in parallel
		const [
			{ data: jamData, error: jamError },
			{ data: nextDateData, error: nextDateError }
		] = await Promise.all([
			supabaseAdmin
				.from("sessions")
				.select("id, jam_title, location_title, location_address, images, styles, slug")
				.eq("id", id)
				.maybeSingle(),

			supabaseAdmin
				.from("jam_dates")
				.select("jam_id, utc_datetime, jam_timezone")
				.eq("jam_id", id)
				.gt("utc_datetime", new Date().toISOString())
				.order("utc_datetime", { ascending: true })
				.limit(1)
				.maybeSingle()
		]);

		if (jamError || nextDateError) {

			console.log(jamError?.message || nextDateError?.message || "Unknown error" );
			return NextResponse.json(
				{ error: jamError?.message || nextDateError?.message || "Unknown error" },
				{ status: 500 }
			);
		}

		const localTime = (nextDateData?.utc_datetime && nextDateData?.jam_timezone)
			? DateTime.fromISO(nextDateData.utc_datetime).setZone(nextDateData.jam_timezone)
			: null;

		const result = jamData
			? {
					...jamData,
					images: jamData.images?.[0] ?? null,
					display_date: localTime && localTime.isValid
						? localTime.toFormat('ccc d LLL, HH:mm')
						: 'Date TBD'
			  }
			: null;

			console.log(result);

		return NextResponse.json(result);

	} catch (e) {

		console.log(e);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}