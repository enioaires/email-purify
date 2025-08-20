import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EmailPurify - Limpeza Instantânea de Listas de E-mail",
  description: "Ferramenta web gratuita para validação e limpeza instantânea de listas de e-mail. 100% client-side, sem upload para servidores. Suporte para CSV, TXT e XLSX.",
  keywords: "email validation, email cleaning, lista de email, validação de email, marketing digital",
  authors: [{ name: "EmailPurify" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "EmailPurify - Limpeza Instantânea de Listas de E-mail",
    description: "Ferramenta web gratuita para validação e limpeza instantânea de listas de e-mail.",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "EmailPurify - Limpeza Instantânea de Listas de E-mail",
    description: "Ferramenta web gratuita para validação e limpeza instantânea de listas de e-mail.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}