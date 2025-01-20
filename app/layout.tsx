import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import { Header } from "@/components/layout/Header"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Todo App",
  description: "A simple todo application",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Header />
          <div className="min-h-[calc(100vh-4rem)] bg-[#1a1f2c]">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}
