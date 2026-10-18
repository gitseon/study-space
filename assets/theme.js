// Theme choice: system setting, light or dark, plus a colour palette. A classic script loaded in <head> so the saved choice is on the page before the first paint.
// html[data-theme-mode] holds the light/dark choice and html[data-theme] the theme in effect. html[data-palette] holds the palette.
// The colours live in style.css as variables.
(() => {
  const KEY = 'study-space:theme';
  const PALETTE_KEY = 'study-space:palette';
  const MODES = {system: '시스템', light: '라이트', dark: '다크'};
  const PALETTES = {default: '그린 계열', blue: '블루 계열', mono: '모노톤 계열'};
  const root = document.documentElement;
  const query = matchMedia('(prefers-color-scheme: dark)');

  const read = (key, choices, fallback) => {
    try {
      const saved = localStorage.getItem(key);
      return saved in choices ? saved : fallback;
    } catch {
      return fallback;
    }
  };
  const state = {mode: read(KEY, MODES, 'system'), palette: read(PALETTE_KEY, PALETTES, 'default')};

  function apply() {
    root.dataset.themeMode = state.mode;
    root.dataset.theme = state.mode === 'dark' || (state.mode === 'system' && query.matches) ? 'dark' : 'light';
    root.dataset.palette = state.palette;
    const bar = document.querySelector('meta[name="theme-color"]');
    if (bar) {
      bar.content = getComputedStyle(root).getPropertyValue('--paper').trim() || bar.content;
    }
  }

  const syncSelects = () => {
    const mode = document.querySelector('#theme-select');
    const palette = document.querySelector('#palette-select');
    if (mode) {
      mode.value = state.mode;
    }
    if (palette) {
      palette.value = state.palette;
    }
  };

  apply();
  query.addEventListener('change', apply);
  addEventListener('storage', (ev) => {
    if (ev.key === KEY || ev.key === PALETTE_KEY) {
      state.mode = read(KEY, MODES, state.mode);
      state.palette = read(PALETTE_KEY, PALETTES, state.palette);
      apply();
      syncSelects();
    }
  });

  function field(text, id, choices) {
    const label = document.createElement('label');
    label.className = 'theme-field';
    label.innerHTML = '<span class="theme-label">' + text + '</span><select id="' + id + '">'
      + Object.entries(choices).map(([value, name]) => '<option value="' + value + '">' + name + '</option>').join('') + '</select>';
    return label;
  }

  function remember(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      // The choice still applies to this visit when storage is blocked.
    }
  }

  // One "테마" button in the header opens a small panel holding both choices, light/dark and colour palette.
  document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.site-header');
    if (!header) {
      return;
    }
    const picker = document.createElement('div');
    picker.className = 'theme-picker';
    picker.innerHTML = '<button type="button" class="theme-button" aria-haspopup="true" aria-expanded="false" aria-controls="theme-panel">테마</button>'
      + '<div class="theme-panel" id="theme-panel" role="group" aria-label="테마와 색상 계열" hidden></div>';
    const button = picker.querySelector('.theme-button');
    const panel = picker.querySelector('.theme-panel');
    const mode = field('테마', 'theme-select', MODES);
    const palette = field('색상 계열', 'palette-select', PALETTES);
    panel.append(mode, palette);
    header.append(picker);
    syncSelects();

    const setOpen = (open) => {
      panel.hidden = !open;
      button.setAttribute('aria-expanded', String(open));
    };
    button.addEventListener('click', () => setOpen(panel.hidden));
    document.addEventListener('click', (ev) => {
      if (!picker.contains(ev.target)) {
        setOpen(false);
      }
    });
    picker.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape' && !panel.hidden) {
        setOpen(false);
        button.focus();
      }
    });
    mode.querySelector('select').addEventListener('change', (ev) => {
      state.mode = ev.target.value;
      remember(KEY, state.mode);
      apply();
    });
    palette.querySelector('select').addEventListener('change', (ev) => {
      state.palette = ev.target.value;
      remember(PALETTE_KEY, state.palette);
      apply();
    });
  });
})();
