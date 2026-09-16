'use client';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { WhatsAppFab } from '@/components/whatsapp-fab';
import { Toaster } from '@/components/ui/toaster';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <Toaster />
      <WhatsAppFab />
    </div>
  );
}