// Theme choice: system setting, light or dark. A classic script loaded in <head> so the saved theme is on the page before the first paint.
// html[data-theme-mode] holds the choice and html[data-theme] holds the theme in effect. The colours live in style.css as variables.
(() => {
  const KEY = 'study-space:theme';
  const MODES = {system: '시스템', light: '라이트', dark: '다크'};
  const root = document.documentElement;
  const query = matchMedia('(prefers-color-scheme: dark)');

  const read = () => {
    try {
      const saved = localStorage.getItem(KEY);
      return saved in MODES ? saved : 'system';
    } catch {
      return 'system';
    }
  };

  function apply(mode) {
    root.dataset.themeMode = mode;
    root.dataset.theme = mode === 'dark' || (mode === 'system' && query.matches) ? 'dark' : 'light';
    const bar = document.querySelector('meta[name="theme-color"]');
    if (bar) {
      bar.content = getComputedStyle(root).getPropertyValue('--paper').trim() || bar.content;
    }
  }

  apply(read());
  query.addEventListener('change', () => apply(read()));
  addEventListener('storage', (ev) => {
    if (ev.key === KEY) {
      apply(read());
      const select = document.querySelector('#theme-select');
      if (select) {
        select.value = read();
      }
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.site-header');
    if (!header) {
      return;
    }
    const label = document.createElement('label');
    label.className = 'theme-picker';
    label.innerHTML = '<span class="sr-only">화면 테마</span><select id="theme-select">'
      + Object.entries(MODES).map(([value, name]) => '<option value="' + value + '">' + name + '</option>').join('') + '</select>';
    const select = label.querySelector('select');
    select.value = read();
    select.addEventListener('change', () => {
      try {
        localStorage.setItem(KEY, select.value);
      } catch {
        // The choice still applies to this visit when storage is blocked.
      }
      apply(select.value);
    });
    header.append(label);
    apply(read());
  });
})();
