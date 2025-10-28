import { ReactNode } from 'react';
import AccountContext, { AccountContextData } from '@/contexts/account-context';

export interface AccountProviderProps {
  children: ReactNode;
  value: AccountContextData;
}

const AccountProvider = ({ children, value }: AccountProviderProps) => {
  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
};

export default AccountProvider;
