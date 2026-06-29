import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "@/shared/components/theme-provider";
import { QueryProvider } from "@/shared/components/query-provider";
import { Toaster } from "@/shared/components/ui/toaster";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Growth Intelligence Platform",
    template: "%s | Growth Intelligence",
  },
  description:
    "AI-powered executive operating system — unified revenue, customer, and product intelligence for modern SaaS teams.",
  keywords: ["SaaS", "revenue intelligence", "customer success", "churn prediction", "AI analytics"],
  authors: [{ name: "Growth Intelligence" }],
  openGraph: {
    title: "Growth Intelligence Platform",
    description: "AI-powered executive operating system for SaaS teams",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <QueryProvider>
            {children}
            <Toaster />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
