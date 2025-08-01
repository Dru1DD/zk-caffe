import { createConfig, http } from 'wagmi';
import { metaMask } from 'wagmi/connectors';
import { mainnet, sepolia, base, baseSepolia } from 'wagmi/chains';

export const wagmiConfig = createConfig({
  chains: [mainnet, sepolia, base, baseSepolia],
  connectors: [metaMask()],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
});
