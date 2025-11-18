<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import ShoppingListActions from '$lib/components/ShoppingListActions.svelte';
	import JsonImportSection from '$lib/components/JsonImportSection.svelte';
	import ShoppingListContent from '$lib/components/ShoppingListContent.svelte';
	import EmptyShoppingList from '$lib/components/EmptyShoppingList.svelte';
	import { onMount } from 'svelte';
	import { useJsonImport } from '$lib/composables/useJsonImport';
	import { useShoppingList } from '$lib/composables/useShoppingList';
	import type { CategorizedIngredients } from '$lib/types/ingredients';

	// Initialize composables
	const jsonImport = useJsonImport();
	const shoppingList = useShoppingList();

	// Function to update jsonInput store
	function updateJsonInput(value: string) {
		jsonImport.jsonInput.set(value);
	}

	// Generate default shopping list
	function generateShoppingList(): CategorizedIngredients {
		return {
			"Frutas y Verduras": [
				{ id: 1, name: "Fresones", quantity: "250", unit: "gramos", isChecked: false },
				{ id: 2, name: "Lechuga, tomate, cebolla", quantity: "1", unit: "unidad", isChecked: false },
				{ id: 3, name: "Brócoli, zanahoria, espárragos", quantity: "500", unit: "gramos", isChecked: false },
				{ id: 4, name: "Bayas variadas", quantity: "200", unit: "gramos", isChecked: false },
				{ id: 5, name: "Lechuga, tomate, queso, cebolla", quantity: "1", unit: "unidad", isChecked: false },
				{ id: 6, name: "Verduras variadas para sopa", quantity: "300", unit: "gramos", isChecked: false },
				{ id: 7, name: "Lechuga romana, pan croutons", quantity: "1", unit: "unidad", isChecked: false },
				{ id: 8, name: "Lechuga, tomate, maíz", quantity: "1", unit: "unidad", isChecked: false },
				{ id: 9, name: "Tomate, ajo", quantity: "200", unit: "gramos", isChecked: false },
				{ id: 10, name: "Guisantes, pimientos, habas", quantity: "300", unit: "gramos", isChecked: false },
				{ id: 11, name: "Zanahoria, cebolla, pimiento", quantity: "400", unit: "gramos", isChecked: false }
			],
			"Proteínas": [
				{ id: 12, name: "Pechuga de pollo", quantity: "500", unit: "gramos", isChecked: false },
				{ id: 13, name: "Salmón", quantity: "300", unit: "gramos", isChecked: false },
				{ id: 14, name: "Carne molida", quantity: "400", unit: "gramos", isChecked: false },
				{ id: 15, name: "Muslos de pollo", quantity: "600", unit: "gramos", isChecked: false },
				{ id: 16, name: "Bacalao salado", quantity: "200", unit: "gramos", isChecked: false },
				{ id: 17, name: "Atún en lata", quantity: "2", unit: "latas", isChecked: false },
				{ id: 18, name: "Pollo, mariscos variados", quantity: "400", unit: "gramos", isChecked: false }
			],
			"Lácteos y Huevos": [
				{ id: 19, name: "Yogur natural", quantity: "500", unit: "gramos", isChecked: false },
				{ id: 20, name: "Proteína en polvo", quantity: "1", unit: "kg", isChecked: false },
				{ id: 21, name: "Leche", quantity: "1", unit: "litro", isChecked: false },
				{ id: 22, name: "Queso parmesano", quantity: "100", unit: "gramos", isChecked: false },
				{ id: 23, name: "Huevos", quantity: "12", unit: "unidades", isChecked: false },
				{ id: 24, name: "Queso mozzarella", quantity: "200", unit: "gramos", isChecked: false }
			],
			"Pan y Cereales": [
				{ id: 25, name: "Avena", quantity: "500", unit: "gramos", isChecked: false },
				{ id: 26, name: "Granola", quantity: "300", unit: "gramos", isChecked: false },
				{ id: 27, name: "Pasta", quantity: "500", unit: "gramos", isChecked: false },
				{ id: 28, name: "Pan integral", quantity: "1", unit: "pan", isChecked: false },
				{ id: 29, name: "Harina, levadura", quantity: "1", unit: "paquete", isChecked: false },
				{ id: 30, name: "Pan", quantity: "1", unit: "baguette", isChecked: false },
				{ id: 31, name: "Arroz bomba", quantity: "500", unit: "gramos", isChecked: false }
			],
			"Despensa": [
				{ id: 32, name: "Especias para tacos, tortillas", quantity: "1", unit: "paquete", isChecked: false },
				{ id: 33, name: "Salsa de tomate", quantity: "2", unit: "latas", isChecked: false },
				{ id: 34, name: "Caldo de verduras", quantity: "1", unit: "litro", isChecked: false },
				{ id: 35, name: "Hierbas aromáticas, aceite de oliva", quantity: "1", unit: "botella", isChecked: false },
				{ id: 36, name: "Aderezo César", quantity: "1", unit: "botella", isChecked: false },
				{ id: 37, name: "Pimientos, cebolla, aceite de oliva", quantity: "1", unit: "paquete", isChecked: false },
				{ id: 38, name: "Salsa de tomate, aceitunas", quantity: "2", unit: "latas", isChecked: false },
				{ id: 39, name: "Aceite de oliva", quantity: "1", unit: "litro", isChecked: false },
				{ id: 40, name: "Azafrán, caldo de pescado", quantity: "1", unit: "paquete", isChecked: false },
				{ id: 41, name: "Chorizo, laurel", quantity: "1", unit: "paquete", isChecked: false }
			],
			"Otros": []
		};
	}

	// Event handlers
	function handleLoadFromJson() {
		console.log('handleLoadFromJson called');
		const result = jsonImport.loadFromJson();
		console.log('Result from loadFromJson:', result);
		if (result) {
			shoppingList.updateIngredients(result);
		}
	}

	function handleClearList() {
		if (confirm('¿Estás seguro de que quieres eliminar toda la lista de compras? Esta acción no se puede deshacer.')) {
			shoppingList.clearShoppingList();
		}
	}

	function restoreList() {
		const defaultIngredients = generateShoppingList();
		shoppingList.updateIngredients(defaultIngredients);
	}

	function handleToggleJsonInput() {
		console.log('handleToggleJsonInput called');
		jsonImport.toggleJsonInput();
	}

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
				showJsonInput={showJsonInput}
				listCleared={listCleared}
				onToggleJsonInput={() => handleToggleJsonInput()}
				onMarkAll={() => shoppingList.markAll()}
				onUnmarkAll={() => shoppingList.unmarkAll()}
				onPrintList={() => shoppingList.printList()}
				onClearList={() => handleClearList()}
			/>

			<!-- JSON Import Section - Always available -->
			<JsonImportSection
				showJsonInput={showJsonInput}
				jsonInput={jsonInput}
				onLoadFromJson={() => handleLoadFromJson()}
				onClearInput={() => updateJsonInput('')}
				onJsonInputChange={updateJsonInput}
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