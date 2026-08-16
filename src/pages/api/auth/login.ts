import type { APIRoute } from 'astro';
import { createClient } from '@/lib/supabase/server';
import { isTeamMember } from '@/lib/db/team';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const email = String(formData.get('username') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (!email || !password) {
    return new Response(JSON.stringify({ error: 'Faltan el correo y la contraseña.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const supabase = createClient(cookies);

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    return new Response(JSON.stringify({ error: 'Credenciales incorrectas.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const member = await isTeamMember(cookies, data.user.id);
  if (!member) {
    await supabase.auth.signOut();
    return new Response(
      JSON.stringify({ error: 'Tu cuenta no tiene acceso a la administración.' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return redirect('/dashboard');
};
