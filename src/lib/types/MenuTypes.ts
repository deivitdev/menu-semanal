export interface Meal {
	type: 'breakfast' | 'lunch' | 'dinner';
	name: string;
	description: string;
}

export interface DayMenu {
	day: string;
	meals: Meal[];
}

export interface MenuTheme {
	normal: string;
	today: string;
	titleNormal: string;
	titleToday: string;
}

export interface DateService {
	getCurrentDay(): string;
	isToday(day: string): boolean;
}
