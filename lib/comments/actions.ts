"use server";

import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../app/api/auth/[...nextauth]/route';

export async function createComment(
  jamId: string, 
  content: string, 
  parentId: string | null = null // Default values must be at the end
) {



  
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return { error: 'Unauthorized', status: 401 };
  }


  

  const userEmail = session.user.email;


  console.log(userEmail,jamId, parentId, content);

  const { error } = await supabaseAdmin.rpc('insert_comment', {
    p_jam_id: jamId,
    p_content: content,
    p_parent_id: parentId,
    p_email: userEmail,
  });


  console.log(error);

  if (error) return { error: error.message, status: 500 };

  return { success: true };
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