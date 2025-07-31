import { useAccount, useDisconnect } from "wagmi";

const HomePage = () => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  return (
    <div>
      <span>This is a home page</span>
      <p>Address: {address}</p>
      <button onClick={() => disconnect()}>Disconnect</button>
    </div>
  );
};

export default HomePage;
