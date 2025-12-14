# SvelteConnect

Web3 wallet connection for Svelte 5 applications using ethers v6 and WalletConnect v2.

## Install

```bash
npm install svelteconnect @walletconnect/ethereum-provider ethers
```

## Usage

```svelte
<script>
  import { ConnectButton, wallet } from 'svelteconnect';
</script>

<ConnectButton projectId="YOUR_WALLETCONNECT_PROJECT_ID" />

{#if wallet.address}
  <p>Connected: {wallet.address}</p>
{/if}
```

## Props

| Prop             | Type       | Default                   | Description                                 |
| ---------------- | ---------- | ------------------------- | ------------------------------------------- |
| `projectId`      | `string`   | required                  | WalletConnect Cloud project ID              |
| `chains`         | `number[]` | `[1]`                     | Required chains (default: Ethereum mainnet) |
| `optionalChains` | `number[]` | `[1, 137, 56, 42161, 10]` | Optional chains                             |
| `metadata`       | `object`   | auto                      | App metadata for WalletConnect              |
| `class`          | `string`   | `''`                      | Custom CSS class                            |

## Reactive State

Access wallet state anywhere via the `wallet` store:

```svelte
<script>
  import { wallet } from 'svelteconnect';
</script>

{wallet.address}    <!-- Connected address or null -->
{wallet.chainId}    <!-- Current chain ID -->
{wallet.provider}   <!-- ethers BrowserProvider -->
{wallet.isConnecting}
{wallet.error}
```

## Functions

```js
import { connect, disconnect, cancelConnect, configure } from "svelteconnect";

connect(); // Start connection
disconnect(); // Disconnect wallet
cancelConnect(); // Cancel ongoing connection
configure({ projectId, chains, optionalChains, metadata }); // Manual config
```

## Get WalletConnect Project ID

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Create a new project
3. Copy your Project ID

## License

GPLv3
