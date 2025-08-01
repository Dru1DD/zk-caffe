import { Navigate, Outlet } from 'react-router-dom';
import { useAccount } from 'wagmi';

const PrivateRoute = () => {
  const account = useAccount();

  if (!account.address) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
