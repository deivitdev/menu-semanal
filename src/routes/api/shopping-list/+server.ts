import type { RequestHandler } from './$types';

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

		// Obtener todos los ingredientes
		const ingredients = await env.DB.prepare(
			'SELECT * FROM ingredients WHERE shopping_list_id = ? ORDER BY category, name'
		).bind('default').all();

		return new Response(JSON.stringify({
			shoppingList: listResult,
			ingredients: ingredients.results || []
		}), {
			headers: { 'Content-Type': 'application/json' }
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
		const body = await request.json() as { ingredients: any[] };
		const { ingredients } = body;

		if (!Array.isArray(ingredients)) {
			return new Response('Invalid ingredients data', { status: 400 });
		}

		// Limpiar ingredientes existentes
		await env.DB.prepare('DELETE FROM ingredients WHERE shopping_list_id = ?').bind('default').run();

		// Insertar nuevos ingredientes
		for (const ingredient of ingredients) {
			await env.DB.prepare(`
				INSERT INTO ingredients (id, shopping_list_id, name, quantity, unit, observations, is_checked, category)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?)
			`).bind(
				ingredient.id,
				'default',
				ingredient.name,
				ingredient.quantity || '',
				ingredient.unit || '',
				ingredient.observations || '',
				ingredient.isChecked || false,
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
