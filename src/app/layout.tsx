import type { Metadata } from "next";
import "./globals.css";
import React from "react";

import Providers from "@/providers";

export const metadata: Metadata = {
  title: "2025 상반기 주요 대학 축제 일정",
  description: "2025학년도 상반기 주요 대학 축제 일정을 한눈에 확인하세요.",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="ko" className="bg-white w-full h-full">
      <body className="antialiased w-full h-full">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;