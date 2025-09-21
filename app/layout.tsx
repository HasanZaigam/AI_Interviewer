import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import "../app/globals.css";
import { Toaster } from "sonner";
import Link from 'next/link'
import Image from 'next/image'
import UserAvatar from './components/UserAvatar'

const MonaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Interviewer",
  description: "Your personal AI-powered interview assistant.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${MonaSans.className} antialiased pattern`}>
        <nav className="p-4 border-gray-700 fixed top-0 left-0 right-0 z-50 bg-dark-100">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.svg" alt="logo" width={32} height={32} />
              <h2 className="text-2xl font-bold text-white">AI Interviewer</h2>
            </Link>
            <UserAvatar />
          </div>
        </nav>
        <div className="pt-20">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}

