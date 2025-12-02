import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: Request) {
  const formData = await req.formData(); // Web API method

  const files = formData.getAll('images') as File[]; // array of File objects
  const urls: string[] = [];

  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = `images/${Date.now()}-${file.name}`;

    const { error } = await supabaseAdmin.storage
      .from('jamspots_imageBucket')
      .upload(filePath, buffer, { contentType: file.type });

    if (error) {
      console.error('Upload error:', error);
      continue;
    }

    const publicUrl = supabaseAdmin.storage
      .from('jamspots_imageBucket')
      .getPublicUrl(filePath).data.publicUrl;

    urls.push(publicUrl);
  }

  return new Response(JSON.stringify({ urls }), { status: 200 });
}
