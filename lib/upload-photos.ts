import { supabaseAdmin } from "@/lib/supabaseAdmin";


export async function uploadPhotos(
	formImages: File[],
): Promise<{ urls: string[] } | { error: string }> {
    try {


      
        const urls: string[] = [];

        for (const file of formImages) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const filePath = `images/${Date.now()}-${file.name}`;

            const { error } = await supabaseAdmin.storage
                .from("jamspots_imageBucket")
                .upload(filePath, buffer, { contentType: file.type });

            if (error) {
                console.error("Upload error:", error);
                continue;
            }

            const publicUrl = supabaseAdmin.storage
                .from("jamspots_imageBucket")
                .getPublicUrl(filePath).data.publicUrl;

            urls.push(publicUrl);
        }

        return { urls };
    } catch (e) {
        return { error: "Server error" };
    }
}
