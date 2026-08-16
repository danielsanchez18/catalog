import type { APIRoute } from 'astro';
import { createClient } from '@/lib/supabase/server';
import { deleteTeamMember, updateTeamMember } from '@/lib/db/team';

export const prerender = false;

export const PATCH: APIRoute = async ({ request, cookies, params }) => {
  const supabase = createClient(cookies);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ error: 'No autorizado.' }), { status: 401 });
  }

  const id = params.id;
  if (!id) {
    return new Response(JSON.stringify({ error: 'Falta el id del miembro.' }), { status: 400 });
  }

  const body = await request.json().catch(() => null);

  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  const full_name = typeof body?.full_name === 'string' ? body.full_name.trim() : '';
  const password = typeof body?.password === 'string' ? body.password : '';
  const avatar_url = typeof body?.avatar_url === 'string' ? body.avatar_url.trim() : '';

  if (!email) {
    return new Response(JSON.stringify({ error: 'El correo es obligatorio.' }), {
      status: 400,
    });
  }

  try {
    const member = await updateTeamMember(id, {
      email,
      full_name: full_name || undefined,
      password: password || undefined,
      avatar_url: avatar_url || undefined,
    });

    return new Response(JSON.stringify(member), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ cookies, params }) => {
  const supabase = createClient(cookies);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ error: 'No autorizado.' }), { status: 401 });
  }

  const id = params.id;
  if (!id) {
    return new Response(JSON.stringify({ error: 'Falta el id del miembro.' }), { status: 400 });
  }

  if (id === user.id) {
    return new Response(
      JSON.stringify({ error: 'No puedes eliminar tu propia cuenta.' }),
      { status: 400 }
    );
  }

  try {
    await deleteTeamMember(id);
    return new Response(null, { status: 204 });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500 });
  }
};