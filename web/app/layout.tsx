import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import ContextProvider from "@/context";

export const metadata: Metadata = {
  title: "NeuralVault — Own Your Neural Data",
  description:
    "The first blockchain-powered privacy layer for Brain-Computer Interface data. Sovereign identity, granular consent, and fair compensation — all on-chain.",
  keywords: [
    "BCI",
    "brain-computer interface",
    "neural data",
    "blockchain privacy",
    "data sovereignty",
    "EEG",
    "fMRI",
    "consent management",
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersObj = await headers();
  const cookies = headersObj.get("cookie");

  return (
    <html lang="en">
      <body className="antialiased">
        <ContextProvider cookies={cookies}>{children}</ContextProvider>
      </body>
    </html>
  );
}
