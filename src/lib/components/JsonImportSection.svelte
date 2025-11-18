<script lang="ts">
	interface Props {
		showJsonInput: boolean;
		jsonInput: string;
		onLoadFromJson: () => void;
		onClearInput: () => void;
		onCancel: () => void;
		onJsonInputChange?: (value: string) => void;
	}

	let {
		showJsonInput,
		jsonInput,
		onLoadFromJson,
		onClearInput,
		onCancel,
		onJsonInputChange
	}: Props = $props();

	function handleInput(event: Event) {
		const target = event.target as HTMLTextAreaElement;
		jsonInput = target.value;
		if (onJsonInputChange) {
			onJsonInputChange(jsonInput);
		}
	}
</script>

{#if showJsonInput}
	<div class="mb-6 p-4 bg-blue-50 rounded-lg">
		<h3 class="text-lg font-semibold text-gray-800 mb-3">📋 Importar Ingredientes (JSON)</h3>
		<div class="space-y-3">
			<textarea
				value={jsonInput}
				oninput={handleInput}
				placeholder="Pega aquí tu JSON de ingredientes..."
				class="w-full h-40 p-3 border border-gray-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
			></textarea>
			<div class="flex space-x-3">
				<button 
					onclick={onLoadFromJson}
					class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
				>
					Cargar Ingredientes
				</button>
				<button 
					onclick={onClearInput}
					class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
				>
					Limpiar
				</button>
				<button 
					onclick={onCancel}
					class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
				>
					Cancelar
				</button>
			</div>
			<p class="text-xs text-gray-600">
				Formato esperado: Array de objetos con propiedades: name, quantity, unit, observations
			</p>
		</div>
	</div>
{/if}
