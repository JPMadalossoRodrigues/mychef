import type { Metadata } from "next";
import { Parisienne, Poppins, Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/app/components/layout/NavBar";
import { FilterProvider } from "./context/FilterContext";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '700'],
})

const parisienne = Parisienne({
  subsets: ['latin'],
  variable: '--font-parisienne',
  weight: ['400'],
})

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['400', '600', '700'],
})

export const metadata = {
  title: 'My Chef',
  description: 'Healthy recipes app',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} ${parisienne.variable} font-body`} suppressHydrationWarning={true}>
        <FilterProvider>
          <div className="min-h-screen">
            <NavBar />
            {children}
          </div>
        </FilterProvider>
      </body>
    </html>
  );
}
