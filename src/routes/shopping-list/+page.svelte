<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import { onMount } from 'svelte';

	// Menu data extracted from index.astro
	const menuData = [
		{
			day: "Lunes",
			meals: {
				breakfast: "Avena con fresones",
				lunch: "Ensalada de pollo a la parrilla",
				dinner: "Salmón con verduras"
			}
		},
		{
			day: "Martes",
			meals: {
				breakfast: "Yogur con granola y bayas",
				lunch: "Tacos de carne molida",
				dinner: "Pasta con salsa de tomate"
			}
		},
		{
			day: "Miércoles",
			meals: {
				breakfast: "Tostadas con aguacate",
				lunch: "Sopa de verduras",
				dinner: "Pollo al horno con hierbas"
			}
		},
		{
			day: "Jueves",
			meals: {
				breakfast: "Batido de proteínas",
				lunch: "Ensalada César",
				dinner: "Bacalao a la vizcaína"
			}
		},
		{
			day: "Viernes",
			meals: {
				breakfast: "Huevos revueltos",
				lunch: "Curry de lentejas",
				dinner: "Chuletas de cerdo con puré"
			}
		},
		{
			day: "Fin de semana",
			meals: {
				breakfast: "Tostadas francesas",
				lunch: "Hamburguesas BBQ",
				dinner: "Cena especial"
			}
		}
	];

	// Extract ingredients from menu data
	const ingredients = {
		"Frutas y Verduras": [
			"Fresones (1 taza)",
			"Espinacas frescas (2 tazas)",
			"Tomates (4 unidades)",
			"Aguacates (2 unidades)",
			"Verduras mixtas (1 bolsa)",
			"Espárragos (1 manojo)",
			"Verduras de temporada (variado)",
			"Ajo (3 cabezas)",
			"Cebolla (2 unidades)",
			"Limones (4 unidades)",
			"Patatas (1 kg)",
			"Zanahorias (500g)",
			"Pimientos (3 unidades)",
			"Lechuga romana (1 cabeza)",
			"Berros (1 manojo)"
		],
		"Proteínas": [
			"Pechuga de pollo (500g)",
			"Salmón (2 filetes)",
			"Carne molida de ternera (500g)",
			"Chuletas de cerdo (4 unidades)",
			"Bacalao (2 filetes)",
			"Huevos (1 docena)",
			"Proteína en polvo (1 bolsa)"
		],
		"Lácteos y Huevos": [
			"Leche (1 litro)",
			"Yogur natural (2 tazas)",
			"Nata montada (1 taza)",
			"Mozzarella (200g)",
			"Queso parmesano (100g)",
			"Mantequilla (200g)"
		],
		"Pan y Cereales": [
			"Avena (1 taza)",
			"Tostadas (1 paquete)",
			"Granola (1 taza)",
			"Pancakes (mezcla)",
			"Pasta (500g)",
			"Arroz (2 tazas)",
			"Harina (1 taza)",
			"Pan para hamburguesas (4 unidades)",
			"Pan para sandwiches (1 baguette)"
		],
		"Despensa": [
			"Aceite de oliva (1 botella)",
			"Salsa de soja (1 botella)",
			"Salsa de tomate (1 lata)",
			"Arroz (2 tazas)",
			"Lentejas (1 taza)",
			" especias variadas",
			"Miel (1 frasco)",
			"Sirope de arce (1 frasco)",
			"Café (1 paquete)",
			"Té (variedad)"
		],
		"Otros": [
			"Frutos secos (1 taza)",
			"Semillas (variedad)",
			"Hierbas frescas (cilantro, perejil)",
			"Salsas y aderezos",
			"Queso rallado",
			"Bacon (200g)"
		]
	};

	let listCleared = $state(false);

	function clearShoppingList() {
		listCleared = true;
		
		// Clear localStorage if shopping list data is stored there
		if (typeof localStorage !== 'undefined') {
			localStorage.removeItem('shoppingList');
		}

		// Show confirmation message
		const message = document.createElement('div');
		message.className = 'fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg';
		message.textContent = 'Lista eliminada correctamente';
		document.body.appendChild(message);

		// Remove message after 3 seconds
		setTimeout(() => {
			document.body.removeChild(message);
		}, 3000);
	}

	function restoreList() {
		listCleared = false;
	}

	function markAll() {
		document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]').forEach(cb => cb.checked = true);
	}

	function unmarkAll() {
		document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]').forEach(cb => cb.checked = false);
	}

	function printList() {
		window.print();
	}
</script>

<Navbar />
<main class="min-h-screen bg-gray-50 pt-16">
	<div class="max-w-4xl mx-auto py-8 px-4">
		<div class="bg-white rounded-lg shadow-md p-6">
			<h1 class="text-3xl font-bold text-gray-900 mb-8 text-center">🛒 Lista de Compras</h1>
			
			<!-- Shopping List -->
			{#if !listCleared}
				<div>
					<h2 class="text-xl font-semibold mb-4 text-gray-800">Ingredientes Necesarios</h2>
					<div class="space-y-6">
						{#each Object.entries(ingredients) as [category, items]}
							<div class="border rounded-lg p-4">
								<h3 class="font-semibold text-lg mb-3 text-gray-900">
									{#if category === "Frutas y Verduras"}🥬{/if}
									{#if category === "Proteínas"}🥩{/if}
									{#if category === "Lácteos y Huevos"}🥛{/if}
									{#if category === "Pan y Cereales"}🍞{/if}
									{#if category === "Despensa"}🥫{/if}
									{#if category === "Otros"}🧂{/if}
									{" "}{category}
								</h3>
								<ul class="space-y-2">
									{#each items as item}
										<li class="flex items-center">
											<input type="checkbox" class="mr-3 w-4 h-4 text-blue-600">
											<span>{item}</span>
										</li>
									{/each}
								</ul>
							</div>
						{/each}
					</div>

					<!-- Botones de acción -->
					<div class="flex justify-center space-x-4 mt-8">
						<button 
							onclick={markAll}
							class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
						>
							Marcar todo
						</button>
						<button 
							onclick={unmarkAll}
							class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
						>
							Desmarcar todo
						</button>
						<button 
							onclick={printList}
							class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
						>
							Imprimir lista
						</button>
						<button 
							onclick={() => {
								if(confirm('¿Estás seguro de que quieres eliminar toda la lista de compras? Esta acción no se puede deshacer.')) { 
									clearShoppingList(); 
								}
							}}
							class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
						>
							Eliminar lista
						</button>
					</div>
				</div>
		{:else}
				<!-- Empty State -->
				<div class="text-center py-12">
					<div class="text-gray-500 text-lg mb-4">🛒</div>
					<p class="text-gray-500">La lista de compras está vacía</p>
					<button 
						onclick={restoreList}
						class="mx-auto block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors mt-8"
					>
						Restaurar lista
					</button>
				</div>
			{/if}
		</div>
	</div>
</main>
