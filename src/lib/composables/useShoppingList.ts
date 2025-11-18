import type { CategorizedIngredients, Ingredient } from '$lib/types/ingredients';
import { writable } from 'svelte/store';
import { categorizeIngredients } from '$lib/utils/ingredientCategorizer';

export function useShoppingList() {
	const ingredientsStore = writable<CategorizedIngredients | null>(null);
	const listClearedStore = writable(false);
	const loadingStore = writable(true);
	const errorStore = writable<string | null>(null);

	// Cargar desde la API
	async function loadFromAPI() {
		console.log('loadFromAPI: Iniciando carga desde API...');
		loadingStore.set(true);
		errorStore.set(null);
		
		try {
			console.log('loadFromAPI: Haciendo fetch a /api/shopping-list');
			const response = await fetch('/api/shopping-list');
			if (!response.ok) {
				throw new Error('Error loading shopping list');
			}
			
			const data = await response.json() as { ingredients: Ingredient[] };
			const ingredients = data.ingredients || [];
			console.log('loadFromAPI: Ingredientes recibidos:', ingredients.length);
			
			// Convertir a formato categorizado usando la función de categorización
			console.log('loadFromAPI: Primeros 5 ingredientes:', ingredients.slice(0, 5));
			const categorized = categorizeIngredients(ingredients);
			console.log('loadFromAPI: Ingredientes categorizados:', categorized);
			console.log('loadFromAPI: Cantidad de ingredientes por categoría:', 
				Object.entries(categorized).map(([cat, items]) => `${cat}: ${items.length}`));
			
			ingredientsStore.set(categorized);
			listClearedStore.set(ingredients.length === 0);
		} catch (error) {
			console.error('Error loading from API:', error);
			errorStore.set('Error al cargar la lista de compras');
		} finally {
			loadingStore.set(false);
		}
	}

	// Guardar en la API
	async function saveToAPI(ingredients: CategorizedIngredients) {
		loadingStore.set(true);
		errorStore.set(null);
		
		try {
			// Aplanar ingredientes
			const flatIngredients: Ingredient[] = [];
			Object.values(ingredients).forEach(categoryIngredients => {
				flatIngredients.push(...categoryIngredients);
			});
			
			const response = await fetch('/api/shopping-list', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ ingredients: flatIngredients })
			});
			
			if (!response.ok) {
				throw new Error('Error saving shopping list');
			}
			
			ingredientsStore.set(ingredients);
			listClearedStore.set(false);
		} catch (error) {
			console.error('Error saving to API:', error);
			errorStore.set('Error al guardar la lista de compras');
		} finally {
			loadingStore.set(false);
		}
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

	async function clearShoppingList() {
		const emptyIngredients: CategorizedIngredients = {
			"Frutas y Verduras": [],
			"Proteínas": [],
			"Lácteos y Huevos": [],
			"Pan y Cereales": [],
			"Despensa": [],
			"Otros": []
		};
		
		await saveToAPI(emptyIngredients);
	}

	async function updateIngredients(newIngredients: CategorizedIngredients) {
		await saveToAPI(newIngredients);
	}

	// Cargar datos al inicializar
	loadFromAPI().catch(err => console.error('Error inicializando useShoppingList:', err));

	return {
		ingredients: ingredientsStore,
		listCleared: listClearedStore,
		loading: loadingStore,
		error: errorStore,
		markAll,
		unmarkAll,
		printList,
		clearShoppingList,
		updateIngredients,
		loadFromAPI,
		saveToAPI
	};
}
