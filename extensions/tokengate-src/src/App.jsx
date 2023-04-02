import {
  ConnectButton,
  ConnectWalletProvider,
  getDefaultConnectors,
  useConnectWallet,
} from "@shopify/connect-wallet";
import { Tokengate } from "@shopify/tokengate";
import { useSigner, configureChains, createClient, WagmiConfig } from "wagmi";
import { polygonMumbai } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { useEvaluateGate } from "./useEvaluateGate";
import {
  ChainId,
  ThirdwebSDKProvider,
  ConnectWallet,
  useAddress,
} from "@thirdweb-dev/react";

const ThirdwebProvider = ({ wagmiClient, children }) => {
  const { data: signer } = useSigner();

  return (
    <ThirdwebSDKProvider
      desiredChainId={ChainId.Mumbai}
      signer={signer}
      provider={wagmiClient.provider}
      queryClient={wagmiClient.queryClient}
    >
      {children}
    </ThirdwebSDKProvider>
  );
};

const _App = () => {
  const { isLocked, unlockingTokens, evaluateGate, gateEvaluation } =
    useEvaluateGate();
  const { wallet } = useConnectWallet({
    onConnect: (wallet) => {
      evaluateGate(wallet);
    },
  });

  const { requirements, reaction, gateType } = getGate();

  if (gateType === "thirdweb-exclusive") {
    return (
      <div
        className="sbc-rounded-tokengate sbc-bg-tokengate sbc-p-tokengate sbc-text-left sbc-shadow-tokengate sbc-border-tokengate"
        id="shopify-tokengate-card-container"
      >
        <Text as="h2" color="primary" variant="headingMd">
          Unlockable item
        </Text>
        <Text
          as="span"
          className="sbc-mt-1 sbc-block"
          variant="bodyMd"
          color="secondary"
        >
          To unlock this item, you need a special token
        </Text>
        <ConnectWallet />
      </div>
    );
  }
  return (
    <Tokengate
      isConnected={Boolean(wallet)}
      connectButton={<ConnectButton />}
      isLoading={false}
      requirements={requirements}
      reaction={reaction}
      isLocked={isLocked}
      unlockingTokens={unlockingTokens}
    />
  );
};

export const App = () => {
  return (
    <WagmiConfig client={client}>
      <ConnectWalletProvider chains={chains} wallet={undefined}>
        <ThirdwebProvider wagmiClient={client}>
          <_App />
        </ThirdwebProvider>
      </ConnectWalletProvider>
    </WagmiConfig>
  );
};

const getGate = () => window.myAppGates?.[0] || {};

const { chains, provider, webSocketProvider } = configureChains(
  [polygonMumbai],
  [publicProvider()]
);

const { connectors } = getDefaultConnectors({ chains });

const client = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});
