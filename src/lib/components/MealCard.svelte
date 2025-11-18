<script lang="ts">
	interface Props {
		type: 'breakfast' | 'lunch' | 'dinner';
		meal: string;
		description: string;
	}

	let { type, meal, description }: Props = $props();

	const typeColors = {
		breakfast: 'text-orange-500',
		lunch: 'text-green-500',
		dinner: 'text-purple-500'
	};

	const typeLabels = {
		breakfast: 'Desayuno',
		lunch: 'Almuerzo',
		dinner: 'Cena'
	};
</script>

<div class="meal-card">
	<h4 class={`font-semibold text-lg mb-2 ${typeColors[type]}`}>
		{typeLabels[type]}
	</h4>
	<p class="text-gray-700">{meal}</p>
	<p class="text-sm text-gray-500">{description}</p>
</div>
