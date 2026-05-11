// Kenkobo site — small enhancements only.
(() => {
  // Render the header wordmark via the shared canvas renderer.
  const brandCanvas = document.getElementById('brand-canvas');
  if (brandCanvas && window.KenkoboWordmark) {
    const draw = () => {
      // Scale brand wordmark fluidly with viewport — matches the clamp() type
      // scale used throughout the site.
      const vw = window.innerWidth;
      const scale = Math.max(0.30, Math.min(0.55, vw / 2900));
      window.KenkoboWordmark.render(brandCanvas, {
        scale: scale,
        padX: 12,
        padY: 12,
      });
    };
    draw();
    window.addEventListener('resize', draw);
  }

  // ─── Contact dialog ─────────────────────────────────────────────────
  const dialog = document.getElementById('contact-dialog');
  if (dialog) {
    const form = document.getElementById('contact-form');
    const contentEl = dialog.querySelector('.dialog-content');
    const successEl = dialog.querySelector('.dialog-success');

    const open = () => {
      contentEl.hidden = false;
      successEl.hidden = true;
      form.reset();
      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        // Extremely old Safari fallback — just toggle attribute
        dialog.setAttribute('open', '');
      }
      setTimeout(() => {
        const firstInput = form.querySelector('input, textarea');
        if (firstInput) firstInput.focus();
      }, 60);
    };

    const close = () => {
      if (typeof dialog.close === 'function') dialog.close();
      else dialog.removeAttribute('open');
    };

    document.querySelectorAll('[data-open="contact"]').forEach((trigger) => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        open();
      });
    });

    dialog.querySelectorAll('[data-close]').forEach((el) => {
      el.addEventListener('click', close);
    });

    // Click on backdrop closes the dialog. With native <dialog>, the dialog
    // itself fills the entire viewport for click purposes — we detect a
    // backdrop click by comparing event target with dialog element.
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) close();
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (typeof form.reportValidity === 'function' && !form.reportValidity()) return;
      // No backend — show the thank-you panel in-place.
      contentEl.hidden = true;
      successEl.hidden = false;
      const closeBtn = successEl.querySelector('[data-close]');
      if (closeBtn) setTimeout(() => closeBtn.focus(), 60);
    });
  }

  // Fade page in once the wordmark has had a chance to render.
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.body.classList.add('loaded');
  }));
})();
