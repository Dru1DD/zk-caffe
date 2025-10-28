import { useContext } from 'react';
import AccountContext from '@/contexts/account-context';

const useAccount = () => {
    return useContext(AccountContext);
};

export default useAccount;
