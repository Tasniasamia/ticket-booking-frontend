import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/theme-provider";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TicketBooking | Find and book live events",
  description: "Concerts, festivals and club nights. Book tickets in a few taps.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} dark h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-bg text-fg"><ThemeProvider>{children}</ThemeProvider></body>
    </html>
  );
}
