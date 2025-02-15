import 'bootstrap/dist/css/bootstrap.min.css';

import Footer from '@/components/footer';
import Header from '@/components/header';

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
