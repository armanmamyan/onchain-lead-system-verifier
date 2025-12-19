import { headers } from 'next/headers';
import { Header } from '@/components/common/Header';
import { Toaster } from '@/components/ui/sonner';
import { Providers } from '@/providers';
import Footer from '@/components/common/Footer';


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersObj = await headers();
  const cookies = headersObj.get('cookie');

  return (
    <>
      <Providers cookies={cookies}>
        <Header />

        {children}
        <Footer />
      </Providers>
      <Toaster position="top-center" />
    </>
  );
}
