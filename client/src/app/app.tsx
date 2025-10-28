import '@/styles/global.css';
import '@mysten/dapp-kit/dist/index.css';

import { BrowserRouter } from 'react-router';
import { ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import RegisterEnokiWallets from '@/providers/register-enoki-wallet';
import { networkConfig } from '@/lib/networkConfig';
import ErrorBoundary from '@/components/error-boundary';
import Routing from './routing';

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
          <QueryClientProvider client={queryClient}>
            <RegisterEnokiWallets />
            <WalletProvider>
              <Routing />
            </WalletProvider>
            <ToastContainer
              pauseOnFocusLoss={false}
              pauseOnHover={false}
              theme="dark"
              toastStyle={{ zIndex: 1000000 }}
              position="top-right"
            />
          </QueryClientProvider>
        </SuiClientProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
