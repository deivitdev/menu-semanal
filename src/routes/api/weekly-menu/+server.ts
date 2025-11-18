import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

interface DayMenuItem {
	day: string;
	breakfast: string;
	breakfastDesc: string;
	lunch: string;
	lunchDesc: string;
	dinner: string;
	dinnerDesc: string;
}

export const GET: RequestHandler = async ({ platform }) => {
	try {
		const env = platform?.env as any;
		if (!env?.DB) {
			// Fallback to empty array if database is not available
			return json([]);
		}

		// Try to get menu from database
		const result = await env.DB.prepare(`
			SELECT * FROM weekly_menu 
			ORDER BY CASE day
				WHEN 'Lunes' THEN 1
				WHEN 'Martes' THEN 2
				WHEN 'Miércoles' THEN 3
				WHEN 'Jueves' THEN 4
				WHEN 'Viernes' THEN 5
				WHEN 'Sábado' THEN 6
				WHEN 'Domingo' THEN 7
				ELSE 8
			END
		`).all();
		
		if (result.results.length > 0) {
			// Map database results to the expected format
			const menuData = result.results.map((row: any) => ({
				day: row.day,
				breakfast: row.breakfast,
				breakfastDesc: row.breakfast_desc,
				lunch: row.lunch,
				lunchDesc: row.lunch_desc,
				dinner: row.dinner,
				dinnerDesc: row.dinner_desc
			}));
			return json(menuData);
		} else {
			// Return empty array if no data in database
			return json([]);
		}
	} catch (error) {
		console.error('Error fetching weekly menu:', error);
		return json({ error: 'Error fetching weekly menu' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request, platform }) => {
	try {
		const env = platform?.env as any;
		const menuData = await request.json() as DayMenuItem[];
		
		if (!env?.DB) {
			// Fallback if database is not available
			console.warn('Database not available, menu not saved');
			return json({ success: false, message: 'Database not available' }, { status: 500 });
		}

		// Clear existing menu data
		await env.DB.prepare('DELETE FROM weekly_menu').run();

		// Insert new menu data
		for (const dayMenu of menuData) {
			await env.DB.prepare(`
				INSERT INTO weekly_menu (id, day, breakfast, breakfast_desc, lunch, lunch_desc, dinner, dinner_desc)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?)
			`).bind(
				crypto.randomUUID(),
				dayMenu.day,
				dayMenu.breakfast,
				dayMenu.breakfastDesc,
				dayMenu.lunch,
				dayMenu.lunchDesc,
				dayMenu.dinner,
				dayMenu.dinnerDesc
			).run();
		}
		
		return json({ success: true, message: 'Menu saved successfully' });
	} catch (error) {
		console.error('Error saving weekly menu:', error);
		return json({ error: 'Error saving weekly menu' }, { status: 500 });
	}
};
