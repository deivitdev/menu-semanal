<script lang="ts">
	interface Props {
		onRestoreList: () => void;
	}

	let { onRestoreList }: Props = $props();
</script>

<!-- Empty State -->
<div class="text-center py-12">
	<div class="text-gray-500 text-lg mb-4">🛒</div>
	<p class="text-gray-500">La lista de compras está vacía</p>
	<button 
		onclick={onRestoreList}
		class="mx-auto block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors mt-8"
	>
		Restaurar lista
	</button>
</div>
