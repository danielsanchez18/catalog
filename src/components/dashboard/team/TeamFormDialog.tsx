import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import TeamForm from '@/components/dashboard/team/TeamForm';
import type { TeamMember } from '@/lib/types';

interface Props {
  member?: TeamMember;
  trigger: React.ReactElement;
}

export default function TeamFormDialog({ member, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) {
      setFormKey((k) => k + 1);
    }
  };

  const handleSuccess = () => {
    setOpen(false);
    window.dispatchEvent(new Event('team:changed'));
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger} />
      <DialogPopup className="max-w-xl gap-y-5 p-0 overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <DialogTitle className="text-base font-medium font-sans">
            {member ? 'Editar miembro' : 'Agregar miembro'}
          </DialogTitle>
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
            key={formKey}
            member={member}
            onSuccess={handleSuccess}
            onCancel={() => setOpen(false)}
            embedded
          />
        </div>
      </DialogPopup>
    </Dialog>
  );
}