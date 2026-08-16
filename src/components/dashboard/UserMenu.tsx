import { useState } from 'react';
import { LogOut, UserRound, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogClose,
  DialogPopup,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogPopup,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import TeamForm from '@/components/dashboard/team/TeamForm';
import type { TeamMember } from '@/lib/types';

const getInitials = (member: TeamMember) => {
  const name = member.full_name ?? member.email;
  const parts = name.split(' ').filter(Boolean);
  return parts.length > 1 ? parts[0][0] + parts[1][0] : name.slice(0, 2);
};

interface Props {
  member: TeamMember;
}

export default function UserMenu({ member }: Props) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    const res = await fetch('/api/auth/logout', { method: 'POST' });
    if (res.ok || res.redirected) {
      window.location.href = '/login';
      return;
    }
    setLoggingOut(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon-lg" className="rounded-full overflow-hidden">
              {member.avatar_url ? (
                <img
                  src={member.avatar_url}
                  alt={member.full_name ?? member.email}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center bg-primary/10 text-sm font-medium text-primary uppercase">
                  {getInitials(member)}
                </span>
              )}
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">{member.full_name ?? 'Sin nombre'}</span>
              <span className="font-normal text-muted-foreground">{member.email}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
          </DropdownMenuGroup>
          <DropdownMenuItem onClick={() => setProfileOpen(true)}>
            <UserRound className="size-4" />
            Mi perfil
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setLogoutOpen(true)}
            className="text-destructive focus:text-destructive"
          >
            <LogOut className="size-4" />
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Mi perfil */}
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogPopup className="max-w-xl gap-y-5 p-0 overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
            <DialogTitle className="text-base font-medium font-sans">Mi perfil</DialogTitle>
            <DialogClose
              render={
                <Button variant="ghost" size="icon" className="size-7 rounded-full" aria-label="Cerrar">
                  <X className="size-4" />
                </Button>
              }
            />
          </div>
          <div className="px-5 pb-5">
            <TeamForm
              key={String(profileOpen)}
              member={member}
              onSuccess={() => setProfileOpen(false)}
              onCancel={() => setProfileOpen(false)}
              embedded
            />
          </div>
        </DialogPopup>
      </Dialog>

      {/* Cerrar sesión */}
      <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <AlertDialogPopup className="px-5 py-4">
          <AlertDialogTitle className="font-sans font-medium">¿Cerrar sesión?</AlertDialogTitle>
          <AlertDialogDescription className="text-sm">
            ¿Seguro que quieres cerrar sesión? Deberás iniciar sesión de nuevo para volver al
            panel.
          </AlertDialogDescription>
          <div className="flex justify-end gap-x-2">
            <Button
              variant="outline"
              className="rounded-full px-3"
              onClick={() => setLogoutOpen(false)}
              disabled={loggingOut}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              className="rounded-full px-3"
              onClick={handleLogout}
              disabled={loggingOut}
            >
              {loggingOut ? 'Cerrando sesión…' : 'Cerrar sesión'}
            </Button>
          </div>
        </AlertDialogPopup>
      </AlertDialog>
    </>
  );
}