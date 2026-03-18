import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { JsonLd } from "@/components/json-ld";
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
  metadataBase: new URL("https://giovanes.dev"),
  title: "Giovane Saes | Product & AI Engineer",
  description:
    "Personal website of Giovane Saes - Product & AI Engineer. Read tech posts, explore my career journey, or play a typing game.",
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Giovane Saes",
    title: "Giovane Saes | Product & AI Engineer",
    description:
      "Personal website of Giovane Saes - Product & AI Engineer. Read tech posts, explore my career journey, or play a typing game.",
    images: [{ url: "/android-chrome-512x512.png", width: 512, height: 512 }],
  },
  twitter: {
    card: "summary",
    title: "Giovane Saes | Product & AI Engineer",
    description:
      "Personal website of Giovane Saes - Product & AI Engineer. Read tech posts, explore my career journey, or play a typing game.",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Giovane Saes",
            url: "https://giovanes.dev",
            description:
              "Personal website of Giovane Saes - Product & AI Engineer.",
            publisher: {
              "@type": "Organization",
              name: "Giovane Saes",
              logo: {
                "@type": "ImageObject",
                url: "https://giovanes.dev/android-chrome-512x512.png",
              },
            },
          }}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Giovane Saes",
            jobTitle: "Product & AI Engineer",
            url: "https://giovanes.dev",
            sameAs: [
              "https://github.com/giovanedaniel",
              "https://linkedin.com/in/giovanesaes",
            ],
          }}
        />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
