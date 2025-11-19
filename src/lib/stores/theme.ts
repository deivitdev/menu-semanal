import { writable } from 'svelte/store';
import type { ThemeName } from '$lib/theme';

const THEME_KEY = 'weekly-menu-theme';

function getInitialTheme(): ThemeName {
	if (typeof window === 'undefined') return 'healthy';
	const stored = window.localStorage.getItem(THEME_KEY) as ThemeName | null;
	return stored === 'cats' ? 'cats' : 'healthy';
}

export const theme = writable<ThemeName>(getInitialTheme());

if (typeof window !== 'undefined') {
	theme.subscribe((value) => {
		window.localStorage.setItem(THEME_KEY, value);
		document.documentElement.dataset.theme = value;
	});
}
