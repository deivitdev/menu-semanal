import type { DateService } from '../types/MenuTypes';

export class DefaultDateService implements DateService {
	getCurrentDay(): string {
		return new Date().toLocaleDateString('es-ES', { weekday: 'long' });
	}

	isToday(day: string): boolean {
		const today = this.getCurrentDay();
		return day.toLowerCase() === today.toLowerCase();
	}
}
