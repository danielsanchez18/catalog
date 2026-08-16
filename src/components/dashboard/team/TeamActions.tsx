import { useState } from 'react';
import { CalendarDays, Eye, Pencil, ShieldCheck, Trash2, X } from 'lucide-react';
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
import TeamFormDialog from '@/components/dashboard/team/TeamFormDialog';
import type { TeamMember } from '@/lib/types';

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

const getInitials = (member: TeamMember) => {
  const name = member.full_name ?? member.email;
  const parts = name.split(' ').filter(Boolean);
  return parts.length > 1 ? parts[0][0] + parts[1][0] : name.slice(0, 2);
};

interface Props {
  member: TeamMember;
}

function TeamViewDialog({ member }: Props) {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="ghost" size="icon" title="Ver" />}>
        <Eye className="size-4" />
      </DialogTrigger>
      <DialogPopup className="max-w-md gap-y-5 p-0 overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <DialogTitle className="text-base font-medium font-sans">Detalles de usuario</DialogTitle>
          <DialogClose
            render={
              <Button variant="ghost" size="icon" className="size-7 rounded-full" aria-label="Cerrar">
                <X className="size-4" />
              </Button>
            }
          />
        </div>

        <div className="max-h-[60dvh] overflow-y-auto px-5 pb-5">
          <div className="flex flex-col items-center gap-y-2 text-center">
            {member.avatar_url ? (
              <img
                src={member.avatar_url}
                alt={member.full_name ?? member.email}
                className="size-24 rounded-full border border-border object-cover"
              />
            ) : (
              <div className="flex size-24 items-center justify-center rounded-full bg-primary/10 text-2xl font-medium text-primary uppercase">
                {getInitials(member)}
              </div>
            )}
            <div className="space-y-1">
              <p className="text-lg font-medium leading-tight font-sans">
                {member.full_name ?? 'Sin nombre'}
              </p>
              <p className="text-sm text-muted-foreground break-all">{member.email}</p>
            </div>
            <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              Equipo
            </span>
          </div>

          <div className="mt-5 grid grid-cols-2 divide-x divide-border rounded-xl border border-border bg-muted/40">
            <div className="flex flex-col items-center gap-y-0.5 py-3.5">
              <CalendarDays className="size-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Se unió el</p>
              <p className="text-sm font-medium">{formatDate(member.created_at)}</p>
            </div>
            <div className="flex flex-col items-center gap-y-0.5 py-3.5">
              <ShieldCheck className="size-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Acceso</p>
              <p className="text-sm font-medium">Catálogo compartido</p>
            </div>
          </div>
        </div>
      </DialogPopup>
    </Dialog>
  );
}

function DeleteAlert({ member }: Props) {
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

    window.dispatchEvent(new Event('team:changed'));
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={<Button variant="ghost" size="icon" title="Eliminar" />}>
        <Trash2 className="size-4 text-destructive" />
      </AlertDialogTrigger>
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
  );
}

export default function TeamActions({ member }: Props) {
  return (
    <div className="flex items-center justify-end gap-x-1">
      <TeamViewDialog member={member} />
      <TeamFormDialog
        member={member}
        trigger={
          <Button variant="ghost" size="icon" title="Editar">
            <Pencil className="size-4" />
          </Button>
        }
      />
      <DeleteAlert member={member} />
    </div>
  );
}