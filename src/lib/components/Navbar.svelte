<script lang="ts">
	import { theme } from '$lib/stores/theme';
	import type { ThemeName } from '$lib/theme';
	import { Leaf, PawPrint, Loader2 } from 'lucide-svelte';
	import { syncingStore } from '$lib/composables/useShoppingList';

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

	function toggleTheme() {
		theme.update((current) => (current === 'healthy' ? 'cats' : 'healthy'));
	}
</script>

<nav class="navbar">
	<div class="nav-container">
		<div class="nav-brand">
			<a href="/" class="nav-link">Menú Semanal</a>
		</div>

		<!-- Desktop menu -->
		<div class="nav-menu desktop-menu">
			<a href="/" class="nav-link">Inicio</a>
			<a href="/shopping-list" class="nav-link">Lista de Compras</a>
			<a href="/faq" class="nav-link">FAQ</a>
		</div>

		<!-- Right actions: sync spinner + theme switch + hamburger on mobile -->
		<div class="nav-actions">
			<!-- Sync spinner -->
			{#if $syncingStore}
				<div class="sync-spinner" title="Sincronizando...">
					<Loader2 size={20} class="animate-spin" />
				</div>
			{/if}
			
			<button class="theme-toggle" onclick={toggleTheme} aria-label="Cambiar tema de color">
				<div class={`theme-switch ${$theme === 'cats' ? 'is-cats' : ''}`}>
					<span class="theme-icon healthy"><Leaf size={18} /></span>
					<span class="theme-icon cat"><PawPrint size={18} /></span>
					<div class="thumb"></div>
				</div>
			</button>

			<button 
				class="hamburger-button" 
				onclick={toggleMenu}
				aria-label="Abrir menú de navegación"
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
		</div>

		<!-- Mobile menu -->
		{#if isMenuOpen}
			<div class="mobile-menu-overlay" onclick={closeMenu}>
				<div class="mobile-menu" role="menu" onclick={(e) => e.stopPropagation()}>
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
		align-items: center;
		height: 4rem;
	}

	.nav-actions {
		margin-left: auto;
		display: flex;
		align-items: center;
		gap: 0.75rem;
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

	/* Theme toggle switch */
	.theme-toggle {
		border: none;
		background: transparent;
		padding: 0;
		cursor: pointer;
	}

	/* Sync spinner */
	.sync-spinner {
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-primary);
		padding: 0.25rem;
	}

	.sync-spinner :global(.animate-spin) {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.theme-switch {
		position: relative;
		width: 72px;
		height: 32px;
		border-radius: 999px;
		background: var(--color-primary-soft);
		display: grid;
		grid-template-columns: 1fr 1fr;
		align-items: center;
		padding: 0 4px;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
		transition: background 0.2s ease-in-out;
	}

	.theme-switch.is-cats {
		background: var(--color-primary-soft);
	}

	.theme-icon {
		font-size: 0.9rem;
		z-index: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out;
	}

	.theme-icon.healthy {
		color: #16a34a;
	}

	.theme-icon.cat {
		color: #ec4899;
	}

	.thumb {
		position: absolute;
		width: 32px;
		height: 26px;
		border-radius: 999px;
		background: #ffffff;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
		left: 4px;
		transition: transform 0.2s ease-in-out;
	}

	.theme-switch.is-cats .thumb {
		transform: translateX(32px);
	}

	/* Emphasis on selected theme icon */
	.theme-switch:not(.is-cats) .theme-icon.healthy {
		transform: scale(1.1);
		opacity: 1;
	}

	.theme-switch:not(.is-cats) .theme-icon.cat {
		opacity: 0.6;
	}

	.theme-switch.is-cats .theme-icon.cat {
		transform: scale(1.1);
		opacity: 1;
	}

	.theme-switch.is-cats .theme-icon.healthy {
		opacity: 0.6;
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
