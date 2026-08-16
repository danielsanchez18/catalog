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
import type { TeamMember } from '@/lib/types';

interface Props {
  member: TeamMember;
}

export default function TeamActions({ member }: Props) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    const res = await fetch(`/api/team/${member.id}`, { method: 'DELETE' });
    setDeleting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      toast.error('No se pudo eliminar el miembro', {
        description: data?.error ?? 'Ocurrió un error. Intenta de nuevo.',
      });
      return;
    }

    setOpen(false);
    toast('Miembro eliminado', {
      description: 'La cuenta ya no puede iniciar sesión.',
      icon: <Trash2 className="size-4 min-w-4 text-destructive" />,
    });

    window.setTimeout(() => {
      window.location.href = '/dashboard/team';
    }, 900);
  };

  return (
    <div className="fixed bottom-4 inset-x-0 z-40 flex justify-center px-4">
      <div className="flex items-center gap-x-1 rounded-full border border-border bg-popover py-1.5 px-2 shadow-lg">
        <Button
          variant="outline"
          className="rounded-full"
          nativeButton={false}
          render={<a href={`/dashboard/team/${member.id}/editar`} />}
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
            <AlertDialogTitle className="font-sans font-medium">¿Eliminar este miembro?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              Se eliminará la cuenta de «{member.full_name ?? member.email}» y dejará de poder
              iniciar sesión. Esta acción es irreversible.
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