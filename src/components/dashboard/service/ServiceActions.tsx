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
import type { Service } from '@/lib/types';

interface Props {
  service: Service;
}

export default function ServiceActions({ service }: Props) {
  const [deleted, setDeleted] = useState(service.estado === 'eliminado');
  const [open, setOpen] = useState(false);

  if (deleted) return null;

  const handleDelete = () => {
    setOpen(false);
    setDeleted(true);
    toast('Servicio eliminado', {
      description: 'El servicio ya no se muestra en el catálogo.',
    });
  };

  return (
    <div className="fixed bottom-4 inset-x-0 z-40 flex justify-center px-4">
      <div className="flex items-center gap-x-1 rounded-full border border-border bg-popover py-1.5 px-2 shadow-lg">
        <Button
          variant="outline"
          className="rounded-full"
          nativeButton={false}
          render={<a href={`/dashboard/servicios/${service.id}/editar`} />}
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
          <AlertDialogPopup>
            <AlertDialogTitle>¿Eliminar este servicio?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará «{service.nombre}» y dejará de mostrarse en el catálogo. Esta acción es
              reversible: podrás restaurarlo desde el panel.
            </AlertDialogDescription>
            <div className="flex justify-end gap-x-2">
              <Button
                variant="outline"
                className="rounded-full px-3"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button variant="destructive" className="rounded-full px-3" onClick={handleDelete}>
                Eliminar
              </Button>
            </div>
          </AlertDialogPopup>
        </AlertDialog>
      </div>
    </div>
  );
}
