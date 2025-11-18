<script lang="ts">
	interface Props {
		listCleared: boolean;
		onMarkAll: () => void;
		onUnmarkAll: () => void;
		onPrintList: () => void;
		onClearList: () => void;
	}

	let {
		listCleared,
		onMarkAll,
		onUnmarkAll,
		onPrintList,
		onClearList
	}: Props = $props();
</script>

<!-- Action Buttons - Top of the page -->
<div class="bg-white py-4 border-b mb-6">
	<div class="flex justify-center space-x-4 flex-wrap gap-2">
		{#if !listCleared}
			<button 
				onclick={onMarkAll}
				class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
			>
				Marcar todo
			</button>
			<button 
				onclick={onUnmarkAll}
				class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
			>
				Desmarcar todo
			</button>
			<button 
				onclick={onPrintList}
				class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
			>
				Imprimir lista
			</button>
			<button 
				onclick={onClearList}
				class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
			>
				Eliminar lista
			</button>
		{/if}
	</div>
</div>
