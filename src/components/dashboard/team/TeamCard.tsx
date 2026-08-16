import { TableCell, TableRow } from '@/components/ui/table';
import TeamActions from '@/components/dashboard/team/TeamActions';
import type { TeamMember } from '@/lib/types';

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

const getInitials = (member: TeamMember) => {
  const name = member.full_name ?? member.email;
  const parts = name.split(' ').filter(Boolean);
  return parts.length > 1 ? parts[0][0] + parts[1][0] : name.slice(0, 2);
};

const Avatar = ({ member }: { member: TeamMember }) => (
  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary uppercase">
    {getInitials(member)}
  </div>
);

export function TeamTableRow({ member }: { member: TeamMember }) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-x-3 min-w-0">
          <Avatar member={member} />
          <div className="flex flex-col min-w-0">
            <p className="text-sm font-medium truncate">{member.full_name ?? 'Sin nombre'}</p>
            <p className="text-sm text-muted-foreground truncate max-w-72">{member.email}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <p className="text-sm font-medium">{member.email}</p>
      </TableCell>
      <TableCell>
        <span className="w-fit rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
          Equipo
        </span>
      </TableCell>
      <TableCell>
        <p className="text-sm text-muted-foreground whitespace-nowrap">
          {formatDate(member.created_at)}
        </p>
      </TableCell>
      <TableCell className="text-right">
        <TeamActions member={member} />
      </TableCell>
    </TableRow>
  );
}

export default function TeamCard({ member }: { member: TeamMember }) {
  return (
    <div className="border border-border rounded-xl p-4 space-y-3">
      <div className="flex items-start justify-between gap-x-3">
        <div className="flex items-center gap-x-3 min-w-0">
          <Avatar member={member} />
          <div className="flex flex-col min-w-0">
            <p className="text-sm font-medium truncate">{member.full_name ?? 'Sin nombre'}</p>
            <p className="text-sm text-muted-foreground truncate">{member.email}</p>
          </div>
        </div>
        <span className="w-fit rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
          Equipo
        </span>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{formatDate(member.created_at)}</p>
        <TeamActions member={member} />
      </div>
    </div>
  );
}