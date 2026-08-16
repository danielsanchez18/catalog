import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogPopup,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import type { Product } from '@/lib/types';

interface Props {
  product: Product;
}

export default function DetailActions({ product }: Props) {
  const [deleted, setDeleted] = useState(product.estado === 'eliminado');
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
    <div className="fixed bottom-4 inset-x-0 z-40 flex justify-center px-4">
      <div className="flex items-center gap-x-1 rounded-full border border-border bg-popover py-1.5 px-2 shadow-lg">
        <Button
          variant="outline"
          className="rounded-full"
          nativeButton={false}
          render={<a href={`/dashboard/productos/${product.id}/editar`} />}
        >
          <Pencil className="size-3.5" />
          Editar
        </Button>
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger
            render={
              <Button variant="destructive" className="rounded-full">
                <Trash2 className="size-3.5" />
                Eliminar
              </Button>
            }
          />
          <AlertDialogPopup className="px-5 py-4">
            <AlertDialogTitle className="font-sans font-medium">¿Eliminar este producto?</AlertDialogTitle>
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
      </div>
    </div>
  );
}