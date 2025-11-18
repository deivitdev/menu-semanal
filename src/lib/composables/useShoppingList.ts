import type { Ingredient, CategorizedIngredients } from '$lib/types/ingredients';
import { categorizeIngredients } from '$lib/utils/ingredientCategorizer';
import { writable } from 'svelte/store';

// Tipo para la respuesta de la API
interface ApiIngredient {
	id: string | number;
	name: string;
	quantity: string;
	unit: string;
	observations?: string;
	is_checked: number | boolean;
	category?: string;
}

interface ApiResponse {
	ingredients: ApiIngredient[];
}

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
			
			const data = await response.json() as ApiResponse;
			const apiIngredients = data.ingredients || [];
			console.log('loadFromAPI: Ingredientes recibidos:', apiIngredients.length);
			
			// Transformar los datos de la API al formato correcto
			const ingredients: Ingredient[] = apiIngredients.map(item => ({
				id: parseInt(item.id.toString()),
				name: item.name,
				quantity: item.quantity,
				unit: item.unit,
				observations: item.observations || '',
				isChecked: Boolean(item.is_checked)
			}));
			
			// Convertir a formato categorizado usando la función de categorización
			console.log('loadFromAPI: Primeros 5 ingredientes transformados:', ingredients.slice(0, 5));
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

	async function addIngredient(newIngredient: Ingredient) {
		console.log('addIngredient: Agregando ingrediente:', newIngredient);
		
		try {
			// Agregar a la base de datos via API
			const response = await fetch('/api/shopping-list', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ ingredient: newIngredient })
			});
			
			if (!response.ok) {
				throw new Error('Error adding ingredient');
			}
			
			// Recargar la lista desde la API para obtener los datos actualizados
			await loadFromAPI();
		} catch (error) {
			console.error('Error adding ingredient:', error);
			errorStore.set('Error al agregar el ingrediente');
		}
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
		addIngredient,
		loadFromAPI,
		saveToAPI
	};
}
