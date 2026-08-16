import { createAdminClient } from '@/lib/supabase/admin';
import { createClient as createServerClient } from '@/lib/supabase/server';
import type { TeamMember } from '@/lib/types';
import type { AstroCookies } from 'astro';

export interface TeamMemberInput {
  email: string;
  full_name?: string;
  password?: string;
}

const SELECT = 'user_id, email, full_name, created_at';

export async function isTeamMember(
  cookies: Pick<AstroCookies, 'get' | 'set' | 'delete'>,
  userId?: string
): Promise<boolean> {
  let id = userId;

  if (!id) {
    const supabase = createServerClient(cookies);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    id = user?.id;
  }

  if (!id) {
    return false;
  }

  const supabase = createServerClient(cookies);
  const { data, error } = await supabase
    .from('team')
    .select('user_id')
    .eq('user_id', id)
    .maybeSingle();

  if (error) {
    return false;
  }

  return data !== null;
}

function mapRow(row: Record<string, unknown>): TeamMember {
  return {
    id: row.user_id as string,
    email: row.email as string,
    full_name: (row.full_name as string | null) ?? undefined,
    created_at: row.created_at as string,
  };
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('team')
    .select(SELECT)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(mapRow);
}

export async function createTeamMember(input: TeamMemberInput): Promise<TeamMember> {
  const supabase = createAdminClient();

  const { data, error: createError } = await supabase.auth.admin.createUser({
    email: input.email,
    password: input.password ?? undefined,
    email_confirm: true,
    user_metadata: input.full_name ? { full_name: input.full_name } : undefined,
  });

  if (createError) {
    throw new Error(createError.message);
  }

  const userId = data.user?.id;
  if (!userId) {
    throw new Error('No se pudo crear el usuario.');
  }

  const { data: memberRow, error } = await supabase
    .from('team')
    .insert({
      user_id: userId,
      email: input.email,
      full_name: input.full_name ?? null,
    })
    .select(SELECT)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapRow(memberRow);
}

export async function updateTeamMember(
  id: string,
  input: TeamMemberInput
): Promise<TeamMember> {
  const supabase = createAdminClient();

  const { error: updateError } = await supabase.auth.admin.updateUserById(id, {
    email: input.email,
    password: input.password ?? undefined,
    user_metadata: input.full_name ? { full_name: input.full_name } : undefined,
  });

  if (updateError) {
    throw new Error(updateError.message);
  }

  const { data, error } = await supabase
    .from('team')
    .update({
      email: input.email,
      full_name: input.full_name ?? null,
    })
    .eq('user_id', id)
    .select(SELECT)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapRow(data);
}

export async function deleteTeamMember(id: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.auth.admin.deleteUser(id);

  if (error) {
    throw new Error(error.message);
  }
}