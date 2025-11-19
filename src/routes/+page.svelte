<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import DayMenu from '$lib/components/DayMenu.svelte';
	import AddFab from '$lib/components/AddFab.svelte';
	import { onMount, tick } from 'svelte';

	interface DayMenuItem {
		day: string;
		breakfast: string;
		breakfastDesc: string;
		lunch: string;
		lunchDesc: string;
		dinner: string;
		dinnerDesc: string;
	}

	// Reactive state for menu data
	let weeklyMenu: DayMenuItem[] = [];
	let loading = true;
	let error: string | null = null;
	let hasScrolledToToday = false;

	// Load menu data from API
	async function loadWeeklyMenu() {
		try {
			loading = true;
			error = null;
			const response = await fetch('/api/weekly-menu');
			if (!response.ok) {
				throw new Error('Error loading weekly menu');
			}
			const data: DayMenuItem[] = await response.json();
			weeklyMenu = data;
		} catch (err) {
			console.error('Error loading weekly menu:', err);
			error = 'Error al cargar el menú semanal';
		} finally {
			loading = false;
		}
	}

	// Load menu data on mount
	onMount(() => {
		loadWeeklyMenu();
	});

	// Reload menu when page becomes visible (e.g., after returning from json-loader)
	onMount(() => {
		const handleVisibilityChange = () => {
			if (document.visibilityState === 'visible') {
				loadWeeklyMenu();
				hasScrolledToToday = false;
			}
		};

		document.addEventListener('visibilitychange', handleVisibilityChange);
		
		return () => {
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		};
	});

	async function scrollToToday() {
		if (hasScrolledToToday || loading || weeklyMenu.length === 0) return;
		// Esperar a que el DOM termine de renderizar las cards
		await tick();
		const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
		const currentDay = days[new Date().getDay()];
		const element = document.getElementById(currentDay);
		if (element) {
			const navbarOffset = 72; // altura aprox. de la navbar (4rem)
			const rect = element.getBoundingClientRect();
			const targetY = rect.top + window.scrollY - navbarOffset;
			window.scrollTo({ top: targetY, behavior: 'smooth' });
			hasScrolledToToday = true;
		}
	}

	// After data load, ensure today's day is brought into view once
	$: {
		if (!loading && weeklyMenu.length > 0) {
			scrollToToday();
		}
	}

	function handleAddIngredient(event: CustomEvent<{ ingredient: string }>) {
		// Navigate to shopping list page
		window.location.href = '/shopping-list';
	}
</script>

<Navbar />
<main class="pt-16">
	<div class="container mx-auto px-4">
		{#if loading}
			<div class="flex justify-center items-center min-h-[400px]">
				<div class="animate-spin rounded-full h-12 w-12 border-b-2 loader-ring"></div>
			</div>
		{:else if error}
			<div class="flex justify-center items-center min-h-[400px]">
				<div class="text-red-600 text-center">
					<p class="text-lg font-semibold">Error</p>
					<p>{error}</p>
				</div>
			</div>
		{:else if weeklyMenu.length === 0}
			<div class="flex justify-center items-center min-h-[400px]">
				<div class="text-gray-600 text-center">
					<p class="text-lg">No hay menú disponible</p>
				</div>
			</div>
		{:else}
			{#each weeklyMenu as dayMenu (dayMenu.day)}
				<div id={dayMenu.day}>
					<DayMenu 
						day={dayMenu.day}
						breakfast={dayMenu.breakfast}
						breakfastDesc={dayMenu.breakfastDesc}
						lunch={dayMenu.lunch}
						lunchDesc={dayMenu.lunchDesc}
						dinner={dayMenu.dinner}
						dinnerDesc={dayMenu.dinnerDesc}
					/>
				</div>
			{/each}
		{/if}
	</div>

	<!-- TODO: Add footer -->
</main>

<!-- FAB Component -->
<AddFab 
	on:addIngredient={handleAddIngredient}
/>
