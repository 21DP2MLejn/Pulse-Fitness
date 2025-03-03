'use client';

import GlobalLayout from '@/components/GlobalLayout';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GlobalLayout>
      <div className="pt-16">
        {children}
      </div>
    </GlobalLayout>
  );
}
