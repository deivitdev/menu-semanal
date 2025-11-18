<script lang="ts">
	import type { Ingredient } from '$lib/types/ingredients';

	interface Props {
		ingredient: Ingredient;
		onToggle?: (id: number) => void;
	}

	let { ingredient, onToggle }: Props = $props();

	function handleToggle() {
		if (onToggle) {
			onToggle(ingredient.id);
		}
	}
</script>

<li class="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
	<div class="flex items-center flex-1">
		<input 
			type="checkbox" 
			checked={ingredient.isChecked} 
			onchange={handleToggle}
			class="mr-3 w-5 h-5 text-blue-600 rounded focus:ring-blue-500 focus:ring-2" 
		/>
		<div class="flex-1">
			<div class="font-medium text-gray-900 {ingredient.isChecked ? 'line-through opacity-60' : ''}">
				{ingredient.name}
			</div>
			{#if ingredient.quantity && ingredient.unit}
				<div class="text-sm text-gray-500 {ingredient.isChecked ? 'line-through opacity-60' : ''}">
					{ingredient.quantity} {ingredient.unit}
				</div>
			{/if}
			{#if ingredient.observations}
				<div class="text-sm text-gray-400 italic {ingredient.isChecked ? 'line-through opacity-60' : ''}">
					{ingredient.observations}
				</div>
			{/if}
		</div>
	</div>
</li>
