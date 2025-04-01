import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import MouseHighlight from "@/components/mouse-highlight"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "DevProfiler - AI-Powered Digital Profile Analyzer for Developers",
  description:
    "Optimize your digital presence, understand your strengths, and stand out to recruiters with our comprehensive profile analysis.",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
          <MouseHighlight />
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'