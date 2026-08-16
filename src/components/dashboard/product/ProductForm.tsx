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
import type { Product, ProductCategory, ProductTag } from '@/lib/types';
import { formatPrice } from '@/lib/format';

const CATEGORIES = [
  { label: 'Papelería', value: 'papeleria' },
  { label: 'Bisutería', value: 'bisuteria' },
  { label: 'Cuidado Personal', value: 'cuidado_personal' },
] as const;

const TAGS = [
  { label: 'Nuevo', value: 'nuevo' },
  { label: 'Promoción', value: 'promocion' },
] as const;

const ETIQUETA_ITEMS = [
  { label: 'Sin etiqueta', value: 'sin_etiqueta' },
  ...TAGS,
];

const ESTADO_ITEMS = [
  { label: 'Borrador', value: 'borrador' },
  { label: 'Publicado', value: 'publicado' },
];

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

interface FormState {
  nombre: string;
  descripcion_corta: string;
  descripcion_larga: string;
  precio: string;
  categoria: ProductCategory;
  etiqueta: ProductTag | null;
  estado: 'borrador' | 'publicado';
  imagen_url: string;
}

const EMPTY_FORM: FormState = {
  nombre: '',
  descripcion_corta: '',
  descripcion_larga: '',
  precio: '',
  categoria: 'papeleria',
  etiqueta: null,
  estado: 'borrador',
  imagen_url: '',
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const toFormState = (product: Product): FormState => ({
  nombre: product.nombre,
  descripcion_corta: product.descripcion_corta,
  descripcion_larga: product.descripcion_larga,
  precio: String(product.precio),
  categoria: product.categoria,
  etiqueta: product.etiqueta ?? null,
  estado: product.estado === 'publicado' ? 'publicado' : 'borrador',
  imagen_url: product.imagen_url ?? '',
});

interface Props {
  product?: Product;
}

export default function ProductForm({ product }: Props) {
  const productId = product?.id;
  const [form, setForm] = useState<FormState>(product ? toFormState(product) : { ...EMPTY_FORM });
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(product?.imagen_url ?? null);
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
    const price = Number(form.precio);
    if (form.precio.trim() === '') {
      next.precio = 'El precio es obligatorio.';
    } else if (!Number.isFinite(price) || price <= 0) {
      next.precio = 'El precio debe ser mayor a 0.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('No se pudo guardar el producto', {
        description:
          'Revisa los campos marcados: nombre, descripción corta y precio son obligatorios, y el precio debe ser mayor a 0.',
      });
      return;
    }

    const payload = {
      nombre: form.nombre.trim(),
      descripcion_corta: form.descripcion_corta.trim(),
      descripcion_larga: form.descripcion_larga.trim(),
      precio: Number(form.precio),
      categoria: form.categoria,
      etiqueta: form.etiqueta ?? undefined,
      estado: form.estado,
      imagen_url: form.imagen_url.trim() || undefined,
    };

    setSaving(true);

    const url = productId ? `/api/productos/${productId}` : '/api/productos';
    const method = productId ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      toast.error('No se pudo guardar el producto', {
        description: data?.error ?? 'Ocurrió un error al guardar. Intenta de nuevo.',
      });
      return;
    }

    if (productId) {
      toast.success('Producto actualizado', {
        description: `«${payload.nombre}» se guardó correctamente.`,
      });
    } else if (payload.estado === 'publicado') {
      toast.success('Producto publicado', {
        description: `«${payload.nombre}» se agregó al catálogo con un precio de ${formatPrice(payload.precio)}. Ya es visible para los clientes.`,
      });
    } else {
      toast.info('Producto guardado como borrador', {
        description: `«${payload.nombre}» no se mostrará en el catálogo hasta que lo publiques desde el panel.`,
      });
    }

    window.setTimeout(() => {
      window.location.href = productId ? `/dashboard/productos/${productId}` : '/dashboard/productos';
    }, 900);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="sm:p-5 sm:rounded-xl sm:border border-border space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre</Label>
          <Input
            id="nombre"
            value={form.nombre}
            onChange={(e) => setField('nombre', e.target.value)}
            placeholder="Ej. Cuaderno Artesanal"
            aria-invalid={!!errors.nombre}
          />
          {errors.nombre ? <p className="text-xs text-destructive">{errors.nombre}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoria">Categoría</Label>
          <Select
            items={CATEGORIES}
            value={form.categoria}
            onValueChange={(v) => setField('categoria', v as ProductCategory)}
          >
            <SelectTrigger id="categoria">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
          placeholder="Detalle completo que se muestra en la página del producto."
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="precio">Precio (S/)</Label>
          <Input
            id="precio"
            type="number"
            min="0"
            step="0.01"
            value={form.precio}
            onChange={(e) => setField('precio', e.target.value)}
            placeholder="0.00"
            aria-invalid={!!errors.precio}
          />
          {errors.precio ? <p className="text-xs text-destructive">{errors.precio}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="etiqueta">Etiqueta</Label>
          <Select
            items={ETIQUETA_ITEMS}
            value={form.etiqueta ?? 'sin_etiqueta'}
            onValueChange={(v) =>
              setField('etiqueta', v === 'sin_etiqueta' ? null : (v as ProductTag))
            }
          >
            <SelectTrigger id="etiqueta">
              <SelectValue placeholder="Sin etiqueta" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sin_etiqueta">Sin etiqueta</SelectItem>
              {TAGS.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
        <Label htmlFor="imagen">Imagen del producto</Label>
        {imagePreview ? (
          <div className="relative w-fit">
            <img
              src={imagePreview}
              alt="Vista previa de la imagen del producto"
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
          render={<a href={productId ? `/dashboard/productos/${productId}` : '/dashboard/productos'} />}
        >
          Cancelar
        </Button>
        <Button type="submit" className="rounded-full px-3 py-1.5 h-fit" disabled={saving}>
          {saving ? 'Guardando…' : productId ? 'Guardar cambios' : 'Guardar producto'}
        </Button>
      </div>
    </form>
  );
}