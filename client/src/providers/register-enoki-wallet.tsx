import { useEffect } from 'react';
import { useSuiClientContext } from '@mysten/dapp-kit';
import { isEnokiNetwork, registerEnokiWallets } from '@mysten/enoki';

function RegisterEnokiWallets() {
  const { client, network } = useSuiClientContext();

  useEffect(() => {
    if (!isEnokiNetwork(network)) return;

    const { unregister } = registerEnokiWallets({
      apiKey: import.meta.env.VITE_ENOKI_PUBLIC_KEY,
      providers: {
        google: {
          clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      client: client as any,
      network,
    });

    return unregister;
  }, [client, network]);

  return null;
}

export default RegisterEnokiWallets;
