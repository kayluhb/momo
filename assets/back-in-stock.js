import { DialogComponent } from '@theme/dialog';
import { fetchConfig } from '@theme/utilities';

/**
 * @typedef {object} Refs
 * @property {HTMLDialogElement} dialog - The dialog element.
 *
 * @extends {DialogComponent}
 */
class BackInStockComponent extends DialogComponent {
  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('submit', this.#handleSubmit);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('submit', this.#handleSubmit);
  }

  open() {
    this.#resetState();
    this.showDialog();
  }

  close() {
    this.closeDialog();
  }

  #resetState() {
    const { dialog } = this.refs;
    if (!dialog) return;

    const formWrap = dialog.querySelector('[data-back-in-stock-form-wrap]');
    const success = dialog.querySelector('[data-back-in-stock-success]');
    const status = dialog.querySelector('[data-back-in-stock-status]');

    formWrap?.removeAttribute('hidden');
    success?.setAttribute('hidden', '');
    status?.setAttribute('hidden', '');
    if (status instanceof HTMLElement) status.textContent = '';
  }

  /** @param {SubmitEvent} event */
  #handleSubmit = async (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    if (!form.matches('.back-in-stock__form')) return;

    event.preventDefault();

    const { dialog } = this.refs;
    if (!dialog) return;

    const submitButton = form.querySelector('[type="submit"]');
    const status = dialog.querySelector('[data-back-in-stock-status]');
    const formWrap = dialog.querySelector('[data-back-in-stock-form-wrap]');
    const success = dialog.querySelector('[data-back-in-stock-success]');
    const defaultLabel =
      submitButton instanceof HTMLInputElement
        ? submitButton.value
        : submitButton instanceof HTMLButtonElement
          ? submitButton.textContent
          : '';

    if (!(submitButton instanceof HTMLButtonElement || submitButton instanceof HTMLInputElement)) return;

    if (status instanceof HTMLElement) {
      status.setAttribute('hidden', '');
      status.textContent = '';
    }

    submitButton.disabled = true;
    submitButton.setAttribute('aria-busy', 'true');

    if (submitButton instanceof HTMLInputElement) {
      submitButton.value = Theme.translations.back_in_stock_submitting;
    } else {
      submitButton.textContent = Theme.translations.back_in_stock_submitting;
    }

    try {
      const response = await fetch('/contact', {
        ...fetchConfig('javascript', { body: new FormData(form) }),
      });

      if (!response.ok) {
        throw new Error('Contact form request failed');
      }

      formWrap?.setAttribute('hidden', '');
      success?.removeAttribute('hidden');
    } catch {
      if (status instanceof HTMLElement) {
        status.textContent = Theme.translations.back_in_stock_error;
        status.removeAttribute('hidden');
      }
    } finally {
      submitButton.disabled = false;
      submitButton.setAttribute('aria-busy', 'false');

      if (submitButton instanceof HTMLInputElement) {
        submitButton.value = defaultLabel || Theme.translations.back_in_stock_submit;
      } else {
        submitButton.textContent = defaultLabel || Theme.translations.back_in_stock_submit;
      }
    }
  };
}

if (!customElements.get('back-in-stock-component')) {
  customElements.define('back-in-stock-component', BackInStockComponent);
}
