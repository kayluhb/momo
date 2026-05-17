import { normalizeSectionId } from '@theme/section-renderer';

/**
 * @returns {string | null}
 */
export function getCartDrawerSectionId() {
  const drawerSection = document.querySelector('cart-drawer-component')?.closest('.shopify-section');
  if (drawerSection?.id) {
    return normalizeSectionId(drawerSection.id);
  }

  const cartItems = document.querySelector(
    'cart-drawer-component cart-items-component[data-section-id]'
  );
  if (cartItems instanceof HTMLElement && cartItems.dataset.sectionId) {
    return cartItems.dataset.sectionId;
  }

  return null;
}

/**
 * Collects section IDs that should refresh on cart changes.
 * @returns {string[]}
 */
export function getCartSectionIds() {
  const ids = new Set();

  const header = document.querySelector('[data-site-header][data-section-id]');
  if (header instanceof HTMLElement && header.dataset.sectionId) {
    ids.add(header.dataset.sectionId);
  }

  document.querySelectorAll('cart-items-component[data-section-id]').forEach((element) => {
    if (element instanceof HTMLElement && element.dataset.sectionId) {
      ids.add(element.dataset.sectionId);
    }
  });

  const drawerSectionId = getCartDrawerSectionId();
  if (drawerSectionId) {
    ids.add(drawerSectionId);
  }

  return Array.from(ids);
}

/**
 * @returns {string}
 */
export function getCartSectionsParam() {
  return getCartSectionIds().join(',');
}
