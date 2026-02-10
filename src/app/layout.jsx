import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { AlertProvider } from "@/context/AlertContext";
import { RefreshProvider } from "@/context/RefreshContext";
import { ThemeProvider } from "next-themes";
import { NavigationLoader } from "@/components/ui/NavigationLoader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Luma internal App",
  description: "by Thompson",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AlertProvider>
          <RefreshProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
            >
              <NavigationLoader />
              {children}
            </ThemeProvider>
          </RefreshProvider>
        </AlertProvider>
      </body>
    </html>
  );
}
