import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import { Navbar } from "./components/Navbar";
  
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Siddesh | Software Engineer",
  description: "Portfolio website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}