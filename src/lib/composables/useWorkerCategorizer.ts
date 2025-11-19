import { writable } from 'svelte/store';
import type { CategorizedIngredients, Ingredient } from '$lib/types/ingredients';

interface WorkerMessage {
	type: 'CATEGORIZE_INGREDIENTS' | 'CATEGORIZE_SINGLE';
	data: Ingredient[] | { name: string; id: number };
}

interface WorkerResponse {
	type: 'CATEGORIZATION_COMPLETE' | 'SINGLE_CATEGORIZATION_COMPLETE';
	data: CategorizedIngredients | { id: number; category: string };
}

export function useWorkerCategorizer() {
	const categorizing = writable(false);
	const error = writable<string | null>(null);
	
	let worker: Worker | null = null;
	let pendingTasks = new Map<string, {
		resolve: (value: any) => void;
		reject: (error: Error) => void;
	}>();

	function initWorker() {
		if (worker) return worker;
		
		try {
			worker = new Worker(new URL('$lib/workers/categorizerWorker.ts', import.meta.url), {
				type: 'module'
			});
			
			worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
				const { type, data } = e.data;
				const taskId = type;
				
				if (pendingTasks.has(taskId)) {
					const { resolve } = pendingTasks.get(taskId)!;
					if (type === 'CATEGORIZATION_COMPLETE') {
						resolve(data as CategorizedIngredients);
					} else {
						resolve(data);
					}
					pendingTasks.delete(taskId);
				}
			};
			
			worker.onerror = (err) => {
				error.set(`Worker error: ${err.message}`);
				// Rechazar todas las tareas pendientes
				pendingTasks.forEach(({ reject }) => reject(new Error(err.message)));
				pendingTasks.clear();
			};
			
		} catch (err) {
			error.set(`Failed to initialize worker: ${err instanceof Error ? err.message : 'Unknown error'}`);
		}
		
		return worker;
	}

	async function categorizeIngredients(ingredients: Ingredient[]): Promise<CategorizedIngredients> {
		const worker = initWorker();
		if (!worker) {
			throw new Error('Worker not available');
		}
		
		categorizing.set(true);
		error.set(null);
		
		return new Promise<CategorizedIngredients>((resolve, reject) => {
			pendingTasks.set('CATEGORIZATION_COMPLETE', { resolve, reject });
			
			worker.postMessage({
				type: 'CATEGORIZE_INGREDIENTS',
				data: ingredients
			} as WorkerMessage);
		}).finally(() => {
			categorizing.set(false);
		});
	}

	async function categorizeSingle(name: string, id: number): Promise<{ id: number; category: string }> {
		const worker = initWorker();
		if (!worker) {
			throw new Error('Worker not available');
		}
		
		return new Promise((resolve, reject) => {
			pendingTasks.set('SINGLE_CATEGORIZATION_COMPLETE', { resolve, reject });
			
			worker.postMessage({
				type: 'CATEGORIZE_SINGLE',
				data: { name, id }
			} as WorkerMessage);
		});
	}

	function destroy() {
		if (worker) {
			worker.terminate();
			worker = null;
		}
		pendingTasks.clear();
	}

	return {
		categorizeIngredients,
		categorizeSingle,
		categorizing: { subscribe: categorizing.subscribe },
		error: { subscribe: error.subscribe },
		destroy
	};
}
