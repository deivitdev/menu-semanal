<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Ingredient } from '$lib/types/ingredients';

	export let isOpen = false;
	
	const dispatch = createEventDispatcher();
	
	let ingredient = {
		name: '',
		quantity: '',
		unit: '',
		observations: ''
	};

	function handleSubmit() {
		if (!ingredient.name.trim()) return;
		
		const newIngredient: Ingredient = {
			id: Date.now(), // ID temporal, se generará uno real en el backend
			name: ingredient.name.trim(),
			quantity: ingredient.quantity.trim(),
			unit: ingredient.unit.trim(),
			observations: ingredient.observations.trim()
		};
		
		dispatch('add', { ingredient: newIngredient });
		
		// Reset form
		ingredient = {
			name: '',
			quantity: '',
			unit: '',
			observations: ''
		};
		
		isOpen = false;
	}

	function handleCancel() {
		isOpen = false;
		ingredient = {
			name: '',
			quantity: '',
			unit: '',
			observations: ''
		};
	}
</script>

{#if isOpen}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true" tabindex="-1" on:click={handleCancel} on:keydown={(e) => e.key === 'Escape' && handleCancel()}>
		<div class="bg-white rounded-lg p-6 w-full max-w-md mx-4" on:click|stopPropagation role="document">
			<h3 class="text-lg font-semibold mb-4">Agregar Ingrediente</h3>
			
			<form on:submit|preventDefault={handleSubmit}>
				<div class="space-y-4">
					<div>
						<label for="ingredient-name" class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
						<input
							type="text"
							id="ingredient-name"
							bind:value={ingredient.name}
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Ej: Tomate"
							required
						/>
					</div>
					
					<div class="grid grid-cols-2 gap-4">
						<div>
							<label for="ingredient-quantity" class="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
							<input
								type="text"
								id="ingredient-quantity"
								bind:value={ingredient.quantity}
								class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Ej: 2"
							/>
						</div>
						
						<div>
							<label for="ingredient-unit" class="block text-sm font-medium text-gray-700 mb-1">Unidad</label>
							<input
								type="text"
								id="ingredient-unit"
								bind:value={ingredient.unit}
								class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Ej: unidades"
							/>
						</div>
					</div>
					
					<div>
						<label for="ingredient-observations" class="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
						<textarea
							id="ingredient-observations"
							bind:value={ingredient.observations}
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Ej: Bien maduro"
							rows="2"
						></textarea>
					</div>
				</div>
				
				<div class="flex justify-end space-x-3 mt-6">
					<button
						type="button"
						on:click={handleCancel}
						class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
					>
						Cancelar
					</button>
					<button
						type="submit"
						class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
						disabled={!ingredient.name.trim()}
					>
						Agregar
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
