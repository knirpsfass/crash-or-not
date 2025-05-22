<script lang="ts">
	import { Check, X } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	let stockPrice: number | null = null;
	let error: string | null = null;
	let lastUpdated: string | null = null;
	const sadEmojis = ['😭', '😢'];
	const partyEmojis = ['🥳', '🎊', '🎉', '🍾'];
	let drops = [];
	let emojis: string[] = [];
	const purchasePrice = 3.95;

	async function fetchKurs() {
		try {
			const res = await fetch('/api/price');
			const data = await res.json();

			if (data.price) {
				stockPrice = parseFloat(data.price);
				error = null;
				lastUpdated = new Date().toLocaleTimeString();
				if (stockPrice > purchasePrice) {
					emojis = partyEmojis;
				} else {
					emojis = sadEmojis;
				}
			} else {
				error = data.message || 'Keine Daten erhalten';
			}
		} catch (e) {
			error = 'Fehler beim Laden der Kursdaten';
		}
	}

	onMount(() => {
		fetchKurs();

		const kursInterval = setInterval(fetchKurs, 60_000);

		const emojiInterval = setInterval(() => {
			if (emojis.length === 0) return;

			const now = Date.now();

			drops = [
				...drops.filter((drop) => now - drop.timestamp < 5000),
				{
					id: Math.random(),
					emoji: emojis[Math.floor(Math.random() * emojis.length)],
					left: Math.random() * 100,
					size: Math.random() * 2 + 1,
					timestamp: now
				}
			];
		}, 200);

		return () => {
			clearInterval(kursInterval);
			clearInterval(emojiInterval);
		};
	});
</script>

<div class="pointer-events-none fixed inset-0 z-0 overflow-hidden">
	{#each drops as drop (drop.id)}
		<span
			class="drop"
			style="left: {drop.left}vw; font-size: {drop.size}rem;"
			in:fly={{ y: -100, duration: 9000 }}
			out:fly={{ y: window.innerHeight + 100, duration: 6000, opacity: 0 }}
		>
			{drop.emoji}
		</span>
	{/each}
</div>

<!-- Main UI Layer -->
<div class="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center">
	<h1 class="mb-6 text-3xl font-bold sm:text-4xl">Hat Andy gewonnen?</h1>

	{#if stockPrice}
		{#if stockPrice > purchasePrice}
			<Check class="mb-2 h-16 w-16 text-green-500" />
			<div class="text-xl font-semibold text-green-600">JA</div>
		{:else}
			<X class="mb-2 h-16 w-16 text-red-500" />
			<div class="text-xl font-semibold text-red-600">NEIN</div>
		{/if}

		<p class="mt-4 text-lg text-gray-700">
			Aktueller Kurs: <strong>{stockPrice.toFixed(2)} €</strong>
		</p>
	{:else if error}
		<p class="text-lg text-red-500">{error}</p>
	{:else}
		<p class="text-lg text-gray-500">Lade Kursdaten...</p>
	{/if}

	{#if lastUpdated}
		<p class="mt-2 text-sm text-gray-500">Letzte Aktualisierung: {lastUpdated}</p>
	{/if}
</div>

<style>
	.drop {
		position: fixed;
		top: 0;
		pointer-events: none;
	}
</style>
