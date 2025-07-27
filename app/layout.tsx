import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import "../app/globals.css";

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
      <body className={` ${MonaSans.className} antialiased pattern`}>
        {children}
      </body>
    </html>
  );
}
