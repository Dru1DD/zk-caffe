import "@/styles/global.css";

import { WagmiProvider } from "wagmi";
import { BrowserRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ErrorBoundary from "@/components/error-boundary";
import Routing from "./routing";
import { wagmiConfig } from "@/lib/wagmi";

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <Routing />
          </QueryClientProvider>
        </WagmiProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
