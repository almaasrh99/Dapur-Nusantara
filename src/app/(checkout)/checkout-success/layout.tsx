import Footer from '@/components/footer';
import Header from '@/components/header';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Checkout Success',
};

export default function CartLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-screen justify-between ">
      <Header props={{ home: true, title: metadata.title }} />
      {children}
      <Footer />
    </div>
  );
}
