import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const notoSansJP = Noto_Sans_JP({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
});

const siteName = "PICK-ONE";
const description =
  "究極の2択で盛り上がろう！投票を通じて「違い」を楽しむ思想的な投票アプリ";
const url =
  process.env.NEXT_PUBLIC_SITE_URL || "https://pick-one-sigma.vercel.app";

export const metadata: Metadata = {
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description,
  metadataBase: new URL(url),
  openGraph: {
    title: siteName,
    description,
    url,
    siteName,
    images: [
      {
        width: 1200,
        height: 630,
        url: "/opengraph-image",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description,
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full bg-orange-50">
      <body
        className={`${notoSansJP.variable} flex flex-col h-screen overflow-hidden`}
      >
        <Header />
        {/* mainタグに直接パディングを追加して、レイアウトを制御する */}
        <main className="flex-grow w-full flex flex-col items-center overflow-y-auto bg-orange-50 pt-20 px-4 sm:px-8 pb-4 sm:pb-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
