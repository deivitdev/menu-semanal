import type { Ingredient, CategorizedIngredients } from '$lib/types/ingredients';

export function categorizeIngredient(name: string): keyof CategorizedIngredients {
	const lowerName = name.toLowerCase();
	
	if (lowerName.includes('fresa') || lowerName.includes('manzana') || lowerName.includes('plátano') || 
		lowerName.includes('naranja') || lowerName.includes('lechuga') || lowerName.includes('tomate') || 
		lowerName.includes('cebolla') || lowerName.includes('pimiento') || lowerName.includes('zanahoria') || 
		lowerName.includes('pepino') || lowerName.includes('espinaca') || lowerName.includes('brócoli') || 
		lowerName.includes('calabacín') || lowerName.includes('berenjena') || lowerName.includes('aguacate') || 
		lowerName.includes('fruta') || lowerName.includes('verdura') || lowerName.includes('banana') ||
		lowerName.includes('frutilla') || lowerName.includes('uva') || lowerName.includes('durazno') ||
		lowerName.includes('pera') || lowerName.includes('mandarina') || lowerName.includes('limón') ||
		lowerName.includes('pomelo') || lowerName.includes('melón') || lowerName.includes('sandía') ||
		lowerName.includes('kiwi') || lowerName.includes('ananá') || lowerName.includes('higo') ||
		lowerName.includes('palta') || lowerName.includes('cereza') || lowerName.includes('arándano') ||
		lowerName.includes('maracuyá') || lowerName.includes('guayabo') || lowerName.includes('guayaba') ||
		lowerName.includes('papa') || lowerName.includes('patata') || lowerName.includes('zapallo') ||
		lowerName.includes('calabaza') || lowerName.includes('auyama') || lowerName.includes('boniato') ||
		lowerName.includes('batata') || lowerName.includes('camote') || lowerName.includes('morrón') ||
		lowerName.includes('ají') || lowerName.includes('choclo') || lowerName.includes('maíz') ||
		lowerName.includes('elote') || lowerName.includes('acelga') || lowerName.includes('coliflor') ||
		lowerName.includes('remolacha') || lowerName.includes('betabel') || lowerName.includes('chaucha') ||
		lowerName.includes('judía') || lowerName.includes('ejote') || lowerName.includes('repollo') ||
		lowerName.includes('col') || lowerName.includes('zapallito') || lowerName.includes('zucchini') ||
		lowerName.includes('alcaucil') || lowerName.includes('alcachofa')) {
		return "Frutas y Verduras";
	} else if (lowerName.includes('carne') || lowerName.includes('pollo') || lowerName.includes('pescado') || 
		lowerName.includes('atún') || lowerName.includes('salmón') || lowerName.includes('huevo') ||
		lowerName.includes('bacalao') || lowerName.includes('proteína')) {
		return "Proteínas";
	} else if (lowerName.includes('leche') || lowerName.includes('yogur') || lowerName.includes('queso') ||
		lowerName.includes('ricota') || lowerName.includes('nata') || lowerName.includes('mantequilla')) {
		return "Lácteos y Huevos";
	} else if (lowerName.includes('pan') || lowerName.includes('arroz') || lowerName.includes('pasta') ||
		lowerName.includes('avena') || lowerName.includes('harina') || lowerName.includes('fideo') ||
		lowerName.includes('tostada') || lowerName.includes('granola')) {
		return "Pan y Cereales";
	} else if (lowerName.includes('aceite') || lowerName.includes('salsa') || lowerName.includes('especia') ||
		lowerName.includes('miel') || lowerName.includes('café') || lowerName.includes('té') ||
		lowerName.includes('lenteja') || lowerName.includes('garbanzo') || lowerName.includes('semilla')) {
		return "Despensa";
	} else {
		return "Otros";
	}
}

export function formatIngredient(item: Ingredient): string {
	let formattedItem = item.name;
	if (item.quantity && item.unit) {
		formattedItem += ` (${item.quantity} ${item.unit})`;
	}
	if (item.observations) {
		formattedItem += ` - ${item.observations}`;
	}
	return formattedItem;
}

export function categorizeIngredients(ingredients: Ingredient[]): CategorizedIngredients {
	const categorized: CategorizedIngredients = {
		"Frutas y Verduras": [],
		"Proteínas": [],
		"Lácteos y Huevos": [],
		"Pan y Cereales": [],
		"Despensa": [],
		"Otros": []
	};

	ingredients.forEach(item => {
		const category = categorizeIngredient(item.name);
		categorized[category].push(item);
	});

	return categorized;
}
