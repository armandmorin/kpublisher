import type { Metadata } from "next";
import { UserProvider } from "@/contexts/user-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "KPublisher - AI-Powered Book Creation Platform",
  description: "Create professional books and covers using AI. Write, edit, and publish your content with ease.",
  keywords: ["AI", "book creation", "writing", "publishing", "content creation", "book covers"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
