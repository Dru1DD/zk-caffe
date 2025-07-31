import { useConnect } from "wagmi";
import { metaMask } from "wagmi/connectors";
import { useNavigate } from "react-router";
import styles from "./wallet-connect.module.scss";

const WalletConnect = () => {
  const { connect } = useConnect();

  const navigate = useNavigate();

  const handleWalletConnect = async () => {
    connect({
      connector: metaMask(),
    });

    navigate("/");
  };

  return (
    <div className={styles.component}>
      <button onClick={handleWalletConnect}>Wallet Connect</button>
    </div>
  );
};

export default WalletConnect;
