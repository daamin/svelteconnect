import { BrowserProvider } from 'ethers';
import EthereumProvider from '@walletconnect/ethereum-provider';

export const wallet = $state({
	address: null,
	chainId: null,
	provider: null,
	isConnecting: false,
	error: null,
	qrCodeUri: null
});

let wcProvider = null;
let config = {
	projectId: '',
	chains: [1],
	optionalChains: [1, 137, 56, 42161, 10],
	showQrModal: false
};

export function configure(options) {
	config = { ...config, ...options };
}

export async function connect() {
	if (wallet.isConnecting) return;
	
	wallet.isConnecting = true;
	wallet.error = null;
	wallet.qrCodeUri = null;

	try {
		// Start WalletConnect in parallel
		const wcPromise = connectWalletConnect();
		
		// Try MetaMask if available
		if (window.ethereum) {
			try {
				const accounts = await window.ethereum.request({ 
					method: 'eth_requestAccounts' 
				});
				
				if (accounts[0]) {
					wallet.provider = new BrowserProvider(window.ethereum);
					wallet.address = accounts[0];
					wallet.chainId = await window.ethereum.request({ method: 'eth_chainId' });
					wallet.isConnecting = false;
					wallet.qrCodeUri = null;
					
					// Cleanup WC if MetaMask succeeded
					if (wcProvider) {
						wcProvider.disconnect().catch(() => {});
					}
					
					setupMetaMaskListeners();
					return;
				}
			} catch (e) {
				// MetaMask rejected or failed, continue with WalletConnect
			}
		}
		
		// Wait for WalletConnect
		await wcPromise;
		
	} catch (e) {
		wallet.error = e.message;
		wallet.isConnecting = false;
	}
}

async function connectWalletConnect() {
	if (!config.projectId) {
		throw new Error('WalletConnect projectId is required');
	}

	wcProvider = await EthereumProvider.init({
		projectId: config.projectId,
		chains: config.chains,
		optionalChains: config.optionalChains,
		showQrModal: false,
		metadata: config.metadata || {
			name: 'SvelteConnect',
			description: 'Web3 Wallet Connection',
			url: typeof window !== 'undefined' ? window.location.origin : '',
			icons: []
		}
	});

	wcProvider.on('display_uri', (uri) => {
		wallet.qrCodeUri = uri;
	});

	wcProvider.on('connect', async () => {
		wallet.provider = new BrowserProvider(wcProvider);
		wallet.address = wcProvider.accounts[0];
		wallet.chainId = `0x${wcProvider.chainId.toString(16)}`;
		wallet.isConnecting = false;
		wallet.qrCodeUri = null;
	});

	wcProvider.on('disconnect', () => {
		resetWallet();
	});

	wcProvider.on('accountsChanged', (accounts) => {
		wallet.address = accounts[0] || null;
	});

	wcProvider.on('chainChanged', (chainId) => {
		wallet.chainId = `0x${chainId.toString(16)}`;
	});

	await wcProvider.connect();
}

function setupMetaMaskListeners() {
	if (!window.ethereum) return;
	
	window.ethereum.on('accountsChanged', (accounts) => {
		wallet.address = accounts[0] || null;
		if (!accounts[0]) resetWallet();
	});
	
	window.ethereum.on('chainChanged', (chainId) => {
		wallet.chainId = chainId;
	});
}

export async function disconnect() {
	if (wcProvider) {
		await wcProvider.disconnect().catch(() => {});
		wcProvider = null;
	}
	resetWallet();
}

function resetWallet() {
	wallet.address = null;
	wallet.chainId = null;
	wallet.provider = null;
	wallet.isConnecting = false;
	wallet.error = null;
	wallet.qrCodeUri = null;
}

export function cancelConnect() {
	if (wcProvider) {
		wcProvider.disconnect().catch(() => {});
		wcProvider = null;
	}
	wallet.isConnecting = false;
	wallet.qrCodeUri = null;
}

