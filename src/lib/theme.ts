export type ThemeName = 'healthy' | 'cats';

export const THEMES: Record<ThemeName, { label: string }> = {
	healthy: { label: 'Saludable' },
	cats: { label: 'Gatitos' }
};
