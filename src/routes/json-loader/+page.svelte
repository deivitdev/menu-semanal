<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import { goto } from '$app/navigation';
	import { useJsonImport } from '$lib/composables/useJsonImport';

	const { jsonInput, showJsonInput, toggleJsonInput, loadFromJson } = useJsonImport();

	let selectedOption = 'menu';
	let jsonContent = '';
	let isLoading = false;

	const jsonTemplates = {
		menu: `[
  {
    "day": "Lunes",
    "breakfast": "Yogur con avena y frutas",
    "breakfastDesc": "Yogur natural (o kéfir) con avena, semillas de chía y fruta de estación.",
    "lunch": "Lentejas Guisadas",
    "lunchDesc": "Lentejas guisadas saludables con especias, acompañadas de arroz integral.",
    "dinner": "Tarta Pascualina Light",
    "dinnerDesc": "Tarta de acelga y ricota (con masa integral) con ensalada de zanahoria rallada."
  },
  {
    "day": "Martes",
    "breakfast": "Tostada integral con ricota y tomate",
    "breakfastDesc": "Tostada de pan integral con queso magro/ricota, rodajas de tomate y orégano.",
    "lunch": "Pescado al Horno",
    "lunchDesc": "Pescado blanco (merluza) con limón y especias, acompañado de batatas asadas.",
    "dinner": "Omelette de espinaca y queso magro",
    "dinnerDesc": "Omelette de dos huevos con espinaca, morrón y queso magro, con una tostada integral."
  },
  {
    "day": "Miércoles",
    "breakfast": "Panqueques de avena y banana",
    "breakfastDesc": "Panqueques de avena y banana con una cucharada de miel.",
    "lunch": "Milanesa de Pollo al Horno",
    "lunchDesc": "Milanesa de pollo al horno (sin freír), con puré de calabaza y ensalada de hojas verdes.",
    "dinner": "Chop Suey de Vegetales",
    "dinnerDesc": "Salteado de verduras (brócoli, repollo, zanahoria, etc.) con pollo o tofu."
  },
  {
    "day": "Jueves",
    "breakfast": "Mate, fruta y huevo revuelto",
    "breakfastDesc": "Mate (con agua no muy caliente) acompañado de una fruta y un huevo revuelto.",
    "lunch": "Ensalada Completa",
    "lunchDesc": "Ensalada grande de garbanzos, tomate cherry, pepino, cebolla y atún al natural.",
    "dinner": "Sopa Crema de Zapallo",
    "dinnerDesc": "Sopa crema de zapallo con semillas y un sándwich de pan integral con queso y jamón magro."
  },
  {
    "day": "Viernes",
    "breakfast": "Yogur con avena y semillas",
    "breakfastDesc": "Yogur natural con avena, semillas de chía y fruta de estación.",
    "lunch": "Pollo a la Plancha",
    "lunchDesc": "Pollo a la plancha (o corte magro de carne) con ensalada mixta (lechuga, tomate, cebolla).",
    "dinner": "Pizza Casera Integral",
    "dinnerDesc": "Pizza casera con masa integral, salsa de tomate y muchos vegetales (morrón, champiñones) y queso magro."
  },
  {
    "day": "Sábado",
    "breakfast": "Tostada integral con ricota y tomate",
    "breakfastDesc": "Tostada de pan integral con queso magro/ricota, rodajas de tomate y orégano.",
    "lunch": "Asado Saludable",
    "lunchDesc": "Asado (cortes magros) con abundante vegetales asados (morrón, cebolla, calabacín).",
    "dinner": "Hamburguesas de Legumbres",
    "dinnerDesc": "Hamburguesas caseras de lentejas o porotos en pan integral con hojas de lechuga y tomate."
  },
  {
    "day": "Domingo",
    "breakfast": "Mate, fruta y huevo revuelto",
    "breakfastDesc": "Mate (con agua no muy caliente) acompañado de una fruta y un huevo revuelto.",
    "lunch": "Pasta Integral",
    "lunchDesc": "Pasta integral (ej: ñoquis de calabaza) con salsa de tomate casera y queso rallado.",
    "dinner": "Morrón Relleno",
    "dinnerDesc": "Morrón (pimiento) relleno con arroz integral y carne picada magra, horneado."
  }
]`,
		ingredients: `[
  {
    "name": "Tomates",
    "category": "Verduras",
    "quantity": 6,
    "unit": "unidades"
  },
  {
    "name": "Pollo",
    "category": "Carnes",
    "quantity": 500,
    "unit": "gramos"
  },
  {
    "name": "Arroz",
    "category": "Granos",
    "quantity": 1,
    "unit": "kg"
  }
]`
	};

	function handleOptionChange(option: string) {
		selectedOption = option;
		jsonContent = jsonTemplates[option as keyof typeof jsonTemplates] || '';
	}

	async function handleLoadJson() {
		if (isLoading) return;
		isLoading = true;
		jsonInput.set(jsonContent);
		try {
			const result = await loadFromJson();
			console.log('JSON load result:', result);
			alert('JSON cargado correctamente');
			if (selectedOption === 'menu') {
				goto('/');
			}
		} catch (e) {
			console.error('Error cargando JSON', e);
			alert('Hubo un error al cargar el JSON. Verifica el formato e inténtalo nuevamente.');
		} finally {
			isLoading = false;
		}
	}

	function handleBack() {
		goto('/');
	}

	// Initialize with menu template
	jsonContent = jsonTemplates.menu;
