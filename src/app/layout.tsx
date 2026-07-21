import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "XP Calorie Count Generator",
  description: "XcelPros Meal Calorie Count and Macronutrient Generator powered by USDA databases.",
  keywords: ["calorie generator", "nutrition", "macronutrients", "XcelPros", "USDA food data"],
  authors: [{ name: "Antigravity Dev Team" }],
  openGraph: {
    title: "XP Calorie Count Generator",
    description: "Analyze dish calories and macronutrients instantly.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-105 transition-colors duration-200 antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col justify-start">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
