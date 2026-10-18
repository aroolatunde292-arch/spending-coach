import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  metadataBase: new URL("https://spending-coach-kappa.vercel.app"),
  title: "Spending Coach | Make Your Money Last Longer",
  description:
    "Plan your budget, track your spending, and make your money last longer with Spending Coach.",
  applicationName: "Spending Coach",
  openGraph: {
    title: "Spending Coach | Make Your Money Last Longer",
    description:
      "Plan your budget, track your spending, and make your money last longer.",
    url: "https://spending-coach-kappa.vercel.app/",
    siteName: "Spending Coach",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Spending Coach | Make Your Money Last Longer",
    description:
      "Plan your budget, track your spending, and make your money last longer.",
  },
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
