import { useCurrentWallet } from '@mysten/dapp-kit';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const { isConnected } = useCurrentWallet();

  if (!isConnected) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
