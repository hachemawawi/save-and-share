
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Save&Share',
  description: 'Réduisez le gaspillage alimentaire en partageant vos surplus',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
            <a href ='http://localhost:3000/'><h1 className="text-2xl font-bold">Save&Share</h1></a>
            <ModeToggle />
          </header>
          <main className="container mx-auto p-4">
            {children}
          </main>
          <footer className="bg-secondary text-secondary-foreground p-4 text-center">
            <p>&copy; 2024 Save&Share. Tous droits réservés.</p>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  )
}