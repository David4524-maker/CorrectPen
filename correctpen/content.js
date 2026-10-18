const INPUT_SELECTOR =
  'textarea, input[type="text"], input[type="search"], input:not([type])';
const EDITABLE_SELECTOR = '[contenteditable="true"], [contenteditable=""]';
const ALL_SELECTOR = `${INPUT_SELECTOR}, ${EDITABLE_SELECTOR}`;
const DEBOUNCE_MS = 1200;

let enabled = true;
let language = 'es';

chrome.storage.sync.get(['enabled', 'language'], (res) => {
  enabled = res.enabled !== false;
  language = res.language || 'es';
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'sync') return;
  if (changes.enabled) enabled = changes.enabled.newValue !== false;
  if (changes.language) language = changes.language.newValue || 'es';
});

function debounce(fn, ms) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}

async function requestCorrection(text) {
  try {
    const res = await chrome.runtime.sendMessage({
      action: 'correct',
      text,
      language
    });
    if (!res) return null;
    if (res.error) {
      console.warn('[CorrectPen]', res.error);
      return null;
    }
    return res.corrected || null;
  } catch (e) {
    console.warn('[CorrectPen] Error enviando mensaje:', e);
    return null;
  }
}

async function correctInput(el) {
  if (!enabled) return;
  const text = el.value;
  if (!text || !text.trim()) return;

  const corrected = await requestCorrection(text);
  if (!corrected || corrected === text) return;

  const start = el.selectionStart;
  const end = el.selectionEnd;
  const delta = corrected.length - text.length;

  el.value = corrected;

  try {
    el.selectionStart = Math.max(0, start + delta);
    el.selectionEnd = Math.max(0, end + delta);
  } catch (_) {
    /* algunos inputs no soportan selectionStart */
  }
}

async function correctEditable(el) {
  if (!enabled) return;
  const text = el.innerText;
  if (!text || !text.trim()) return;

  const corrected = await requestCorrection(text);
  if (!corrected || corrected === text) return;

  el.innerText = corrected;
}

const debouncedCorrectInput = debounce(correctInput, DEBOUNCE_MS);

function attach(el) {
  if (el.dataset.correctpenAttached === '1') return;
  el.dataset.correctpenAttached = '1';

  if (el.matches(INPUT_SELECTOR)) {
    el.addEventListener('blur', () => correctInput(el));
    el.addEventListener('input', () => debouncedCorrectInput(el));
  } else if (el.matches(EDITABLE_SELECTOR)) {
    el.addEventListener('blur', () => correctEditable(el));
  }
}

function scan(root) {
  root.querySelectorAll(ALL_SELECTOR).forEach(attach);
}

const observer = new MutationObserver((mutations) => {
  for (const m of mutations) {
    m.addedNodes.forEach((node) => {
      if (node.nodeType !== Node.ELEMENT_NODE) return;
      if (node.matches && node.matches(ALL_SELECTOR)) attach(node);
      if (node.querySelectorAll) scan(node);
    });
  }
});

observer.observe(document.documentElement, { childList: true, subtree: true });
scan(document);