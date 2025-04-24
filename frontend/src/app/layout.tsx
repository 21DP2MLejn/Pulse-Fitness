import './globals.css';
import Providers from '@/components/Providers';
import GlobalLayout from '@/components/GlobalLayout';

export const metadata = {
  title: 'PulseFitness',
  description: 'Your personal fitness companion',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <GlobalLayout>{children}</GlobalLayout>
        </Providers>
      </body>
    </html>
  );
}
