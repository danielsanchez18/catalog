import { useRef, useState } from 'react';
import { Camera, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import type { TeamMember } from '@/lib/types';

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

interface FormState {
  full_name: string;
  email: string;
  password: string;
  avatar_url: string;
}

const EMPTY_FORM: FormState = {
  full_name: '',
  email: '',
  password: '',
  avatar_url: '',
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const toFormState = (member: TeamMember): FormState => ({
  full_name: member.full_name ?? '',
  email: member.email,
  password: '',
  avatar_url: member.avatar_url ?? '',
});

const getInitials = (name: string) => {
  const parts = name.split(' ').filter(Boolean);
  return parts.length > 1 ? parts[0][0] + parts[1][0] : name.slice(0, 2);
};

interface Props {
  member?: TeamMember;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

export default function TeamForm({ member, onSuccess, onCancel, embedded }: Props) {
  const memberId = member?.id;
  const [form, setForm] = useState<FormState>(member ? toFormState(member) : { ...EMPTY_FORM });
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    member?.avatar_url ?? null
  );
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setAvatarError('La foto supera el límite de 2 MB.');
      setAvatarPreview(null);
      setField('avatar_url', '');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      setAvatarPreview(dataUrl);
      setAvatarError(null);
      setField('avatar_url', dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    setAvatarError(null);
    setField('avatar_url', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!form.full_name.trim()) next.full_name = 'El nombre es obligatorio.';
    if (!form.email.trim()) {
      next.email = 'El correo es obligatorio.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = 'Ingresa un correo válido.';
    }
    if (!memberId && form.password.trim() === '') {
      next.password = 'La contraseña es obligatoria.';
    } else if (form.password && form.password.length < 6) {
      next.password = 'La contraseña debe tener al menos 6 caracteres.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('No se pudo guardar el miembro', {
        description: 'Revisa los campos marcados.',
      });
      return;
    }

    const payload = {
      full_name: form.full_name.trim(),
      email: form.email.trim(),
      password: form.password.trim(),
      avatar_url: form.avatar_url.trim() || undefined,
    };

    setSaving(true);

    const url = memberId ? `/api/team/${memberId}` : '/api/team';
    const method = memberId ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      toast.error('No se pudo guardar el miembro', {
        description: data?.error ?? 'Ocurrió un error al guardar. Intenta de nuevo.',
      });
      return;
    }

    const saved = (await res.json()) as TeamMember;

    if (memberId) {
      toast.success('Miembro actualizado', {
        description: `«${saved.full_name ?? saved.email}» se guardó correctamente.`,
      });
    } else {
      toast.success('Miembro agregado', {
        description: `«${saved.full_name ?? saved.email}» ya puede iniciar sesión y gestionar el catálogo.`,
      });
    }

    onSuccess?.();
  };

  const handleCancel = () => {
    onCancel?.();
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={embedded ? 'space-y-5' : 'sm:p-5 sm:rounded-xl sm:border border-border space-y-5'}
    >
      <div className="flex items-center gap-x-4">
        <div className="relative shrink-0">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="Vista previa de la foto del miembro"
              className="size-20 rounded-full border border-border object-cover"
            />
          ) : (
            <div className="flex size-20 items-center justify-center rounded-full bg-primary/10 text-lg font-medium text-primary uppercase">
              {getInitials(form.full_name || member?.email || '?')}
            </div>
          )}
          {avatarPreview ? (
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="absolute -right-1 -top-1 size-6 rounded-full"
              onClick={handleRemoveAvatar}
              aria-label="Quitar foto"
            >
              <X className="size-3" />
            </Button>
          ) : null}
        </div>

        <div className="space-y-1">
          <Label htmlFor="avatar">Foto de perfil</Label>
          <p className="text-xs text-muted-foreground">
            {memberId ? 'Puedes cambiar la foto del miembro.' : 'Se mostrará junto al nombre.'}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full"
            nativeButton={false}
            render={<label htmlFor="avatar" className="inline-flex cursor-pointer items-center gap-x-1.5" />}
          >
            <Camera className="size-3.5" />
            {avatarPreview ? 'Cambiar foto' : 'Subir foto'}
          </Button>
          <input
            ref={fileInputRef}
            id="avatar"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleAvatarChange}
            className="sr-only"
          />
          {avatarError ? (
            <p className="text-xs text-destructive">{avatarError}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="full_name">Nombre</Label>
        <Input
          id="full_name"
          value={form.full_name}
          onChange={(e) => setField('full_name', e.target.value)}
          placeholder="Ej. María López"
          aria-invalid={!!errors.full_name}
        />
        {errors.full_name ? <p className="text-xs text-destructive">{errors.full_name}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Correo</Label>
        <Input
          id="email"
          type="email"
          value={form.email}
          onChange={(e) => setField('email', e.target.value)}
          placeholder="ejemplo@correo.com"
          aria-invalid={!!errors.email}
        />
        {errors.email ? <p className="text-xs text-destructive">{errors.email}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">{memberId ? 'Nueva contraseña' : 'Contraseña'}</Label>
        <Input
          id="password"
          type="password"
          value={form.password}
          onChange={(e) => setField('password', e.target.value)}
          placeholder={memberId ? 'Déjala en blanco para no cambiarla' : 'Mínimo 6 caracteres'}
          aria-invalid={!!errors.password}
        />
        {errors.password ? <p className="text-xs text-destructive">{errors.password}</p> : null}
        {memberId ? (
          <p className="text-xs text-muted-foreground">
            Si la dejas en blanco, la contraseña actual se mantiene.
          </p>
        ) : null}
      </div>

      <div className="flex items-center justify-end gap-x-2 pt-1">
        <Button
          type="button"
          variant="outline"
          className="rounded-full px-3 py-1.5 h-fit"
          onClick={handleCancel}
        >
          Cancelar
        </Button>
        <Button type="submit" className="rounded-full px-3 py-1.5 h-fit" disabled={saving}>
          {saving ? 'Guardando…' : memberId ? 'Guardar cambios' : 'Agregar miembro'}
        </Button>
      </div>
    </form>
  );
}