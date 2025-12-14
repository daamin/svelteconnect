<script>
	import { ConnectButton, wallet } from '$lib';
</script>

<main>
	<h1>SvelteConnect Demo</h1>
	
	<ConnectButton projectId="YOUR_WALLETCONNECT_PROJECT_ID" />
	
	{#if wallet.address}
		<div class="info">
			<p><strong>Address:</strong> {wallet.address}</p>
			<p><strong>Chain ID:</strong> {wallet.chainId}</p>
		</div>
	{/if}
	
	{#if wallet.error}
		<p class="error">{wallet.error}</p>
	{/if}
</main>

<style>
	main {
		font-family: system-ui, -apple-system, sans-serif;
		max-width: 600px;
		margin: 100px auto;
		padding: 40px;
		text-align: center;
	}
	
	h1 {
		margin-bottom: 40px;
		color: #1a1a2e;
	}
	
	.info {
		margin-top: 32px;
		padding: 20px;
		background: #f5f5f5;
		border-radius: 12px;
		text-align: left;
		word-break: break-all;
	}
	
	.error {
		color: #ef4444;
		margin-top: 16px;
	}
</style>

