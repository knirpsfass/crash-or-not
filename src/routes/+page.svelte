<script>
	import { Check, X } from '@lucide/svelte';
	import { onMount } from 'svelte';

	let kurs = null;
	let fehler = null;
	let lastUpdated = null;

	async function fetchKurs() {
		try {
			const res = await fetch('/api/price');
			const data = await res.json();

			if (data.price) {
				kurs = parseFloat(data.price).toFixed(2);
				fehler = null;
				lastUpdated = new Date().toLocaleTimeString();
			} else {
				fehler = data.message || 'Keine Daten erhalten';
			}
		} catch (e) {
			fehler = 'Fehler beim Laden der Kursdaten';
		}
	}

	onMount(() => {
		fetchKurs();

		const interval = setInterval(() => {
			fetchKurs();
		}, 60_000);

		return () => clearInterval(interval);
	});
</script>

<div class="flex min-h-screen flex-col items-center justify-center px-4 text-center">
	<h1 class="mb-6 text-3xl font-bold sm:text-4xl">Hat Andy gewonnen?</h1>

	{#if kurs}
		{#if kurs > 3.95}
			<Check class="mb-2 h-16 w-16 text-green-500" />
			<div class="text-xl font-semibold text-green-600">JA</div>
		{:else}
			<X class="mb-2 h-16 w-16 text-red-500" />
			<div class="text-xl font-semibold text-red-600">NEIN</div>
		{/if}

		<p class="mt-4 text-lg text-gray-700">
			Aktueller Kurs: <strong>{kurs} €</strong>
		</p>
	{:else if fehler}
		<p class="text-lg text-red-500">{fehler}</p>
	{:else}
		<p class="text-lg text-gray-500">Lade Kursdaten...</p>
	{/if}

	{#if lastUpdated}
		<p class="mt-2 text-sm text-gray-500">Letzte Aktualisierung: {lastUpdated}</p>
	{/if}
</div>
