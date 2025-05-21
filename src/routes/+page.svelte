<script>
    import { Check, X } from '@lucide/svelte';
    import { onMount } from 'svelte';
  
    let kurs = null;
    let fehler = null;
  
    onMount(async () => {
      try {
        const res = await fetch('/api/price');
        const data = await res.json();
  
        if (data.price) {
          kurs = parseFloat(data.price).toFixed(2);
        } else {
          fehler = data.message || 'Keine Daten erhalten';
        }
      } catch (e) {
        fehler = 'Fehler beim Laden der Kursdaten';
      }
    });
  </script>
  
  <div class="min-h-screen flex flex-col items-center justify-center text-center px-4">
    <h1 class="text-3xl sm:text-4xl font-bold mb-6">Hat Andy gewonnen?</h1>
  
    {#if kurs}
      {#if kurs > 3.95}
        <Check class="text-green-500 w-16 h-16 mb-2" />
        <div class="text-xl font-semibold text-green-600">JA</div>
      {:else}
        <X class="text-red-500 w-16 h-16 mb-2" />
        <div class="text-xl font-semibold text-red-600">NEIN</div>
      {/if}
  
      <p class="mt-4 text-gray-700 text-lg">
        Aktueller Kurs: <strong>{kurs} €</strong>
      </p>
    {:else if fehler}
      <p class="text-red-500 text-lg">{fehler}</p>
    {:else}
      <p class="text-gray-500 text-lg">Lade Kursdaten...</p>
    {/if}
  </div>
  