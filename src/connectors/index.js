import { FortmaticConnector } from '@web3-react/fortmatic-connector'
import { TorusConnector } from '@web3-react/torus-connector'
import { PortisConnector } from '@web3-react/portis-connector'
import { InjectedConnector } from './Injected'
import { WalletConnectConnector } from './Walletconnect'

const POLLING_INTERVAL = 8000
const RPC_URLS = {
  1: 'https://mainnet.infura.io/v3/a28f35f70591419cbf422c5e58cd047d',
  4: 'https://rinkeby.infura.io/v3/a28f35f70591419cbf422c5e58cd047d',
}

export const injected = new InjectedConnector({
  supportedChainIds: [1, 4],
})

export const walletconnect = new WalletConnectConnector({
  rpc: { 1: RPC_URLS[1] },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
})

export const fortmatic = new FortmaticConnector({
  apiKey: 'pk_live_CC75CEEE7D7E8630',
  chainId: 1,
})

export const torus = new TorusConnector({
  chainId: 1,
})

export const portis = new PortisConnector({
  dAppId: '409867db-d228-4327-abfc-ccd2e97f10a0',
  networks: [1],
})
