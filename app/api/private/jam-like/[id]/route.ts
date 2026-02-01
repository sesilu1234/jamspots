import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]/route';

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id: jamId } = await context.params;
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { isUpvoted } = await req.json();

    if (isUpvoted) {
      // 1. Añadir Like (Upsert para evitar errores si ya existe)
      const { error } = await supabaseAdmin.from('likes').upsert(
        { jam_id: jamId, email: userEmail },
        { onConflict: 'jam_id, email' }, // Asegúrate de tener un índice único en estas dos columnas
      );

      if (error) throw error;
    } else {
      // 2. Quitar Like
      const { error } = await supabaseAdmin
        .from('likes')
        .delete()
        .eq('jam_id', jamId)
        .eq('email', userEmail);

      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('API Error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
