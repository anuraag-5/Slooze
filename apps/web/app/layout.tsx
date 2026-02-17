import "./globals.css";
import { poppinsFont } from "./fonts";
import { Toaster } from "sonner";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Slooze",
  description: "Business Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppinsFont.className}>
          {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
