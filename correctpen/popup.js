document.addEventListener('DOMContentLoaded', async () => {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const msg = chrome.i18n.getMessage(el.dataset.i18n);
    if (msg) el.textContent = msg;
  });

  const langSelect = document.getElementById('lang');
  const toggleBtn = document.getElementById('toggle');
  const status = document.getElementById('status');

  const { language = 'es', enabled = true } =
    await chrome.storage.sync.get(['language', 'enabled']);

  langSelect.value = language;
  render(enabled);

  function render(isEnabled) {
    toggleBtn.textContent = chrome.i18n.getMessage(
      isEnabled ? 'toggleOff' : 'toggleOn'
    );
    status.textContent = chrome.i18n.getMessage(
      isEnabled ? 'statusOn' : 'statusOff'
    );
  }

  langSelect.addEventListener('change', async () => {
    await chrome.storage.sync.set({ language: langSelect.value });
  });

  toggleBtn.addEventListener('click', async () => {
    const { enabled } = await chrome.storage.sync.get('enabled');
    const next = enabled === false ? true : false;
    await chrome.storage.sync.set({ enabled: next });
    render(next);
  });
});