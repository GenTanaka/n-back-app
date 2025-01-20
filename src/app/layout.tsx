// src/app/layout.tsx

import "./globals.css";
import { Suspense } from "react";

export const metadata = {
  title: "N-back App",
  description: "N-back task application with Next.js 13 + Tailwind CSS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-white text-gray-800">
        {/* 全ページ共通のヘッダなど */}
        <header className="p-4 bg-white shadow">
          <h1 className="text-xl font-bold">N-back 課題アプリ</h1>
        </header>

        <main className="max-w-3xl mx-auto p-4">
          <Suspense>
            {children}
          </Suspense>
        </main>
      </body>
    </html>
  );
}
