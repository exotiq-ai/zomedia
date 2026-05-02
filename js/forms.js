/* js/forms.js — client-side validation for forms with [data-validate] */
(function () {
  'use strict';
  document.querySelectorAll('form[data-validate]').forEach(form => {
    form.addEventListener('submit', (e) => {
      let valid = true;
      form.querySelectorAll('[required]').forEach(field => {
        const ok = field.checkValidity();
        field.setAttribute('aria-invalid', String(!ok));
        if (!ok) valid = false;
      });
      const errMsg = form.querySelector('.form-message--error');
      if (!valid) {
        e.preventDefault();
        if (errMsg) errMsg.hidden = false;
      } else if (errMsg) {
        errMsg.hidden = true;
      }
    });
  });

  // Conditional tier select on Get Involved page
  const statusSelect = document.querySelector('select[name="status"]');
  const tierGroup = document.querySelector('.tier-group');
  if (statusSelect && tierGroup) {
    const update = () => {
      tierGroup.hidden = statusSelect.value !== 'full';
    };
    statusSelect.addEventListener('change', update);
    update();
  }
})();
