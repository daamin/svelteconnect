<script>
	import { wallet, connect, disconnect, cancelConnect, configure } from './wallet.svelte.js';
	import Modal from './Modal.svelte';
	
	let { 
		projectId,
		chains = [1],
		optionalChains = [1, 137, 56, 42161, 10],
		metadata = undefined,
		class: className = ''
	} = $props();
	
	$effect(() => {
		configure({ projectId, chains, optionalChains, metadata });
	});
	
	function handleClick() {
		if (wallet.address) {
			disconnect();
		} else {
			connect();
		}
	}
	
	function formatAddress(addr) {
		return addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '';
	}
</script>

<button class="sc-btn {className}" onclick={handleClick} disabled={wallet.isConnecting && !wallet.qrCodeUri}>
	{#if wallet.address}
		{formatAddress(wallet.address)}
	{:else if wallet.isConnecting}
		Connecting...
	{:else}
		Connect
	{/if}
</button>

<Modal 
	open={wallet.isConnecting} 
	qrUri={wallet.qrCodeUri} 
	onclose={cancelConnect} 
/>

<style>
	.sc-btn {
		background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
		color: #fff;
		border: none;
		padding: 12px 24px;
		border-radius: 12px;
		font-size: 16px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
	}
	
	.sc-btn:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 10px 20px -10px rgba(59, 130, 246, 0.5);
	}
	
	.sc-btn:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}
</style>

