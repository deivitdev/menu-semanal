<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import { theme } from '$lib/stores/theme';
	import { PawPrint } from 'lucide-svelte';
</script>

<Navbar />
<main class="pt-16 min-h-screen bg-gray-50">
	<div class="container mx-auto px-4 py-8">
		<div class="max-w-4xl mx-auto space-y-8">
			<section class="bg-white rounded-lg shadow p-6">
				<h1 class="text-2xl font-bold mb-4">
					FAQ • Modelos de Datos
					{#if $theme === 'cats'} <span class="ml-2">🐱📚</span>{/if}
				</h1>
				<p class="text-gray-600">
					Guía rápida de las estructuras usadas para el menú semanal y los ingredientes
					{#if $theme === 'cats'} (aprobadas por gatitos exigentes 🐾){/if}.
				</p>
			</section>

			<section class="bg-white rounded-lg shadow p-6">
				<h2 class="text-xl font-semibold mb-3 flex items-center gap-2">
					<span>Modelo de Ingrediente</span>
					{#if $theme === 'cats'}
						<span class="inline-flex items-center text-pink-500">
							<PawPrint size={18} />
						</span>
					{/if}
				</h2>
				<p class="text-gray-600 mb-4">Estructura base que representa un ingrediente individual de la lista de compras:</p>
				<pre class="bg-gray-900 text-gray-100 p-4 rounded overflow-auto text-sm"><code>{`export interface Ingredient {
  id: number;
  name: string;
  quantity: string;
  unit: string;
  observations?: string;
  category?: string;
}`}</code></pre>

				<h3 class="text-lg font-medium mt-6 mb-2">Ingredientes categorizados</h3>
				<p class="text-gray-600 mb-4">Mapa de categorías a arreglos de ingredientes:</p>
				<pre class="bg-gray-900 text-gray-100 p-4 rounded overflow-auto text-sm"><code>{`export interface CategorizedIngredients {
  "Frutas y Verduras": Ingredient[];
  "Proteínas": Ingredient[];
  "Lácteos y Huevos": Ingredient[];
  "Pan y Cereales": Ingredient[];
  "Despensa": Ingredient[];
  "Otros": Ingredient[];
}`}</code></pre>
			</section>

			<section class="bg-white rounded-lg shadow p-6">
				<h2 class="text-xl font-semibold mb-3">Modelos de Menú</h2>
				<p class="text-gray-600 mb-4">La aplicación soporta dos representaciones complementarias del menú semanal:</p>

				<h3 class="text-lg font-medium mt-4 mb-2">1) Menú por comidas</h3>
				<p class="text-gray-600 mb-3">Estructuras tipadas para trabajar con un día y sus comidas (desayuno, almuerzo, cena):</p>
				<pre class="bg-gray-900 text-gray-100 p-4 rounded overflow-auto text-sm"><code>{`export interface Meal {
  type: 'breakfast' | 'lunch' | 'dinner';
  name: string;
  description: string;
}

export interface DayMenu {
  day: string;
  meals: Meal[];
}`}</code></pre>

				<h3 class="text-lg font-medium mt-6 mb-2">2) Menú simplificado (API)</h3>
				<p class="text-gray-600 mb-3">Estructura usada por la API de <code>/api/weekly-menu</code> para intercambiar datos de forma simple:</p>
				<pre class="bg-gray-900 text-gray-100 p-4 rounded overflow-auto text-sm"><code>{`type WeeklyMenuItem = {
  day: string;
  breakfast: string;
  breakfastDesc: string;
  lunch: string;
  lunchDesc: string;
  dinner: string;
  dinnerDesc: string;
};

type WeeklyMenu = WeeklyMenuItem[];`}</code></pre>

				<div class="mt-6 p-4 rounded bg-blue-50 text-blue-800 text-sm">
					<p><strong>Nota:</strong> Puedes convertir entre ambos modelos según la necesidad de visualización o almacenamiento.</p>
				</div>
			</section>

			<section class="bg-white rounded-lg shadow p-6">
				<h2 class="text-xl font-semibold mb-3">Preguntas Frecuentes</h2>
				<details class="mb-3">
					<summary class="cursor-pointer font-medium">¿Dónde edito las categorías de ingredientes?</summary>
					<p class="mt-2 text-gray-600">En el código que procesa/visualiza ingredientes. El tipo <code>CategorizedIngredients</code> muestra las claves esperadas.</p>
				</details>
				<details class="mb-3">
					<summary class="cursor-pointer font-medium">¿Qué días acepta el campo <code>day</code>?</summary>
					<p class="mt-2 text-gray-600">Se usan nombres de días en español (Lunes... Domingo). La UI determina el día actual para resaltar/posicionarse.</p>
				</details>
				<details>
					<summary class="cursor-pointer font-medium">¿Cómo cargo un menú nuevo?</summary>
					<p class="mt-2 text-gray-600">Usa la página “Cargar JSON” y pega un arreglo de <code>WeeklyMenuItem</code>. Al confirmar, si cargas el menú, volverás al inicio.</p>
				</details>
			</section>
		</div>
	</div>
</main>
