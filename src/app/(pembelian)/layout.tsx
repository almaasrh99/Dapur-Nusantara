import Footer from '@/components/footer';
import Header from '@/components/header';

import { useAppContext } from '@/context';
export default function CartLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-auto justify-between">
      <Header props={{ home: true, title: 'Keranjang Saya' }} />
      {children}
      <div className="hidden lg:block">
        <Footer />
      </div>
    </div>
  );
}
