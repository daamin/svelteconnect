<script>
	let { open = false, qrUri = null, onclose } = $props();
	
	function generateQR(text, size = 256) {
		// Simple QR code URL using Google Charts API (no JS library needed)
		return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`;
	}
</script>

{#if open}
<div class="sc-overlay" onclick={onclose} onkeydown={(e) => e.key === 'Escape' && onclose()} role="button" tabindex="0">
	<div class="sc-modal" onclick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
		<button class="sc-close" onclick={onclose} aria-label="Close">&times;</button>
		
		<h2 class="sc-title">Connect Wallet</h2>
		
		{#if qrUri}
			<p class="sc-subtitle">Scan with your mobile wallet</p>
			<div class="sc-qr">
				<img src={generateQR(qrUri)} alt="WalletConnect QR Code" width="256" height="256" />
			</div>
		{:else}
			<div class="sc-loading">
				<div class="sc-spinner"></div>
				<p>Initializing connection...</p>
			</div>
		{/if}
	</div>
</div>
{/if}

<style>
	.sc-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.6);
		backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9999;
	}
	
	.sc-modal {
		background: #1a1a2e;
		border-radius: 16px;
		padding: 32px;
		min-width: 320px;
		max-width: 90vw;
		position: relative;
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}
	
	.sc-close {
		position: absolute;
		top: 12px;
		right: 12px;
		background: none;
		border: none;
		color: #888;
		font-size: 28px;
		cursor: pointer;
		line-height: 1;
		padding: 4px 8px;
		transition: color 0.2s;
	}
	
	.sc-close:hover {
		color: #fff;
	}
	
	.sc-title {
		margin: 0 0 8px;
		color: #fff;
		font-size: 20px;
		font-weight: 600;
		text-align: center;
	}
	
	.sc-subtitle {
		margin: 0 0 24px;
		color: #888;
		font-size: 14px;
		text-align: center;
	}
	
	.sc-qr {
		display: flex;
		justify-content: center;
		padding: 16px;
		background: #fff;
		border-radius: 12px;
	}
	
	.sc-qr img {
		display: block;
	}
	
	.sc-loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16px;
		padding: 32px;
		color: #888;
	}
	
	.sc-spinner {
		width: 40px;
		height: 40px;
		border: 3px solid rgba(255, 255, 255, 0.1);
		border-top-color: #3b82f6;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}
	
	@keyframes spin {
		to { transform: rotate(360deg); }
	}
</style>

