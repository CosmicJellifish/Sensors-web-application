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
  title: "Electrochemical Sensor Monitor",
  description:
    "Browser dashboard for connecting Bluetooth Low Energy sensors, viewing live measurements, and reviewing history.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* Browser extensions stamp their own attributes onto <body> before React
          hydrates (ColorZilla's `cz-shortcut-listen`, password managers, and so
          on), which reads as a hydration mismatch. The warning is suppressed one
          level deep only, so mismatches inside the app are still reported. */}
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
