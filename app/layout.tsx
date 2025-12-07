
'use client';

import './globals.css';
import { Geist, Geist_Mono } from 'next/font/google';
import dynamic from 'next/dynamic';
import { Provider } from 'react-redux';
import { store } from '@/lib/store';
import Navbar from './components/navbar';
import ClientOnly from './components/clientOnly';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

// FORCE CLIENT-ONLY → no SSR → no 401 on reload
const HydrateAuth = dynamic(() => import('@/src/hooks/useHydrateAuth'), { ssr: false });

function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ReduxProvider>
          <ClientOnly>
            <HydrateAuth />
          </ClientOnly>
          <Navbar />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}