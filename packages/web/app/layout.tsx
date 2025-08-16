'use client';
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext"; // Corrected path

// Metadata cannot be exported from a client component. 
// We will handle the title in the component itself if needed.
// export const metadata: Metadata = {
//   title: "Voli",
//   description: "Volunteer Management System",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}