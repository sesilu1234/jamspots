"use server";

import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { revalidatePath } from 'next/cache';

/**
 * CREATE A COMMENT
 */
export async function createComment(jamId: string, content: string, slug: string) {


  const { error } = await supabaseAdmin
    .from('comments')
    .insert([{ jam_id: jamId, content: content }]);

  if (error) throw new Error(error.message);

  // Tell Next.js to refresh the data for this specific Jam page
  revalidatePath(`/jams/${slug}`);
}

/**
 * EDIT A COMMENT
 */
export async function editComment(commentId: string, newContent: string, slug: string) {


  const { error } = await supabaseAdmin
    .from('comments')
    .update({ content: newContent, updated_at: new Date().toISOString() })
    .eq('id', commentId);

  if (error) throw new Error(error.message);

  revalidatePath(`/jams/${slug}`);
}

/**
 * DELETE A COMMENT
 */
export async function deleteComment(commentId: string, slug: string) {


  const { error } = await supabaseAdmin
    .from('comments')
    .delete()
    .eq('id', commentId);

  if (error) throw new Error(error.message);

  revalidatePath(`/jams/${slug}`);
}

/**
 * REPORT A COMMENT
 */
export async function reportComment(commentId: string, reason: string) {


  // Assuming you have a 'reports' table to track flags
  const { error } = await supabaseAdmin
    .from('reports')
    .insert([{ comment_id: commentId, reason: reason }]);

  if (error) throw new Error(error.message);
  
  // No revalidatePath needed usually, unless the UI changes after reporting
}