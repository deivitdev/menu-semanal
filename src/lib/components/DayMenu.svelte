<script lang="ts">
	import MealCard from './MealCard.svelte';
	import { DefaultDateService } from '$lib/services/DateService';
	import { defaultTheme } from '$lib/constants/MenuThemes';
	import type { DayMenu, Meal } from '$lib/types/MenuTypes';

	interface Props {
		day: string;
		breakfast: string;
		breakfastDesc: string;
		lunch: string;
		lunchDesc: string;
		dinner: string;
		dinnerDesc: string;
	}

	let { day, breakfast, breakfastDesc, lunch, lunchDesc, dinner, dinnerDesc }: Props = $props();

	// Dependency injection
	const dateService = new DefaultDateService();
	const isToday = dateService.isToday(day);

	// Convert props to Meal array
	const meals: Meal[] = [
		{ type: 'breakfast', name: breakfast, description: breakfastDesc },
		{ type: 'lunch', name: lunch, description: lunchDesc },
		{ type: 'dinner', name: dinner, description: dinnerDesc }
	];

	// Dynamic classes using theme
	const dayMenuClasses = isToday ? defaultTheme.today : defaultTheme.normal;
	const dayTitleClasses = isToday ? defaultTheme.titleToday : defaultTheme.titleNormal;
</script>

<div class={dayMenuClasses} data-today={isToday ? "true" : "false"}>
	<h3 class={dayTitleClasses}>
		{day}
		{#if isToday}
			<span class="text-sm bg-blue-600 text-white px-2 py-1 rounded-full ml-2">Hoy</span>
		{/if}
	</h3>
	<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
		{#each meals as meal}
			<MealCard 
				type={meal.type}
				meal={meal.name}
				description={meal.description}
			/>
		{/each}
	</div>
</div>
