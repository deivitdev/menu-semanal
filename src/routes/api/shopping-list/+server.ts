import type { RequestHandler } from './$types';

// Función de categorización optimizada para backend
function categorizeIngredient(name: string): string {
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
			return category;
		}
	}
	
	return "Otros";
}

// Headers optimizados para compresión y caché
const optimizedHeaders = {
	'Content-Type': 'application/json',
	'Cache-Control': 'public, max-age=30', // Caché de 30 segundos
	'Vary': 'Accept-Encoding'
};

export const GET: RequestHandler = async ({ platform }) => {
	const env = platform?.env as { DB: D1Database };
	
	if (!env?.DB) {
		return new Response('Database not available', { status: 500 });
	}

	try {
		// Obtener la lista de compras principal
		const listResult = await env.DB.prepare(
			'SELECT * FROM shopping_lists WHERE id = ?'
		).bind('default').first();

		if (!listResult) {
			// Crear lista por defecto si no existe
			await env.DB.prepare(
				'INSERT INTO shopping_lists (id, name) VALUES (?, ?)'
			).bind('default', 'Lista de Compras Principal').run();
		}

		// Obtener ingredientes y categorizarlos en el backend (consulta optimizada)
		const ingredientsResult = await env.DB.prepare(`
			SELECT * FROM ingredients 
			WHERE shopping_list_id = ? 
			ORDER BY 
				CASE 
					WHEN name LIKE '%fresa%' OR name LIKE '%manzana%' OR name LIKE '%plátano%' OR name LIKE '%naranja%' OR name LIKE '%lechuga%' OR name LIKE '%tomate%' OR name LIKE '%cebolla%' OR name LIKE '%pimiento%' OR name LIKE '%zanahoria%' OR name LIKE '%pepino%' OR name LIKE '%espinaca%' OR name LIKE '%brócoli%' OR name LIKE '%calabacín%' OR name LIKE '%berenjena%' OR name LIKE '%aguacate%' OR name LIKE '%fruta%' OR name LIKE '%verdura%' OR name LIKE '%banana%' OR name LIKE '%frutilla%' OR name LIKE '%uva%' OR name LIKE '%durazno%' OR name LIKE '%pera%' OR name LIKE '%mandarina%' OR name LIKE '%limón%' OR name LIKE '%pomelo%' OR name LIKE '%melón%' OR name LIKE '%sandía%' OR name LIKE '%kiwi%' OR name LIKE '%ananá%' OR name LIKE '%higo%' OR name LIKE '%palta%' OR name LIKE '%cereza%' OR name LIKE '%arándano%' OR name LIKE '%maracuyá%' OR name LIKE '%guayabo%' OR name LIKE '%guayaba%' OR name LIKE '%papa%' OR name LIKE '%patata%' OR name LIKE '%zapallo%' OR name LIKE '%calabaza%' OR name LIKE '%auyama%' OR name LIKE '%boniato%' OR name LIKE '%batata%' OR name LIKE '%camote%' OR name LIKE '%morrón%' OR name LIKE '%ají%' OR name LIKE '%choclo%' OR name LIKE '%maíz%' OR name LIKE '%elote%' OR name LIKE '%acelga%' OR name LIKE '%coliflor%' OR name LIKE '%remolacha%' OR name LIKE '%betabel%' OR name LIKE '%chaucha%' OR name LIKE '%judía%' OR name LIKE '%ejote%' OR name LIKE '%repollo%' OR name LIKE '%col%' OR name LIKE '%zapallito%' OR name LIKE '%zucchini%' OR name LIKE '%alcaucil%' OR name LIKE '%alcachofa%'
					THEN 1
					WHEN name LIKE '%carne%' OR name LIKE '%pollo%' OR name LIKE '%pescado%' OR name LIKE '%atún%' OR name LIKE '%salmón%' OR name LIKE '%huevo%' OR name LIKE '%bacalao%' OR name LIKE '%proteína%'
					THEN 2
					WHEN name LIKE '%leche%' OR name LIKE '%yogur%' OR name LIKE '%queso%' OR name LIKE '%ricota%' OR name LIKE '%nata%' OR name LIKE '%mantequilla%'
					THEN 3
					WHEN name LIKE '%pan%' OR name LIKE '%arroz%' OR name LIKE '%pasta%' OR name LIKE '%avena%' OR name LIKE '%harina%' OR name LIKE '%fideo%' OR name LIKE '%tostada%' OR name LIKE '%granola%'
					THEN 4
					WHEN name LIKE '%aceite%' OR name LIKE '%salsa%' OR name LIKE '%especia%' OR name LIKE '%miel%' OR name LIKE '%café%' OR name LIKE '%té%' OR name LIKE '%lenteja%' OR name LIKE '%garbanzo%' OR name LIKE '%semilla%'
					THEN 5
					ELSE 6
				END,
				name ASC
		`).bind('default').all();

		// Pre-categorizar ingredientes para optimizar frontend
		const categorizedIngredients: Record<string, any[]> = {
			"Frutas y Verduras": [],
			"Proteínas": [],
			"Lácteos y Huevos": [],
			"Pan y Cereales": [],
			"Despensa": [],
			"Otros": []
		};

		// Transform ingredients to remove is_checked field
		const transformedIngredients = (ingredientsResult.results || []).map((ingredient: any) => {
			const { is_checked, ...rest } = ingredient;
			return rest;
		});

		(ingredientsResult.results || []).forEach((ingredient: any) => {
			const category = categorizeIngredient(ingredient.name || '');
			const { is_checked, ...ingredientData } = ingredient;
			categorizedIngredients[category].push(ingredientData);
		});

		return new Response(JSON.stringify({
			shoppingList: listResult,
			ingredients: transformedIngredients,
			categorized: categorizedIngredients
		}), {
			headers: optimizedHeaders
		});
	} catch (error) {
		console.error('Error fetching shopping list:', error);
		return new Response('Internal server error', { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request, platform }) => {
	const env = platform?.env as { DB: D1Database };
	
	if (!env?.DB) {
		return new Response('Database not available', { status: 500 });
	}

	try {
		const body = await request.json();
		
		// Caso 1: Agregar un solo ingrediente
		if (body && typeof body === 'object' && 'ingredient' in body && !('ingredients' in body)) {
			const { ingredient } = body as { ingredient: any };
			
			// Generar ID único
			const id = Date.now().toString();
			
			// Insertar el ingrediente
			await env.DB.prepare(`
				INSERT INTO ingredients (id, shopping_list_id, name, quantity, unit, observations, category)
				VALUES (?, ?, ?, ?, ?, ?, ?)
			`).bind(
				id,
				'default',
				ingredient.name,
				ingredient.quantity || '',
				ingredient.unit || '',
				ingredient.observations || '',
				'Otros' // Categoría por defecto
			).run();
			
			// Obtener la lista actualizada
			const listResult = await env.DB.prepare(
				'SELECT * FROM shopping_lists WHERE id = ?'
			).bind('default').first();
			
			const ingredientsResult = await env.DB.prepare(
				'SELECT * FROM ingredients WHERE shopping_list_id = ? ORDER BY category, name'
			).bind('default').all();

			return new Response(JSON.stringify({
				shoppingList: listResult,
				ingredients: ingredientsResult.results || []
			}), {
				headers: { 'Content-Type': 'application/json' }
			});
		}
		
		// Caso 2: Reemplazar todos los ingredientes
		const { ingredients } = body as { ingredients: any[] };
		
		if (!Array.isArray(ingredients)) {
			return new Response('Invalid ingredients data', { status: 400 });
		}

		// Limpiar ingredientes existentes
		await env.DB.prepare('DELETE FROM ingredients WHERE shopping_list_id = ?').bind('default').run();

		// Insertar nuevos ingredientes
		for (const ingredient of ingredients) {
			await env.DB.prepare(`
				INSERT INTO ingredients (id, shopping_list_id, name, quantity, unit, observations, category)
				VALUES (?, ?, ?, ?, ?, ?, ?)
			`).bind(
				ingredient.id,
				'default',
				ingredient.name,
				ingredient.quantity || '',
				ingredient.unit || '',
				ingredient.observations || '',
				ingredient.category || 'Otros'
			).run();
		}

		// Actualizar timestamp de la lista
		await env.DB.prepare(
			'UPDATE shopping_lists SET updated_at = CURRENT_TIMESTAMP WHERE id = ?'
		).bind('default').run();

		return new Response(JSON.stringify({ success: true }), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('Error saving shopping list:', error);
		return new Response('Internal server error', { status: 500 });
	}
};
