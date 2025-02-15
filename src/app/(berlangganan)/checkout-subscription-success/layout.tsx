import type { Metadata } from 'next';
import 'bootstrap/dist/css/bootstrap.min.css';

import Footer from '@/components/footer';
import Header from '@/components/header';

export const metadata: Metadata = {
  title: 'Dapur Nusantara',
  description: 'B2B E-Commerce',
};

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header props={{ home: true, title: 'home' }} />
      {children}
      <Footer />
    </>
  );
}
