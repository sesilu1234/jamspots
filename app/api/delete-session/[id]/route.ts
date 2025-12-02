import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextResponse } from 'next/server';

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  console.log('Deleting session with id:', id);

  const { error } = await supabaseAdmin
    .from('sessions')
    .delete()
    .eq('id', id);

  if (error) {
    console.log('Delete error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
