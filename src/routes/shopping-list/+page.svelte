<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import ShoppingListActions from '$lib/components/ShoppingListActions.svelte';
	import ShoppingListContent from '$lib/components/ShoppingListContent.svelte';
	import EmptyShoppingList from '$lib/components/EmptyShoppingList.svelte';
	import AddFab from '$lib/components/AddFab.svelte';
	import { onMount } from 'svelte';
	import { useShoppingList } from '$lib/composables/useShoppingList';
	import type { CategorizedIngredients, Ingredient } from '$lib/types/ingredients';

	// Initialize composables
	const shoppingList = useShoppingList();

	// Event handlers
	function handleClearList() {
		if (confirm('¿Estás seguro de que quieres eliminar toda la lista de compras? Esta acción no se puede deshacer.')) {
			shoppingList.clearShoppingList();
		}
	}

	function restoreList() {
		shoppingList.loadFromAPI();
	}

	function handleAddIngredient(event: CustomEvent<{ ingredient: Ingredient }>) {
		shoppingList.addIngredient(event.detail.ingredient);
	}

	let loading = $state(false);
	let error = $state<string | null>(null);
	let ingredients = $state<CategorizedIngredients | null>(null);
	let listCleared = $state(false);

	// Suscribirse a los cambios
	onMount(() => {
		const unsubscribeLoading = shoppingList.loading.subscribe(value => loading = value);
		const unsubscribeError = shoppingList.error.subscribe(value => error = value);
		const unsubscribeIngredients = shoppingList.ingredients.subscribe(value => ingredients = value);
		const unsubscribeListCleared = shoppingList.listCleared.subscribe(value => listCleared = value);
		
		return () => {
			unsubscribeLoading();
			unsubscribeError();
			unsubscribeIngredients();
			unsubscribeListCleared();
		};
	});
</script>

<Navbar />
<main class="min-h-screen bg-gray-50 pt-16">
	<div class="max-w-4xl mx-auto py-8 px-4">
		<div class="bg-white rounded-lg shadow-md p-6">
			<h1 class="text-3xl font-bold text-gray-900 mb-8 text-center">🛒 Lista de Compras</h1>
			
			<!-- Loading indicator -->
			{#if loading}
				<div class="flex justify-center items-center py-8">
					<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
					<span class="ml-2 text-gray-600">Cargando lista de compras...</span>
				</div>
			{/if}

			<!-- Error message -->
			{#if error}
				<div class="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
					<div class="flex">
						<div class="flex-shrink-0">
							<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
								<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
							</svg>
						</div>
						<div class="ml-3">
							<p class="text-sm text-red-800">{error}</p>
							<button 
								onclick={() => shoppingList.loadFromAPI()}
								class="mt-2 text-sm text-red-600 underline hover:text-red-800"
							>
								Reintentar
							</button>
						</div>
					</div>
				</div>
			{/if}

			<!-- Action Buttons - Top of the page -->
			<ShoppingListActions
				listCleared={listCleared}
				onMarkAll={() => shoppingList.markAll()}
				onUnmarkAll={() => shoppingList.unmarkAll()}
				onPrintList={() => shoppingList.printList()}
				onClearList={() => handleClearList()}
			/>

			<!-- Shopping List Content -->
			{#if !loading && !error}
				{#if !listCleared}
					{#if ingredients}
						<div>
							<h2 class="text-xl font-semibold mb-4 text-gray-800">Ingredientes Necesarios</h2>
							<ShoppingListContent ingredients={ingredients} />
						</div>
					{:else}
						<div class="text-center py-8 text-gray-500">
							<p>No hay ingredientes en la lista</p>
						</div>
					{/if}
				{:else}
					<EmptyShoppingList onRestoreList={() => restoreList()} />
				{/if}
			{/if}
		</div>
	</div>
</main>

<!-- FAB Component -->
<AddFab 
	on:addIngredient={handleAddIngredient}
/>
