import Footer from '@/components/footer';
import Header from '@/components/header';

import { useAppContext } from '@/context';
export default function SaveCartLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col justify-between">
      <Header props={{ home: true, title: 'Keranjang Tersimpan' }} />
      {children}
      <div className="hidden lg:block">
        <Footer />
      </div>
    </div>
  );
}
