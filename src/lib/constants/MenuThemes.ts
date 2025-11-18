import type { MenuTheme } from '../types/MenuTypes';

export const defaultTheme: MenuTheme = {
	normal: 'bg-gray-50 rounded-lg p-6',
	today: 'bg-blue-50 border-2 border-blue-300 rounded-lg p-6 shadow-lg',
	titleNormal: 'text-2xl font-semibold mb-4 text-blue-600',
	titleToday: 'text-2xl font-semibold mb-4 text-blue-700 flex items-center gap-2'
};
