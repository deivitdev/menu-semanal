import type { CategorizedIngredients, Ingredient } from '$lib/types/ingredients';
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

	async function loadFromJson(): Promise<CategorizedIngredients | null> {
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

                        const parsedData = JSON.parse(jsonInputValue);

                        // Check if it's a weekly menu format
                        if (Array.isArray(parsedData) && parsedData.length > 0 && parsedData[0].day) {
                                console.log('Detected weekly menu format');
                                return await loadWeeklyMenu(parsedData);
                        }
                        // Check if it's an ingredients array
                        else if (Array.isArray(parsedData)) {
                                console.log('Detected ingredients array format');
                                return await loadIngredients(parsedData);
                        }
                        // Check if it's a weeklyMenu object format
                        else if (parsedData.weeklyMenu && typeof parsedData.weeklyMenu === 'object') {
                                console.log('Detected weeklyMenu object format');
                                const menuArray = Object.entries(parsedData.weeklyMenu).map(([day, meals]: [string, any]) => ({
                                        day,
                                        ...meals
                                }));
                                return await loadWeeklyMenu(menuArray);
                        }
                        else {
                                throw new Error('Formato JSON no reconocido. Debe ser un array de ingredientes o un menú semanal.');
                        }
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

        async function saveWeeklyMenuToAPI(menuData: any[]) {
                try {
                        const response = await fetch('/api/weekly-menu', {
                                method: 'POST',
                                headers: {
                                        'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(menuData)
                        });

                        if (!response.ok) {
                                throw new Error('Error saving weekly menu');
                        }

                        console.log('Weekly menu saved to API successfully');
                } catch (error) {
                        console.error('Error saving weekly menu to API:', error);
                        throw error;
                }
        }

        async function saveToAPI(ingredients: CategorizedIngredients) {
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

                        console.log('Ingredients saved to API successfully');
                } catch (error) {
                        console.error('Error saving to API:', error);
                        throw error;
                }
        }

        async function loadWeeklyMenu(menuData: any[]): Promise<CategorizedIngredients | null> {
                try {
                        // Save the weekly menu to API first
                        await saveWeeklyMenuToAPI(menuData);

                        const ingredients: Ingredient[] = [];
                        let id = 1;

                        menuData.forEach(dayData => {
                                const meals = ['breakfast', 'lunch', 'dinner'];
                                meals.forEach(meal => {
                                        const mealText = dayData[meal];
                                        if (mealText) {
                                                // Extract ingredients from meal descriptions
                                                const extractedIngredients = extractIngredientsFromMeal(mealText, mealText.replace(/^[^:]+:\s*/, ''));
                                                extractedIngredients.forEach(ing => {
                                                        ingredients.push({
                                                                id: id++,
                                                                name: ing,
                                                                quantity: '',
                                                                unit: '',
                                                                observations: `Para ${dayData.day} - ${meal === 'breakfast' ? 'desayuno' : meal === 'lunch' ? 'almuerzo' : 'cena'}`
                                                        });
                                                });
                                        }
                                });
                        });

                        console.log('Extracted ingredients from menu:', ingredients);

                        const categorized = categorizeIngredients(ingredients);
                        console.log('Categorized ingredients:', categorized);

                        // Save ingredients to shopping list API
                        await saveToAPI(categorized);

                        // Show success message
                        const message = document.createElement('div');
                        message.textContent = '¡Menú semanal cargado exitosamente!';
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
                        console.error('Error loading weekly menu:', error);

                        // Show error message
                        const message = document.createElement('div');
                        message.textContent = 'Error al cargar el menú semanal.';
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

        async function loadIngredients(ingredientsData: any[]): Promise<CategorizedIngredients | null> {
                try {
                        // Validate and format ingredients
                        const ingredients: Ingredient[] = ingredientsData.map((item, index) => ({
                                id: index + 1,
                                name: item.name || `Ingrediente ${index + 1}`,
                                quantity: item.quantity || '',
                                unit: item.unit || '',
                                observations: item.observations || '',
                                category: item.category
                        }));

                        console.log('Parsed ingredients:', ingredients);

                        const categorized = categorizeIngredients(ingredients);
                        console.log('Categorized ingredients:', categorized);

                        // Save ingredients to shopping list API
                        await saveToAPI(categorized);

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
                        console.error('Error processing ingredients:', error);

                        // Show error message
                        const message = document.createElement('div');
                        message.textContent = 'Error al procesar los ingredientes.';
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

        function extractIngredientsFromMeal(mealTitle: string, mealDescription: string): string[] {
                const ingredients: string[] = [];
                
                // Common ingredient patterns
                const patterns = [
                        /(?:con|de)\s+([a-zA-Záéíóúñ\s]+?)(?:,|\.|y|$)/gi,
                        /([a-zA-Záéíóúñ]+)(?:\s+[a-zA-Záéíóúñ]+)*(?=\s+[a-z]+|,|\.|$)/gi,
                        /(pollo|carne|pescado|salmón|atún|bacalao|huevo|arroz|pasta|avena|pan|tostada|queso|yogur|leche|tomate|cebolla|pimiento|zanahoria|lechuga|espinaca|brócoli|calabaza|batata|papa|lenteja|garbanzo|frijol|maíz|choclo|berenjena|calabacín|zapallito|acelga|repollo|coliflor|remolacha|chaucha|judía|ejote|fruta|manzana|banana|plátano|naranja|limón|fresa|arándano|uva|pera|durazno|melón|sandía|kiwi|aguacate|palta|semilla|nuez|almendra|aceite|mantequilla|crema|ricota|mozzarella)/gi
                ];

                // Extract from title
                patterns.forEach(pattern => {
                        const matches = mealTitle.match(pattern);
                        if (matches) {
                                matches.forEach(match => {
                                        const cleaned = match.replace(/^(?:con|de)\s+/i, '').trim();
                                        if (cleaned.length > 2 && !ingredients.includes(cleaned)) {
                                                ingredients.push(cleaned);
                                        }
                                });
                        }
                });

                // Extract from description
                patterns.forEach(pattern => {
                        const matches = mealDescription.match(pattern);
                        if (matches) {
                                matches.forEach(match => {
                                        const cleaned = match.replace(/^(?:con|de)\s+/i, '').trim();
                                        if (cleaned.length > 2 && !ingredients.includes(cleaned)) {
                                                ingredients.push(cleaned);
                                        }
                                });
                        }
                });

                // If no ingredients found, use the meal title as a general ingredient
                if (ingredients.length === 0) {
                        ingredients.push(mealTitle.trim());
                }

                return ingredients;
        }

	return {
		jsonInput: jsonInputStore,
		showJsonInput: showJsonInputStore,
		toggleJsonInput,
		loadFromJson
	};
}
