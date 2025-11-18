<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import DayMenu from '$lib/components/DayMenu.svelte';
	import { onMount } from 'svelte';

	onMount(() => {
		// Buscar el elemento del día actual (con el badge "Hoy")
		const todayElement = document.querySelector('[data-today="true"]');

		if (todayElement) {
			// Hacer scroll suave al elemento
			todayElement.scrollIntoView({
				behavior: 'smooth',
				block: 'center'
			});
		}
	});
</script>

<Navbar />
<main class="pt-16">
	<div class="container mx-auto px-4">
		<DayMenu 
			day="Lunes"
			breakfast="Avena con fresones"
			breakfastDesc="Con miel y frutos secos"
			lunch="Ensalada de pollo a la parrilla"
			lunchDesc="Verdes frescos con hierbas y aderezo de limón"
			dinner="Salmón con verduras"
			dinnerDesc="Salmón asado con espárragos"
		/>

		<DayMenu 
			day="Martes"
			breakfast="Huevos revueltos con tostadas"
			breakfastDesc="Con aguacate y café"
			lunch="Pasta Primavera"
			lunchDesc="Verduras de temporada con aceite de oliva y ajo"
			dinner="Salteado de ternera"
			dinnerDesc="Con arroz y verduras mixtas"
		/>

		<DayMenu 
			day="Miércoles"
			breakfast="Parfait de yogur"
			breakfastDesc="Con granola y fruta"
			lunch="Tacos de ternera"
			lunchDesc="Carne molida sazonada con toppings frescos"
			dinner="Sopa de pollo"
			dinnerDesc="Con verduras y pan"
		/>

		<DayMenu 
			day="Jueves"
			breakfast="Bowl de batido"
			breakfastDesc="Frutas tropicales y semillas"
			lunch="Salteado de verduras"
			lunchDesc="Verduras mixtas con salsa de soja y jengibre"
			dinner="Chuletas de cerdo"
			dinnerDesc="Con puré de patatas y salsa"
		/>

		<DayMenu 
			day="Viernes"
			breakfast="Pancakes"
			breakfastDesc="Con sirope de arce y bacon"
			lunch="Pizza casera"
			lunchDesc="Masa fresca con mozzarella y toppings"
			dinner="Pescado y patatas fritas"
			dinnerDesc="Bacalao crujiente con patatas fritas"
		/>

		<DayMenu 
			day="Fin de semana"
			breakfast="Tostadas francesas"
			breakfastDesc="Con bayas y nata montada"
			lunch="Hamburguesas BBQ"
			lunchDesc="Con patatas fritas y ensalada colslaw"
			dinner="Cena especial"
			dinnerDesc="Algo delicioso y especial"
		/>
	</div>

	<!-- TODO: Add footer -->
</main>
