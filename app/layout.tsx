import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hatch Feature Library",
  description: "Track key product experiments and releases powered by Statsig.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-sand-50 text-stone-900`}
      >
        <div className="min-h-screen bg-gradient-to-b from-sand-50 via-sand-100 to-sand-50">
          <header className="bg-gradient-to-r from-amber-50/90 via-sand-100 to-[#385481]/10 border-b border-white/60 shadow-sm backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
                  Hatch
                </p>
                <h1 className="text-2xl font-semibold text-stone-900">
                  Feature Library
                </h1>
              </div>
              <nav className="flex items-center gap-4 text-sm font-medium text-stone-700">
                <Link
                  href="/features"
                  className="rounded-full px-3 py-1 transition hover:bg-white/70 hover:text-stone-900"
                >
                  Features
                </Link>
              </nav>
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
        </div>
      </body>
    </html>
  );
}
