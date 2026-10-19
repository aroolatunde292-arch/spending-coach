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
  metadataBase: new URL("https://darling-figolla-840d43.netlify.app"),
  title: "Spending Coach | Make Your Money Last Longer",
  description:
    "Plan your budget, track your spending, and make your money last longer with Spending Coach.",
  applicationName: "Spending Coach",
  openGraph: {
    title: "Spending Coach | Make Your Money Last Longer",
    description:
      "Plan your budget, track your spending, and make your money last longer.",
    url: "https://darling-figolla-840d43.netlify.app/",
    siteName: "Spending Coach",
    type: "website",
    images: [
      {
        url: "/spending-coach-preview.png",
        width: 1536,
        height: 1024,
        alt: "Spending Coach — Plan your budget, track your spending, and make your money last longer.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Spending Coach | Make Your Money Last Longer",
    description:
      "Plan your budget, track your spending, and make your money last longer.",
    images: ["/spending-coach-preview.png"],
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
