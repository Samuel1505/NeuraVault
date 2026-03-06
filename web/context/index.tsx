"use client";

import { wagmiAdapter, projectId } from "@/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import { mainnet, sepolia } from "@reown/appkit/networks";
import React, { type ReactNode } from "react";
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";

const queryClient = new QueryClient();

createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [mainnet, sepolia],
  defaultNetwork: mainnet,
  metadata: {
    name: "NeuralVault",
    description:
      "The first blockchain-powered privacy layer for Brain-Computer Interface data.",
    url: "https://neuralvault.io",
    icons: ["https://neuralvault.io/icon.png"],
  },
  themeMode: "dark",
  themeVariables: {
    "--w3m-font-family": "'Space Grotesk', sans-serif",
    "--w3m-accent": "#2d5ba3",
    "--w3m-color-mix": "#030b18",
    "--w3m-color-mix-strength": 40,
    "--w3m-border-radius-master": "4px",
    "--w3m-z-index": 200,
  },
  features: {
    analytics: false,
    email: true,
    socials: [],
  },
});

export default function ContextProvider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) {
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    cookies
  );

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig as Config}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
