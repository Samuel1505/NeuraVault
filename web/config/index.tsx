import { cookieStorage, createStorage } from "@wagmi/core";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { mainnet, sepolia } from "@reown/appkit/networks";

// Get your project ID at https://dashboard.reown.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID ?? "";

export const networks = [mainnet, sepolia] as const;

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks: [...networks],
});

export const config = wagmiAdapter.wagmiConfig;
