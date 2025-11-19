<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { goto } from '$app/navigation';
	import AddIngredientModal from './AddIngredientModal.svelte';
	import type { Ingredient } from '$lib/types/ingredients';

	export let showJsonInput = false;

	// Usamos esta propiedad para sincronizar con el componente padre
	$: if (showJsonInput && showOptions) {
		showOptions = false;
	}

	const dispatch = createEventDispatcher();
	
	let showAddModal = false;
	let showOptions = false;

	function handleAddIngredient(event: CustomEvent<{ ingredient: Ingredient }>) {
		const { ingredient } = event.detail;
		dispatch('addIngredient', { ingredient });
	}

	function handleAddJson() {
		showOptions = false;
		goto('/json-loader');
	}

	function toggleOptions() {
		showOptions = !showOptions;
	}
</script>

<!-- FAB Button -->
<div class="fixed bottom-6 right-6 z-40">
	<div class="relative">
		<!-- Options Menu -->
		{#if showOptions}
			<div class="absolute bottom-16 right-0 space-y-2">
				<button
					on:click={handleAddJson}
					class="flex items-center bg-white text-gray-700 px-4 py-3 rounded-lg shadow-lg hover:bg-gray-50 whitespace-nowrap transition-all"
				>
					<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
					</svg>
					Importar JSON
				</button>
				
				<button
					on:click={() => { showAddModal = true; showOptions = false; }}
					class="flex items-center bg-white text-gray-700 px-4 py-3 rounded-lg shadow-lg hover:bg-gray-50 whitespace-nowrap transition-all"
				>
					<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
					</svg>
					Agregar ingrediente
				</button>
			</div>
		{/if}

		<!-- FAB Main Button -->
		<button
			on:click={toggleOptions}
			class="fab-button w-14 h-14 rounded-full shadow-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-4 flex items-center justify-center"
			aria-label="Agregar ingredientes"
		>
			<svg class="w-6 h-6 {showOptions ? 'rotate-45' : ''} transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
			</svg>
		</button>
	</div>
</div>

<!-- Add Ingredient Modal -->
<AddIngredientModal 
	isOpen={showAddModal} 
	on:add={handleAddIngredient} 
/>

<!-- Close options when clicking outside -->
{#if showOptions}
	<div class="fixed inset-0 z-30" role="button" tabindex="0" on:click={() => showOptions = false} on:keydown={(e) => e.key === 'Enter' && (showOptions = false)}></div>
{/if}
