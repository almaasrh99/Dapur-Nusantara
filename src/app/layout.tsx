import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import { Metadata } from 'next';

import { Toaster } from 'sonner';
import { AppWrapper } from '@/context';
import type { Metadata } from "next";
import { ReactNode } from "react";

interface RootLayoutProps {
  children: ReactNode;
}

export const metadata: Metadata = {
  title: {
    absolute: '',
    default: 'Home - Dapur Nusantara',
    template: '%s | Dapur Nusantara',
  },
  description: "B2B E-commerce",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Toaster position="top-center" expand visibleToasts={2} />
      <body>
        <AppWrapper>{children}</AppWrapper>
      </body>
    </html>
  );
}