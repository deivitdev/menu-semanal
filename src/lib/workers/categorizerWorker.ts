// Web Worker para categorización de ingredientes en background

// Tipos para el worker
interface Ingredient {
	id: number;
	name: string;
	quantity: string;
	unit: string;
	observations: string;
}

type CategorizedIngredients = {
	"Frutas y Verduras": Ingredient[];
	"Proteínas": Ingredient[];
	"Lácteos y Huevos": Ingredient[];
	"Pan y Cereales": Ingredient[];
	"Despensa": Ingredient[];
	"Otros": Ingredient[];
};

// Función de categorización optimizada
function categorizeIngredient(name: string): keyof CategorizedIngredients {
	const lowerName = name.toLowerCase();
	
	// Usar lookup table para mejor rendimiento
	const categories = {
		"Frutas y Verduras": ['fresa', 'manzana', 'plátano', 'naranja', 'lechuga', 'tomate', 'cebolla', 'pimiento', 'zanahoria', 'pepino', 'espinaca', 'brócoli', 'calabacín', 'berenjena', 'aguacate', 'fruta', 'verdura', 'banana', 'frutilla', 'uva', 'durazno', 'pera', 'mandarina', 'limón', 'pomelo', 'melón', 'sandía', 'kiwi', 'ananá', 'higo', 'palta', 'cereza', 'arándano', 'maracuyá', 'guayabo', 'guayaba', 'papa', 'patata', 'zapallo', 'calabaza', 'auyama', 'boniato', 'batata', 'camote', 'morrón', 'ají', 'choclo', 'maíz', 'elote', 'acelga', 'coliflor', 'remolacha', 'betabel', 'chaucha', 'judía', 'ejote', 'repollo', 'col', 'zapallito', 'zucchini', 'alcaucil', 'alcachofa'],
		"Proteínas": ['carne', 'pollo', 'pescado', 'atún', 'salmón', 'huevo', 'bacalao', 'proteína'],
		"Lácteos y Huevos": ['leche', 'yogur', 'queso', 'ricota', 'nata', 'mantequilla'],
		"Pan y Cereales": ['pan', 'arroz', 'pasta', 'avena', 'harina', 'fideo', 'tostada', 'granola'],
		"Despensa": ['aceite', 'salsa', 'especia', 'miel', 'café', 'té', 'lenteja', 'garbanzo', 'semilla']
	};
	
	for (const [category, keywords] of Object.entries(categories)) {
		if (keywords.some(keyword => lowerName.includes(keyword))) {
			return category as keyof CategorizedIngredients;
		}
	}
	
	return "Otros";
}

// Función para categorizar múltiples ingredientes
function categorizeIngredients(ingredients: Ingredient[]): CategorizedIngredients {
	const categorized: CategorizedIngredients = {
		"Frutas y Verduras": [],
		"Proteínas": [],
		"Lácteos y Huevos": [],
		"Pan y Cereales": [],
		"Despensa": [],
		"Otros": []
	};

	ingredients.forEach((item: Ingredient) => {
		const category = categorizeIngredient(item.name);
		categorized[category].push(item);
	});

	return categorized;
}

// Mensajes desde el hilo principal
self.onmessage = function(e: MessageEvent) {
	const { type, data } = e.data;
	
	switch (type) {
		case 'CATEGORIZE_INGREDIENTS':
			const result = categorizeIngredients(data as Ingredient[]);
			self.postMessage({
				type: 'CATEGORIZATION_COMPLETE',
				data: result
			});
			break;
		
		case 'CATEGORIZE_SINGLE':
			const category = categorizeIngredient((data as { name: string }).name);
			self.postMessage({
				type: 'SINGLE_CATEGORIZATION_COMPLETE',
				data: { id: (data as { id: number }).id, category }
			});
			break;
			
		default:
			console.error('Unknown message type:', type);
	}
};
