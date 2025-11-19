<script lang="ts">
	import type { CategorizedIngredients } from '$lib/types/ingredients';
	import IngredientItem from './IngredientItem.svelte';

	export let ingredients: CategorizedIngredients;

	const categoryIcons = {
		"Frutas y Verduras": "🥦",
		"Proteínas": "🥩",
		"Lácteos y Huevos": "🥛",
		"Pan y Cereales": "🍞",
		"Despensa": "🥫",
		"Otros": "📦"
	};

	const categoryColors = {
		"Frutas y Verduras": "border-green-200 bg-green-50",
		"Proteínas": "border-red-200 bg-red-50",
		"Lácteos y Huevos": "border-blue-200 bg-blue-50",
		"Pan y Cereales": "border-yellow-200 bg-yellow-50",
		"Despensa": "border-orange-200 bg-orange-50",
		"Otros": "border-gray-200 bg-gray-50"
	};
</script>

<div class="space-y-6">
	{#each Object.entries(ingredients) as [category, items]}
		{#if items.length > 0}
			<div 
				class="border rounded-lg p-4 {categoryColors[category as keyof typeof categoryColors]}"
			>
				<h3 class="font-semibold text-lg mb-4 text-gray-900 flex items-center">
					<span class="text-2xl mr-2">{categoryIcons[category as keyof typeof categoryIcons]}</span>
					{category}
				</h3>
				{#if items.length > 0}
					<ul class="space-y-2">
						{#each items as ingredient}
							<IngredientItem 
								ingredient={ingredient} 
							/>
						{/each}
					</ul>
				{:else}
					<p class="text-gray-500 text-sm italic">No hay ingredientes en esta categoría</p>
				{/if}
			</div>
		{/if}
	{/each}
</div>