</script>

<Navbar />
<main class="pt-16 min-h-screen bg-gray-50">
	<div class="container mx-auto px-4 py-8">
		<div class="max-w-4xl mx-auto">
			<!-- Header -->
			<div class="mb-8">
				<button
					onclick={handleBack}
					class="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
					</svg>
					Volver
				</button>
				<h1 class="text-3xl font-bold text-gray-800 mb-2">Cargar JSON</h1>
				<p class="text-gray-600">Selecciona el tipo de JSON que quieres cargar y pega el contenido</p>
			</div>

			<!-- Options -->
			<div class="bg-white rounded-lg shadow-md p-6 mb-6">
				<h2 class="text-xl font-semibold mb-4">Tipo de contenido</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<button
						class={`p-4 rounded-lg border-2 transition-all ${
							selectedOption === 'menu'
								? 'border-blue-500 bg-blue-50 text-blue-700'
								: 'border-gray-200 hover:border-gray-300'
						}`}
						onclick={() => handleOptionChange('menu')}
						disabled={isLoading}
					>
						<div class="flex flex-col items-center gap-2">
							<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
							</svg>
							<span class="font-medium">Menú Semanal</span>
							<span class="text-sm text-gray-500">Carga el menú de la semana</span>
						</div>
					</button>

					<button
						class={`p-4 rounded-lg border-2 transition-all ${
							selectedOption === 'ingredients'
								? 'border-blue-500 bg-blue-50 text-blue-700'
								: 'border-gray-200 hover:border-gray-300'
						}`}
						onclick={() => handleOptionChange('ingredients')}
						disabled={isLoading}
					>
						<div class="flex flex-col items-center gap-2">
							<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
							</svg>
							<span class="font-medium">Lista de Ingredientes</span>
							<span class="text-sm text-gray-500">Carga la lista de compras</span>
						</div>
					</button>
				</div>
			</div>

			<!-- JSON Editor -->
			<div class="bg-white rounded-lg shadow-md p-6">
				<h2 class="text-xl font-semibold mb-4">Contenido JSON</h2>
				<textarea
					bind:value={jsonContent}
					class="w-full h-96 p-4 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
					placeholder="Pega aquí tu contenido JSON..."
					disabled={isLoading}
				></textarea>

				<div class="flex gap-4 mt-6">
					<button
						onclick={handleLoadJson}
						class="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
						disabled={isLoading}
					>
						{#if isLoading}
							<svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
							</svg>
							Cargando...
						{:else}
							Cargar JSON
						{/if}
					</button>
					<button
						onclick={() => (jsonContent = jsonTemplates[selectedOption as keyof typeof jsonTemplates] || '')}
						class="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-60 disabled:cursor-not-allowed"
						disabled={isLoading}
					>
						Restablecer
					</button>
				</div>
			</div>
		</div>
	</div>
</main>
