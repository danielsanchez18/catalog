import { ChevronDown, ChevronRight, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLinkItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const NAV_ITEMS = [
  { label: 'Overview', href: '/dashboard' },
  { label: 'Productos', href: '/dashboard/productos' },
  { label: 'Servicios', href: '/dashboard/servicios' },
  { label: 'Team', href: '/dashboard/team' },
  { label: 'Clientes', href: '/dashboard/clientes' },
];

export default function Breadcrumb({ current = 'Overview' }: { current?: string }) {
  return (
    <div className="flex w-full items-center gap-x-3 border-b border-border px-5 py-2">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" size="icon" aria-label="Abrir menú" />
          }
        >
          <Menu className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {NAV_ITEMS.map((item) => (
            <DropdownMenuLinkItem
              key={item.href}
              href={item.href}
              className={item.label === current ? 'bg-accent text-accent-foreground' : ''}
            >
              {item.label}
            </DropdownMenuLinkItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <nav aria-label="Breadcrumb" className="flex items-center gap-x-3 text-sm">
        <span className="text-muted-foreground">Dashboard</span>
        <ChevronRight className="size-4 text-muted-foreground" />
        <span className="font-medium">{current}</span>
      </nav>
    </div>
  );
}
