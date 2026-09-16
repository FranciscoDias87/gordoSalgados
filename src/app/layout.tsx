import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { siteMetadata } from '@/lib/metadata';
import { Providers } from '@/components/providers';
import { MainLayout } from '@/components/layout/main-layout';

export const metadata: Metadata = siteMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Alegreya:wght@400;700&family=Belleza&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn('min-h-dvh bg-background font-body antialiased')}
        suppressHydrationWarning
      >
        <Providers>
          <MainLayout>{children}</MainLayout>
        </Providers>
      </body>
    </html>
  );
}
