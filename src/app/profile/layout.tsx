import Footer from '@/components/footer';
import Header from '@/components/header';

import { useAppContext } from '@/context';
export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-screen justify-between">
      <Header props={{ home: true, title: 'Profile Saya' }} />
      {children}
      <div className="hidden lg:block">
        <Footer />
      </div>
    </div>
  );
}
