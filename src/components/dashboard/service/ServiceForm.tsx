import { useRef, useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/sonner';
import type { Service } from '@/lib/types';
import { formatPrice } from '@/lib/format';

const ESTADO_ITEMS = [
  { label: 'Borrador', value: 'borrador' },
  { label: 'Publicado', value: 'publicado' },
];

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

interface FormState {
  nombre: string;
  descripcion_corta: string;
  descripcion_larga: string;
  precio_minimo: string;
  estado: 'borrador' | 'publicado';
  imagen_url: string;
}

const EMPTY_FORM: FormState = {
  nombre: '',
  descripcion_corta: '',
  descripcion_larga: '',
  precio_minimo: '',
  estado: 'borrador',
  imagen_url: '',
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const toFormState = (service: Service): FormState => ({
  nombre: service.nombre,
  descripcion_corta: service.descripcion_corta,
  descripcion_larga: service.descripcion_larga,
  precio_minimo: String(service.precio_minimo),
  estado: service.estado === 'publicado' ? 'publicado' : 'borrador',
  imagen_url: service.imagen_url ?? '',
});

interface Props {
  service?: Service;
}

export default function ServiceForm({ service }: Props) {
  const serviceId = service?.id;
  const [form, setForm] = useState<FormState>(service ? toFormState(service) : { ...EMPTY_FORM });
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(service?.imagen_url ?? null);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setImageError('La imagen supera el límite de 2 MB.');
      setImagePreview(null);
      setField('imagen_url', '');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      setImagePreview(dataUrl);
      setImageError(null);
      setField('imagen_url', dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageError(null);
    setField('imagen_url', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!form.nombre.trim()) next.nombre = 'El nombre es obligatorio.';
    if (!form.descripcion_corta.trim()) {
      next.descripcion_corta = 'La descripción corta es obligatoria.';
    }
    const price = Number(form.precio_minimo);
    if (form.precio_minimo.trim() === '') {
      next.precio_minimo = 'El precio mínimo es obligatorio.';
    } else if (!Number.isFinite(price) || price <= 0) {
      next.precio_minimo = 'El precio mínimo debe ser mayor a 0.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('No se pudo guardar el servicio', {
        description:
          'Revisa los campos marcados: nombre, descripción corta y precio mínimo son obligatorios, y el precio debe ser mayor a 0.',
      });
      return;
    }

    const payload = {
      nombre: form.nombre.trim(),
      descripcion_corta: form.descripcion_corta.trim(),
      descripcion_larga: form.descripcion_larga.trim(),
      precio_minimo: Number(form.precio_minimo),
      estado: form.estado,
      imagen_url: form.imagen_url.trim() || undefined,
    };

    setSaving(true);

    const url = serviceId ? `/api/servicios/${serviceId}` : '/api/servicios';
    const method = serviceId ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      toast.error('No se pudo guardar el servicio', {
        description: data?.error ?? 'Ocurrió un error al guardar. Intenta de nuevo.',
      });
      return;
    }

    const newService = (await res.json()) as Service;

    if (serviceId) {
      toast.success('Servicio actualizado', {
        description: `«${newService.nombre}» se guardó correctamente.`,
      });
    } else if (newService.estado === 'publicado') {
      toast.success('Servicio publicado', {
        description: `«${newService.nombre}» se agregó al catálogo con un precio desde ${formatPrice(newService.precio_minimo)}. Ya es visible para los clientes.`,
      });
    } else {
      toast.info('Servicio guardado como borrador', {
        description: `«${newService.nombre}» no se mostrará en el catálogo hasta que lo publiques desde el panel.`,
      });
    }

    window.setTimeout(() => {
      window.location.href = serviceId ? `/dashboard/servicios/${serviceId}` : '/dashboard/servicios';
    }, 900);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="sm:p-5 sm:rounded-xl sm:border border-border space-y-5">
      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre</Label>
        <Input
          id="nombre"
          value={form.nombre}
          onChange={(e) => setField('nombre', e.target.value)}
          placeholder="Ej. Eventos Corporativos"
          aria-invalid={!!errors.nombre}
        />
        {errors.nombre ? <p className="text-xs text-destructive">{errors.nombre}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="descripcion_corta">Descripción corta</Label>
        <Input
          id="descripcion_corta"
          value={form.descripcion_corta}
          onChange={(e) => setField('descripcion_corta', e.target.value)}
          placeholder="Frase breve que se muestra en las tarjetas del catálogo."
          aria-invalid={!!errors.descripcion_corta}
        />
        {errors.descripcion_corta ? (
          <p className="text-xs text-destructive">{errors.descripcion_corta}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="descripcion_larga">Descripción larga</Label>
        <Textarea
          id="descripcion_larga"
          rows={4}
          value={form.descripcion_larga}
          onChange={(e) => setField('descripcion_larga', e.target.value)}
          placeholder="Detalle completo del servicio que se muestra en el catálogo."
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="precio_minimo">Precio mínimo (S/)</Label>
          <Input
            id="precio_minimo"
            type="number"
            min="0"
            step="0.01"
            value={form.precio_minimo}
            onChange={(e) => setField('precio_minimo', e.target.value)}
            placeholder="0.00"
            aria-invalid={!!errors.precio_minimo}
          />
          {errors.precio_minimo ? (
            <p className="text-xs text-destructive">{errors.precio_minimo}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="estado">Estado</Label>
          <Select
            items={ESTADO_ITEMS}
            value={form.estado}
            onValueChange={(v) => setField('estado', v as 'borrador' | 'publicado')}
          >
            <SelectTrigger id="estado">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="borrador">Borrador</SelectItem>
              <SelectItem value="publicado">Publicado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="imagen">Imagen del servicio</Label>
        {imagePreview ? (
          <div className="relative w-fit">
            <img
              src={imagePreview}
              alt="Vista previa de la imagen del servicio"
              className="h-40 w-40 rounded-xl border border-border object-cover"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="absolute -right-2 -top-2 size-7 rounded-full"
              onClick={handleRemoveImage}
              aria-label="Quitar imagen"
            >
              <X />
            </Button>
          </div>
        ) : (
          <label
            htmlFor="imagen"
            className="flex cursor-pointer flex-col items-center justify-center gap-y-1 rounded-xl border border-dashed border-input px-4 py-8 text-center text-sm text-muted-foreground transition-colors hover:border-ring hover:bg-muted/40"
          >
            <ImagePlus className="mb-1 size-6" />
            <span className="font-medium text-foreground">Cargar foto</span>
            <span>Haz clic para seleccionar una imagen</span>
          </label>
        )}
        <input
          ref={fileInputRef}
          id="imagen"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleImageChange}
          className="sr-only"
        />
        {imageError ? (
          <p className="text-xs text-destructive">{imageError}</p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Las fotos no deben exceder más de 2 MB (PNG, JPG o WebP).
          </p>
        )}
      </div>

      <div className="flex items-center justify-end gap-x-2 pt-1">
        <Button
          type="button"
          variant="outline"
          className="rounded-full px-3 py-1.5 h-fit"
          nativeButton={false}
          render={<a href={serviceId ? `/dashboard/servicios/${serviceId}` : '/dashboard/servicios'} />}
        >
          Cancelar
        </Button>
        <Button type="submit" className="rounded-full px-3 py-1.5 h-fit" disabled={saving}>
          {saving ? 'Guardando…' : serviceId ? 'Guardar cambios' : 'Guardar servicio'}
        </Button>
      </div>
    </form>
  );
}
