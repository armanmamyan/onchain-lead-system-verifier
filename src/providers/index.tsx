'use client';
import { ThemeProvider } from 'next-themes';
import React from 'react';
import { env } from '@/lib/env';
import { AirkitProvider } from './AirkitProvider';
import { mainnet } from '@reown/appkit/networks';
import { cookieStorage, createStorage } from '@wagmi/core'
import { cookieToInitialState, WagmiProvider, type Config, } from 'wagmi'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { createAppKit } from '@reown/appkit/react'


const queryClient = new QueryClient()

const projectId = process.env.NEXT_PUBLIC_WALLET_KIT_ID ?? "" ;
const networks = [mainnet]
const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks
})

const metadata = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "Oyunfor Gaming Platform",
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION ?? "Access exclusive Web3 games with verified on-chain credentials",
  url: process.env.NEXT_PUBLIC_ORIGIN_URL ?? "http://localhost:3000", // origin must match your domain & subdomain
  icons: ["https://static.air3.com/partner/partner_generic_icon.svg"]  // <------ Add Icon URL here 
}


const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [mainnet],
  defaultNetwork: mainnet,
  metadata: metadata,
  features: {
    analytics: true,
    swaps: false,
    onramp: false,
    email: false,
    socials: [],
    emailShowWallets: false,
  },
})


export const Providers: React.FC<{
  children: React.ReactNode;
  cookies: string | null
}> = ({ children, cookies }) => {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      forcedTheme={
        env.NEXT_PUBLIC_THEME !== 'system' ? env.NEXT_PUBLIC_THEME : undefined
      }
    >
      <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
        <QueryClientProvider client={queryClient}>
          <AirkitProvider>{children}</AirkitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
};
