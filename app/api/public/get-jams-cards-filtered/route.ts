import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

export async function GET(req: Request) {

	try {
	const { searchParams } = new URL(req.url);

	// Parámetros
	const userDate = searchParams.get("userDate")!;
	const dateOptions = searchParams.get("dateOptions")!;
	const order = searchParams.get("order")!; // 'closeness' o 'popular'
	const lat = parseFloat(searchParams.get("lat")!);
	const lng = parseFloat(searchParams.get("lng")!);
	const distance = parseFloat(searchParams.get("distance")!) * 1000 || 20000;
	const stylesParam = searchParams.get("styles");

	// Función auxiliar para formatear fecha
	const formatLocalDate = (d: Date) =>
		`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
			d.getDate(),
		).padStart(2, "0")}`;

	const weekdays = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];

	// Preparamos arrays de filtros
	let datesArray: string[] = [];
	let weekDay: string = "%%"; // default

	if (dateOptions === "today") {
		const today = new Date(userDate);
		datesArray = [formatLocalDate(today)];
		weekDay = weekdays[today.getDay()];
	} else if (dateOptions === "yesterday") {
		const d = new Date(userDate);
		d.setDate(d.getDate() - 1);
		datesArray = [formatLocalDate(d)];
		weekDay = weekdays[d.getDay()];
	} else if (dateOptions === "week") {
		const start = new Date(userDate);
		const end = new Date(userDate);
		end.setDate(end.getDate() + 7);

		for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
			datesArray.push(formatLocalDate(d));
		}
		weekDay = "%%";
	} else if (dateOptions.startsWith("custom:")) {
		const customStr = dateOptions.split("custom:")[1].trim();
		const customDate = new Date(customStr);
		datesArray = [customStr];
		weekDay = weekdays[customDate.getDay()];
	}

	let stylesArray: string[] | null = null;
	if (stylesParam) {
		try {
			const parsed = JSON.parse(stylesParam);
			if (Array.isArray(parsed) && parsed.length > 0) stylesArray = parsed;
			else {
				stylesArray = null;
			}
		} catch {}
	} else {
		stylesArray = null;
	}

	// Llamamos la RPC
	const { data, error } = await supabaseAdmin.rpc(
		"sessions_within_distance_1",
		{
			p_lat: lat,
			p_lng: lng,
			p_distance: distance,
			p_filter_dates: datesArray,
			p_filter_styles: stylesArray,
			p_weekday: weekDay,
		},
	);

	if (error)
		return NextResponse.json({ error: error.message }, { status: 500 });

	type Jam = {
		id: string;
		jam_title: string;
		distance: number;
		images?: string[];
		// otros campos que uses...
	};

	let dataRes: Jam[] =
		data?.map((jam: Jam) => ({
			...jam,
			image: jam.images?.[0] || null,
		})) || [];

	if (order === "closeness") {
		dataRes.sort((a: Jam, b: Jam) => a.distance - b.distance);
	} else if (order === "popular") {
		dataRes = dataRes.sort(() => Math.random() - 0.5);
	}

	return NextResponse.json(dataRes);
	 } catch (e) {
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}
