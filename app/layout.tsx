import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "@/app/globals.css";
import NavbarWrapper from "@/components/NavbarWrapper";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  variable: "--font-base",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["700"],
});

export const metadata: Metadata = {
  title: "Store Front",
  description: "Your store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('theme');
                  if (stored) {
                    document.documentElement.setAttribute('data-theme', stored);
                  } else {
                    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    var theme = prefersDark ? 'dark' : 'light';
                    document.documentElement.setAttribute('data-theme', theme);
                    localStorage.setItem('theme', theme);
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-bg text-text font-base">
        <AuthProvider>
          <CartProvider>
            <NavbarWrapper />
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}