import type { APIRoute } from 'astro';
import { createClient } from '@/lib/supabase/server';
import { createTeamMember } from '@/lib/db/team';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  const supabase = createClient(cookies);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ error: 'No autorizado.' }), { status: 401 });
  }

  const body = await request.json().catch(() => null);

  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  const full_name = typeof body?.full_name === 'string' ? body.full_name.trim() : '';
  const password = typeof body?.password === 'string' ? body.password : '';

  if (!email || !password) {
    return new Response(
      JSON.stringify({ error: 'El correo y la contraseña son obligatorios.' }),
      { status: 400 }
    );
  }

  try {
    const member = await createTeamMember({
      email,
      full_name: full_name || undefined,
      password,
    });

    return new Response(JSON.stringify(member), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500 });
  }
};