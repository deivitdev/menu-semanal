<script lang="ts">
	interface Props {
		title?: string;
	}

	let { title = "Menú Semanal" }: Props = $props();
</script>

<nav class="navbar">
	<div class="nav-container">
		<div class="nav-brand">
			<a href="/" class="nav-link">Menú Semanal</a>
		</div>

		<div class="nav-menu">
			<a href="/" class="nav-link">Inicio</a>
			<a href="/shopping-list" class="nav-link">Lista de Compras</a>
			<a href="/login" class="nav-link">Login</a>
		</div>
	</div>
</nav>

<style>
	.navbar {
		background-color: white;
		box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 1000;
	}

	.nav-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 4rem;
	}

	.nav-brand .nav-link {
		font-size: 1.25rem;
		font-weight: bold;
		color: #1f2937;
		text-decoration: none;
	}

	.nav-menu {
		display: flex;
		gap: 1rem;
	}

	.nav-link {
		color: #4b5563;
		text-decoration: none;
		padding: 0.5rem 1rem;
		border-radius: 0.375rem;
		transition: all 0.2s ease-in-out;
	}

	.nav-link:hover {
		background-color: #f3f4f6;
		color: #1f2937;
	}

	@media (max-width: 768px) {
		.nav-container {
			padding: 0 0.5rem;
		}

		.nav-menu {
			gap: 0.5rem;
		}

		.nav-link {
			padding: 0.5rem 0.75rem;
			font-size: 0.875rem;
		}
	}
</style>
