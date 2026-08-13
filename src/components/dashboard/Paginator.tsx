import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  page: number;
  totalPages: number;
  totalResults: number;
  onPageChange: (page: number) => void;
}

const WINDOW_SIZE = 2;

export default function Paginator({
  page,
  totalPages,
  totalResults,
  onPageChange,
}: Props) {
  const start = Math.max(1, Math.min(page, totalPages - WINDOW_SIZE + 1));
  const pages = Array.from(
    { length: Math.min(WINDOW_SIZE, totalPages) },
    (_, i) => start + i
  );

  return (
    <div className="flex items-center justify-between gap-x-5">
      <p className="text-sm">{totalResults} resultados</p>

      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft />
        </Button>
        {pages.map((p) => (
          <Button
            key={p}
            variant={p === page ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => onPageChange(p)}
          >
            {p}
          </Button>
        ))}
        <Button
          variant="ghost"
          size="icon"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}