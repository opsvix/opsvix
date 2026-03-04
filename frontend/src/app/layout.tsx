import type { Metadata } from "next";
import { Geist, Geist_Mono, Merriweather } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ContactProvider } from "@/context/ContactContext";
import { RootLayoutContent } from "@/components/RootLayoutContent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const MerriWeather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: "300",
})

const telegraf = localFont({
  src: [
    {
      path: "../../public/telegraf/TelegrafRegular_272984568a25d8528fe2de8b20b29011.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/telegraf/Telegraf UltraLight 200.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/telegraf/Telegraf UltraBold 800.otf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-telegraf",
});

export const metadata: Metadata = {
  title: "Opsvix",
  description: `Opsvix Solutions partners with global companies to design, build, and
        scale digital products through strong engineering, practical AI, and
        reliable cloud systems.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${telegraf.variable} ${geistSans.variable} ${geistMono.variable} ${MerriWeather.variable} antialiased`}
      >
        <ContactProvider>
          <RootLayoutContent>{children}</RootLayoutContent>
        </ContactProvider>
      </body>
    </html>
  );
}
