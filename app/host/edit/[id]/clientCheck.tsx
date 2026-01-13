import { convertFromRaw } from "draft-js";

const daysOfWeek = [
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
	"Sunday",
] as const;

const stylesList = [
	"Blues",
	"Rock",
	"All styles",
	"Country",
	"Jazz",
	"Pop",
	"Funk",
	"Soul",
	"Reggae",
	"Metal",
	"Hip-Hop",
	"R&B",
	"Disco",
	"House",
	"Trance",
	"Electronic",
	"Acoustic",
	"Singer-Songwriter",
	"Folk",
	"Indie",
	"Alternative",
	"Roots",
	"Afro",
	"Fusion",
	"Latin",
	"Improvisation",
	"Open Mic",
] as const;

export function validateJam(input: any) {
	const errors: any = {};

	// jam_title
	if (!input.jam_title || input.jam_title.trim().length === 0)
		errors.jam_title = "Jam name cannot be empty";
	else if (input.jam_title.length > 50) errors.jam_title = "Jam name too long";

	// location_title
	if (!input.location_title || input.location_title.trim().length === 0)
		errors.location_title = "Location name cannot be empty";
	else if (input.location_title.length > 50)
		errors.location_title = "Location name too long";

	// location_address
	if (!input.location_address || input.location_address.trim().length === 0)
		errors.location_address = "Address cannot be empty. Click on map";
	else if (input.location_address.length > 150)
		errors.location_address = "Address too long";

	// periodicity
	if (!["manual", "weekly"].includes(input.periodicity))
		errors.periodicity = "Choose periodicity";

	// dayOfWeek
	if (input.periodicity === "weekly" && !daysOfWeek.includes(input.dayOfWeek))
		errors.dayOfWeek = "You must pick a day for weekly jams";

	// dates
	if (input.periodicity === "manual" && (!input.dates || !input.dates.length))
		errors.dates = "Dates required for manual jams";

	// images
	if (!Array.isArray(input.images) || input.images.length != 3)
		errors.images = "Exactly 3 images required";
	

	// styles
	if (!Array.isArray(input.styles) || input.styles.length < 1)
		errors.styles = "Select at least one style";
	else if (input.styles.length > 3) errors.styles = "Max 3 styles allowed";

	// description (Draft.js raw → string)
	let descriptionText = "";
	if (input.description) {
		try {
			descriptionText = convertFromRaw(input.description).getPlainText().trim();
		} catch {}
	}

	if (descriptionText.length < 20)
		errors.description = "Description too short, add at least 20 characters";
	else if (descriptionText.length > 1400)
		errors.description = "Description too long";

	// social_links
	if (input.social_links) {
		const socialErrors: any = {};
		["facebook", "instagram", "web"].forEach((k) => {
			if (input.social_links[k] && input.social_links[k].length > 150)
				errors.social_links = "Max 150 characters for links url";
		});
	}

	// location_coords
	if (!input.location_coords) {
		errors.location_coords = "Coordinates required. Click on map";
	} else {
		const coordErrors: any = {};
		const { lat, lng } = input.location_coords;
		if (typeof lat !== "number" || typeof lng !== "number")
			errors.coo = "Coordinates must be a number";
		else if (lat < -90 || lat > 90 || lng < -180 || lng > 180)
			errors.coorange = "Latitude out of range";
	}

	return {
		success: Object.keys(errors).length === 0,
		errors: errors,
	};
}
