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

export const metadata: Metadata = {
  title: "どっち派？",
  description: "投票を通じて“違い”を楽しむ思想的な投票アプリ",
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
