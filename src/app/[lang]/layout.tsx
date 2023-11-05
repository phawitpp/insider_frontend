import type { Metadata } from "next";
import { Anton, Mitr } from "next/font/google";
import "./globals.css";
import { WebSocketProvider } from "@/utils/socketProvider";

const anton = Anton({
  weight: ["400"],
  subsets: ["latin"],
});
const mitr = Mitr({
  weight: ["400", "600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Insider Board game",
  description: "by phawitpp",
};

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  return (
    <html lang={params.lang}>
      <body className={params.lang == "en" ? anton.className : mitr.className}>
        <WebSocketProvider>{children}</WebSocketProvider>
      </body>
    </html>
  );
}
