import { Search as SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function Search({ value, onChange, placeholder = 'Buscar...' }: Props) {
  return (
    <div className="relative">
      <SearchIcon className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="left-0 w-full pl-10"
      />
    </div>
  );
}
