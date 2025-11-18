import type { CategorizedIngredients } from '$lib/types/ingredients';
import { categorizeIngredients } from '$lib/utils/ingredientCategorizer';
import { writable } from 'svelte/store';

// Create stores for reactive state
const jsonInputStore = writable('');
const showJsonInputStore = writable(false);

export function useJsonImport() {
	function toggleJsonInput() {
		console.log('toggleJsonInput in composable called');
		showJsonInputStore.update(current => {
			const newValue = !current;
			console.log('showJsonInput after toggle:', newValue);
			if (!newValue) {
				jsonInputStore.set('');
			}
			return newValue;
		});
	}

	function loadFromJson(): CategorizedIngredients | null {
		let jsonInputValue = '';
		
		// Get current value from store
		jsonInputStore.subscribe(value => { 
			jsonInputValue = value; 
			console.log('Current jsonInput value in loadFromJson:', jsonInputValue);
		})();

		try {
			if (!jsonInputValue.trim()) {
				console.error('JSON input is empty');
				return null;
			}

			const parsedIngredients = JSON.parse(jsonInputValue);
			
			if (!Array.isArray(parsedIngredients)) {
				throw new Error('El JSON debe ser un array de ingredientes');
			}

			console.log('Parsed ingredients:', parsedIngredients);

			const categorized = categorizeIngredients(parsedIngredients);
			console.log('Categorized ingredients:', categorized);
			
			// Show success message
			const message = document.createElement('div');
			message.textContent = '¡Ingredientes cargados exitosamente!';
			message.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50';
			document.body.appendChild(message);

			setTimeout(() => {
				if (document.body.contains(message)) {
					document.body.removeChild(message);
				}
			}, 3000);
			
			// Reset input
			jsonInputStore.set('');
			showJsonInputStore.set(false);
			
			return categorized;
		} catch (error) {
			console.error('Error parsing JSON:', error);
			
			// Show error message
			const message = document.createElement('div');
			message.textContent = 'Error al procesar el JSON. Verifica el formato.';
			message.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50';
			document.body.appendChild(message);

			setTimeout(() => {
				if (document.body.contains(message)) {
					document.body.removeChild(message);
				}
			}, 3000);
			
			return null;
		}
	}

	return {
		jsonInput: jsonInputStore,
		showJsonInput: showJsonInputStore,
		toggleJsonInput,
		loadFromJson
	};
}
