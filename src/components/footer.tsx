import Link from 'next/link';
import { Facebook, Instagram } from 'lucide-react';

import { Logo } from './logo';
import { Button } from './ui/button';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-background/95">
      <div className="container flex flex-col items-center justify-between gap-6 py-8 sm:flex-row">
        <Logo />
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <Instagram className="h-6 w-6" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon">
            <Link
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <Facebook className="h-6 w-6" />
            </Link>
          </Button>
        </div>
      </div>
      <div className="container border-t border-border/40 py-4 text-center text-sm text-foreground/60">
        &copy; {currentYear} Gordo Salgados. Todos os direitos reservados.
      </div>
    </footer>
  );
}
