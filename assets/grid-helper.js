/**
 * Dev-only grid overlay toggle.
 *
 * Shows/hides the column overlay rendered by snippets/grid-overlay.liquid with
 * Cmd/Ctrl + G, remembering the state across page loads.
 *
 * Shopify exposes no Liquid flag for "development store", so the gate is done
 * here against Shopify.theme.role (set by content_for_header): "development"
 * under `shopify theme dev`, "unpublished" for theme previews, "main" on the
 * live theme. The overlay markup ships everywhere but only becomes toggleable
 * off the live theme, or inside the theme editor.
 */

const STORAGE_KEY = 'grid-helper-active';

class GridHelper {
  constructor() {
    this.template = document.querySelector('[data-grid-template]');

    if (!this.template || !GridHelper.isDevEnvironment()) return;

    this.init();
  }

  /**
   * @returns {boolean} Whether the overlay should be available on this theme.
   */
  static isDevEnvironment() {
    if (document.documentElement.classList.contains('shopify-design-mode')) return true;

    const role = window.Shopify?.theme?.role;

    // A missing Shopify.theme means we can't prove this isn't production — assume it is.
    return typeof role === 'string' && role !== 'main';
  }

  init() {
    this.isActive = localStorage.getItem(STORAGE_KEY) === 'true';

    this.updateVisibility();

    // keydown rather than keyup: on macOS Cmd+G is "Find Again", and acting on
    // keyup lets the browser handle it before we can preventDefault().
    document.addEventListener('keydown', (event) => {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 'g') return;

      event.preventDefault();
      this.toggle();
    });
  }

  toggle() {
    this.isActive = !this.isActive;

    localStorage.setItem(STORAGE_KEY, this.isActive ? 'true' : 'false');

    this.updateVisibility();
  }

  updateVisibility() {
    this.template.classList.toggle('is-hidden', !this.isActive);
  }
}

new GridHelper();
