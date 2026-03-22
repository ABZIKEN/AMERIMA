import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PURE ai",
  description:
    "Mobile-first PURE ai prototype for food intelligence workflows.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
