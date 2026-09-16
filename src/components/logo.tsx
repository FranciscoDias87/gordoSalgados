import Link from 'next/link';
import { ChefHat } from 'lucide-react'; // Trocando para um ícone mais "artesanal"
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn('flex items-center gap-2', className)}>
      {/* Se tiver uma imagem de logo real, use <Image /> aqui ao invés do ícone */}
      <ChefHat className="h-8 w-8 text-primary" />
      <span className="font-headline text-2xl font-bold tracking-tighter">
        Gordo Salgados
      </span>
    </Link>
  );
}
