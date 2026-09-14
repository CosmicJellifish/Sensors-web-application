import { Inter } from "next/font/google";

import { SideNav } from "./_components/side-nav";

// The dashboard screens are set in Inter in Figma; scope it to this segment so
// the app-wide Geist stack is untouched.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function DashboardLayout({ children }: LayoutProps<"/">) {
  return (
    <div
      className={`${inter.variable} flex min-h-dvh bg-canvas font-[family-name:var(--font-inter)]`}
    >
      <SideNav />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
