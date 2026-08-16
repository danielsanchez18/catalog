import { defineMiddleware } from 'astro:middleware';
import { createServerClient } from '@supabase/ssr';
import { isTeamMember } from '@/lib/db/team';

const supabaseUrl = import.meta.env.SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY as string | undefined;

const PUBLIC_API_PATHS = ['/api/auth/login', '/api/auth/logout'];

function isPublicApi(pathname: string): boolean {
  return PUBLIC_API_PATHS.some((path) => pathname === path || pathname.startsWith(path + '/'));
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { cookies, url } = context;

  if (!supabaseUrl || !supabaseAnonKey) {
    return next();
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name) {
        return cookies.get(name)?.value;
      },
      set(name, value, options) {
        cookies.set(name, value, options);
      },
      remove(name, options) {
        cookies.delete(name, options);
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isDashboard = url.pathname.startsWith('/dashboard');
  const isLogin = url.pathname === '/login';
  const isApi = url.pathname.startsWith('/api/');

  if (isApi && !isPublicApi(url.pathname)) {
    if (!user) {
      return new Response(JSON.stringify({ error: 'No autorizado.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const member = await isTeamMember(cookies, user.id);
    if (!member) {
      return new Response(JSON.stringify({ error: 'No autorizado.' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return next();
  }

  if (isDashboard) {
    if (!user) {
      return Response.redirect(new URL('/login', url), 302);
    }

    const member = await isTeamMember(cookies, user.id);
    if (!member) {
      return Response.redirect(new URL('/login', url), 302);
    }
  }

  if (isLogin && user) {
    const member = await isTeamMember(cookies, user.id);
    if (member) {
      return Response.redirect(new URL('/dashboard', url), 302);
    }
  }

  return next();
});