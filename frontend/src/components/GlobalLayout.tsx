'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import { useTheme } from '@/context/ThemeContext';

interface Props {
  children: React.ReactNode;
}

export default function GlobalLayout({ children }: Props) {
  const pathname = usePathname();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isAuthPage = pathname?.startsWith('/auth');
  const blobRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!blobRef.current) return;

    const handlePointerMove = (e: PointerEvent) => {
      const { clientX, clientY } = e;
      const blob = blobRef.current;
      if (!blob) return;

      blob.animate(
        {
          left: `${clientX}px`,
          top: `${clientY}px`,
        },
        { duration: 3000, fill: 'forwards' }
      );
    };

    window.addEventListener('pointermove', handlePointerMove);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  const content = isAuthPage ? children : (
    <div className="min-h-screen flex flex-col dark:bg-dark bg-gray-50">
      <Navbar />
      <main className="flex-grow pt-16">{children}</main>
      <Footer />
    </div>
  );

  return (
    <>
      <div
        ref={blobRef}
        className="fixed blur-[100px] aspect-square w-[600px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 mix-blend-normal"
        style={{
          background: isDark 
            ? 'radial-gradient(circle at center, rgba(124, 58, 237, 0.35) 0%, rgba(6, 182, 212, 0.35) 45%, rgba(197, 13, 52, 0.35) 100%)'
            : 'radial-gradient(circle at center, rgba(124, 58, 237, 0.25) 0%, rgba(6, 182, 212, 0.25) 45%, rgba(197, 13, 52, 0.25) 100%)',
          animation: 'pulse 8s ease-in-out infinite'
        }}
      />
      {content}
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
          }
        }
      `}</style>
    </>
  );
}
