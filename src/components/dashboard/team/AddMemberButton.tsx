import { Button } from '@/components/ui/button';
import TeamFormDialog from '@/components/dashboard/team/TeamFormDialog';

export default function AddMemberButton() {
  return (
    <TeamFormDialog
      trigger={
        <Button className="px-3 rounded-full">
          Agregar
        </Button>
      }
    />
  );
}