<script lang="ts">
	import type { Ingredient } from '$lib/types/ingredients';

	interface Props {
		ingredient: Ingredient;
	}

	let { ingredient }: Props = $props();
</script>

<li class="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
	<div class="flex items-center flex-1">
		<div class="flex-1">
			<div class="font-medium text-gray-900">
				{ingredient.name}
			</div>
			{#if ingredient.quantity && ingredient.unit}
				<div class="text-sm text-gray-500">
					{ingredient.quantity} {ingredient.unit}
				</div>
			{/if}
			{#if ingredient.observations}
				<div class="text-sm text-gray-400 italic">
					{ingredient.observations}
				</div>
			{/if}
		</div>
	</div>
</li>
