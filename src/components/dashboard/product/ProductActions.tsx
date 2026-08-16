import { createElement, useState } from 'react';
import { Eye, Pencil, Trash2, X, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import {
  Dialog,
  DialogClose,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogPopup,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import type { Product } from '@/lib/types';
import { formatPrice } from '@/lib/format';

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

const categoryLabel: Record<Product['categoria'], string> = {
  papeleria: 'Papelería',
  bisuteria: 'Bisutería',
  cuidado_personal: 'Cuidado Personal',
};

const estadoLabel = (estado: Product['estado']) =>
  estado === 'publicado' ? 'Publicado' : estado === 'eliminado' ? 'Eliminado' : 'Borrador';

interface Props {
  product: Product;
}

function ProductViewDialog({ product }: Props) {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="ghost" size="icon" title="Ver" />}>
        <Eye className="size-4" />
      </DialogTrigger>
      <DialogPopup className="max-w-xl gap-y-5 p-0 overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <DialogTitle className="text-base font-medium font-sans">Detalle del producto</DialogTitle>
          <DialogClose
            render={
              <Button variant="ghost" size="icon" className="size-7 rounded-full" aria-label="Cerrar">
                <X className="size-4" />
              </Button>
            }
          />
        </div>

        <div className="max-h-[60dvh] overflow-y-auto px-5 pb-5 space-y-5">
          <div className="flex items-start gap-x-4">
            <div className="relative w-20 h-20 shrink-0 overflow-hidden rounded-xl bg-accent">
              {product.imagen_url ? (
                <img
                  src={product.imagen_url}
                  alt={product.nombre}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : null}
            </div>
            <div className="min-w-0 space-y-1">
              <p className="text-lg font-medium leading-tight font-sans">{product.nombre}</p>
              <p className="text-sm text-muted-foreground">{categoryLabel[product.categoria]}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-5 gap-y-4">
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">Precio</p>
              <p className="text-lg font-mono font-medium">{formatPrice(product.precio)}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">Estado</p>
              <p className="text-sm font-medium">{estadoLabel(product.estado)}</p>
            </div>
            {product.etiqueta ? (
              <div className="space-y-0.5">
                <p className="text-xs text-muted-foreground">Etiqueta</p>
                <p className="text-sm font-medium">
                  {product.etiqueta === 'nuevo' ? 'Nuevo' : 'Promoción'}
                </p>
              </div>
            ) : null}
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Descripción corta</p>
              <p className="text-sm">{product.descripcion_corta}</p>
            </div>
            {product.descripcion_larga ? (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Descripción larga</p>
                <p className="text-sm leading-relaxed">{product.descripcion_larga}</p>
              </div>
            ) : null}
          </div>

          <div className="flex items-center gap-x-3 border-t border-border pt-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-x-1">
              <CalendarDays className="size-3.5" />
              Creado el {formatDate(product.created_at)}
            </span>
          </div>
        </div>
      </DialogPopup>
    </Dialog>
  );
}

function DeleteAlert({ product }: Props) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);

  if (deleted) return null;

  const handleDelete = async () => {
    setDeleting(true);
    const res = await fetch(`/api/productos/${product.id}`, { method: 'DELETE' });
    setDeleting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      toast.error('No se pudo eliminar el producto', {
        description: data?.error ?? 'Ocurrió un error. Intenta de nuevo.',
      });
      return;
    }

    setOpen(false);
    setDeleted(true);
    toast('Producto eliminado', {
      description: 'El producto ya no se muestra en el catálogo.',
      icon: <Trash2 className="size-4 min-w-4 text-destructive" />,
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={<Button variant="ghost" size="icon" title="Eliminar" />}>
        <Trash2 className="size-4 text-destructive" />
      </AlertDialogTrigger>
      <AlertDialogPopup className="px-5 py-4">
        <AlertDialogTitle className="font-sans font-medium">
          ¿Eliminar este producto?
        </AlertDialogTitle>
        <AlertDialogDescription className="text-sm">
          Se eliminará «{product.nombre}» y dejará de mostrarse en el catálogo. Esta acción es
          reversible: podrás restaurarlo desde el panel.
        </AlertDialogDescription>
        <div className="flex justify-end gap-x-2">
          <Button
            variant="outline"
            className="rounded-full px-3"
            onClick={() => setOpen(false)}
            disabled={deleting}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            className="rounded-full px-3"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? 'Eliminando…' : 'Eliminar'}
          </Button>
        </div>
      </AlertDialogPopup>
    </AlertDialog>
  );
}

export default function ProductActions({ product }: Props) {
  return (
    <div className="flex items-center justify-end gap-x-1">
      <ProductViewDialog product={product} />
      <Button
        variant="ghost"
        size="icon"
        title="Editar"
        nativeButton={false}
        render={createElement('a', { href: `/dashboard/productos/${product.id}/editar` })}
      >
        <Pencil className="size-4" />
      </Button>
      <DeleteAlert product={product} />
    </div>
  );
}