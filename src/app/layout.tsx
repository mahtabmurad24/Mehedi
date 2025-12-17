import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ModernPreloader } from "@/components/modern-preloader";
import { ClientLayout } from "@/components/client-layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mehedi's Math Academy",
  description: "Premium mathematics education platform with interactive courses and expert guidance.",
  keywords: ["Math Academy", "Mathematics", "Education", "Courses", "Learning"],
  authors: [{ name: "Mehedi's Math Academy" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Mehedi's Math Academy",
    description: "Premium mathematics education platform with interactive courses and expert guidance.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mehedi's Math Academy",
    description: "Premium mathematics education platform with interactive courses and expert guidance.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ModernPreloader />
        <ClientLayout>{children}</ClientLayout>
        <Toaster />
      </body>
    </html>
  );
}
