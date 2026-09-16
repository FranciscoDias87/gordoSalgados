'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { WhatsAppIcon } from './icons/whatsapp-icon';
import { siteConfig, whatsappLink } from '@/lib/config';

export function WhatsAppFab() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button if page is scrolled more than 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <div
      className={cn(
        'fixed bottom-8 right-8 z-50 transition-transform duration-300 ease-in-out',
        isVisible
          ? 'scale-100 opacity-100'
          : 'scale-95 opacity-0 pointer-events-none'
      )}
    >
      <Button
        asChild
        size="icon"
        className="h-16 w-16 rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#128C7E]"
      >
        <Link
          href={`${whatsappLink}?text=Olá!%20Eu%20gostaria%20de%20fazer%20um%20pedido%20na%20${siteConfig.businessName}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Pedir via WhatsApp"
        >
          <WhatsAppIcon className="h-24 w-24" />
        </Link>
      </Button>
    </div>
  );
}
