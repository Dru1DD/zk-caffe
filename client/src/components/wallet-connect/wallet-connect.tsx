/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCurrentAccount, useConnectWallet, useWallets, useDisconnectWallet } from '@mysten/dapp-kit';
import { isEnokiWallet } from '@mysten/enoki';

const WalletConnect = () => {
  const currentAccount = useCurrentAccount();

  const { mutateAsync: connectWallet } = useConnectWallet();
  const { mutateAsync: disconnectWallet } = useDisconnectWallet();

  const wallets = useWallets();

  const isConnectedViaGoogleZkLogin = () => {
    if (!currentAccount) {
      return false;
    }

    const enokiWallets = wallets.filter(isEnokiWallet);
    const googleWallet = enokiWallets.find(
      (wallet: any) => wallet.provider === 'google' || wallet.name?.includes('Google'),
    );

    return !!googleWallet && currentAccount.address !== undefined;
  };

  const handleGoogleLogin = async () => {
    try {
      if (currentAccount) {
        await disconnectWallet();
        console.log('Disconnected existing wallet');
      }

      // Find Enoki Google wallet
      const enokiWallets = wallets.filter(isEnokiWallet);
      const googleWallet = enokiWallets.find(
        (wallet: any) => wallet.provider === 'google' || wallet.name?.includes('Google'),
      );

      if (!googleWallet) {
        alert('Google zkLogin wallet not found. Make sure Enoki is configured properly.');
        return;
      }

      // Connect with Google zkLogin
      await connectWallet({ wallet: googleWallet });
      console.log('Google zkLogin successful!');
    } catch (error) {
      console.error('Google zkLogin failed:', error);
      alert('Login failed: ' + (error as Error).message);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectWallet();
      console.log('Wallet disconnected');
    } catch (error) {
      console.error('Disconnect failed:', error);
    }
  };

  // If connected via Google zkLogin, show connected status
  if (currentAccount && isConnectedViaGoogleZkLogin()) {
    return (
      <div className="text-center">
        <span>✓ Connected via Google zkLogin</span>
        <button onClick={handleDisconnect}>Disconnect</button>
      </div>
    );
  }

  // If connected via another wallet, show warning and force Google login
  if (currentAccount && !isConnectedViaGoogleZkLogin()) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <span style={{ color: 'orange' }}>⚠️ Connected with another wallet</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleGoogleLogin}
            style={{
              backgroundColor: 'blue',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
            }}
          >
            Sign in with Google zkLogin
          </button>
          <button
            onClick={handleDisconnect}
            style={{
              backgroundColor: 'gray',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
            }}
          >
            Disconnect
          </button>
        </div>
      </div>
    );
  }

  // Not connected, show Google login button
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <button
        onClick={handleGoogleLogin}
        style={{ backgroundColor: 'blue', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px' }}
      >
        Sign in with Google zkLogin
      </button>
    </div>
  );
};

export default WalletConnect;
