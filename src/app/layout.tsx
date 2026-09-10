import type { Metadata } from "next";
import { Geist, Geist_Mono, Nunito, Orbitron } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Succour Surrogacy",
  description: "Succour Surrogacy - Safe, ethical, and compassionate surrogacy services",
  keywords: "Surrogacy, Fertility, IVF, Succour, Succour Surrogacy, Surrogate, Succour Surrogacy Services, Surrogacy Services, Surrogate company, Surrogacy services in Lagos, Surrogacy services in Enugu, Surrogacy services in Nigeria, Surrogate job, Fertility Support, Fertility Services, Fertility Services in Nigeria, Fertility Services in Lagos ",
  openGraph:{
    title: 'Succour Surrogacy',
    description: 'Succour Surrogacy - Safe, ethical, and compassionate surrogacy services',
    images: ['/succour-logo.png'],
  },
  icons: {
    icon: '/succour-logo.png',
    apple: [
      {url: '/succour-logo.png'}
    ],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${nunito.variable} ${orbitron.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
