
import type { Metadata } from "next";
import type { ReactNode, CSSProperties } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "InterviewIQ | Interview Preparation Platform",
  description:
    "Prepare for technical interviews with practice questions, coding challenges and mock interviews.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      style={
        {
          "--font-geist-sans": "Arial, Helvetica, sans-serif",
          "--font-geist-mono": "Consolas, monospace",
        } as CSSProperties
      }
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
