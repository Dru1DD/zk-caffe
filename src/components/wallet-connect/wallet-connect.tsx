import { useConnect, useAccount, useDisconnect } from "wagmi";
import styles from "./wallet-connect.module.scss";

const WalletConnect = () => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { connectors, connect } = useConnect();

  return (
    <div className={styles.component}>
      <p>Address: {address}</p>
      <button onClick={() => disconnect()}>Disconnect</button>
      {connectors.map((connector) => (
        <button key={connector.uid} onClick={() => connect({ connector })}>
          {connector.name}
        </button>
      ))}
    </div>
  );
};

export default WalletConnect;
