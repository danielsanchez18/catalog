import { useState } from 'react';
import { AtSign, Eye, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: formData,
    });

    if (res.redirected) {
      window.location.href = res.url;
      return;
    }

    setLoading(false);

    const data = await res.json().catch(() => null);
    toast.error('No se pudo iniciar sesión', {
      description: data?.error ?? 'Revisa tus credenciales e intenta de nuevo.',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-y-5">
      <div className="space-y-2">
        <Label htmlFor="username">Correo electrónico</Label>
        <div className="relative">
          <Input
            id="username"
            type="email"
            name="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ingrese su correo electrónico"
            required
            autoComplete="username"
            className="pl-11"
          />
          <AtSign className="absolute left-4 top-5.25 -translate-y-1/2 w-4 h-4 text-neutral-500" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingrese su contraseña"
            required
            autoComplete="current-password"
            className="px-11"
          />
          <Lock className="absolute left-4 top-5.25 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <Button
            type="button"
            className="absolute right-2 top-5.25 -translate-y-1/2 active:not-aria-[haspopup]:-translate-y-4"
            variant="ghost"
            size="icon"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            <Eye />
          </Button>
        </div>
      </div>

      <Button type="submit" className="w-full py-2.25 h-fit" disabled={loading}>
        {loading ? 'Iniciando sesión…' : 'Iniciar sesión'}
      </Button>

      <Button
        type="button"
        variant="link"
        className="w-fit mx-auto p-0 h-fit"
        onClick={() =>
          toast.info('Recuperación de contraseña', {
            description: 'Disponible próximamente. Contacta al administrador.',
          })
        }
      >
        Olvidé mi contraseña
      </Button>
    </form>
  );
}
