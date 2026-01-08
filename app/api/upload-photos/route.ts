import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {


    try {

    const session = await getServerSession(authOptions); // App Router uses new form

      if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    

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

 catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }


}



