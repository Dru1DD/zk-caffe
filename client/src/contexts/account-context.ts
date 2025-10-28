import { CreateKernelAccountReturnType, KernelAccountClient } from '@zerodev/sdk';
import { createContext } from 'react';
import { EntryPointVersion } from 'viem/account-abstraction';

export interface AccountContextData {
    kernelAccount: CreateKernelAccountReturnType<EntryPointVersion>;
    kernelClient: KernelAccountClient;
}

const AccountContext = createContext<AccountContextData | null>(null);

export default AccountContext;
