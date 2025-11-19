<script lang="ts">
	interface Props {
		title?: string;
	}

	let { title = "Menú Semanal" }: Props = $props();

	let isMenuOpen = $state(false);

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	function closeMenu() {
		isMenuOpen = false;
	}
</script>

<nav class="navbar">
	<div class="nav-container">
		<div class="nav-brand">
			<a href="/" class="nav-link">Menú Semanal</a>
		</div>

		<!-- Hamburger menu button for mobile -->
		<button 
			class="hamburger-button" 
			onclick={toggleMenu}
			aria-label="Toggle menu"
		>
			{#if isMenuOpen}
				<!-- Close icon -->
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<line x1="18" y1="6" x2="6" y2="18"></line>
					<line x1="6" y1="6" x2="18" y2="18"></line>
				</svg>
			{:else}
				<!-- Hamburger icon -->
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<line x1="3" y1="12" x2="21" y2="12"></line>
					<line x1="3" y1="6" x2="21" y2="6"></line>
					<line x1="3" y1="18" x2="21" y2="18"></line>
				</svg>
			{/if}
		</button>

		<!-- Desktop menu -->
		<div class="nav-menu desktop-menu">
			<a href="/" class="nav-link">Inicio</a>
			<a href="/shopping-list" class="nav-link">Lista de Compras</a>
			<a href="/faq" class="nav-link">FAQ</a>
		</div>

		<!-- Mobile menu -->
		{#if isMenuOpen}
			<div class="mobile-menu-overlay" onclick={closeMenu}>
				<div class="mobile-menu" onclick={(e) => e.stopPropagation()}>
					<a href="/" class="nav-link" onclick={closeMenu}>Inicio</a>
					<a href="/shopping-list" class="nav-link" onclick={closeMenu}>Lista de Compras</a>
					<a href="/faq" class="nav-link" onclick={closeMenu}>FAQ</a>
				</div>
			</div>
		{/if}
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

	.desktop-menu {
		display: flex;
		gap: 1rem;
	}

	.hamburger-button {
		display: none;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.5rem;
		color: #4b5563;
		border-radius: 0.375rem;
		transition: background-color 0.2s ease-in-out;
	}

	.hamburger-button:hover {
		background-color: #f3f4f6;
	}

	.mobile-menu-overlay {
		display: none;
		position: fixed;
		top: 4rem;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 999;
	}

	.mobile-menu {
		background-color: white;
		padding: 1rem;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
	}

	.mobile-menu .nav-link {
		display: block;
		padding: 0.75rem 1rem;
		color: #4b5563;
		text-decoration: none;
		border-radius: 0.375rem;
		transition: all 0.2s ease-in-out;
	}

	.mobile-menu .nav-link:hover {
		background-color: #f3f4f6;
		color: #1f2937;
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

	/* Mobile styles */
	@media (max-width: 768px) {
		.nav-container {
			padding: 0 0.5rem;
		}

		.desktop-menu {
			display: none;
		}

		.hamburger-button {
			display: block;
		}

		.mobile-menu-overlay {
			display: block;
		}
	}
</style>
