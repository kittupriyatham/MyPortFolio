/**
 * Theme Engine: Light, Dark Obsidian & Pure AMOLED Night
 * Krishna Priyatham Portfolio & Blog Design System
 */

var SUN_SVG   = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path></svg>';
var MOON_SVG  = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
var NIGHT_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path><path d="M19 3v4"></path><path d="M21 5h-4"></path></svg>';

(function() {
  'use strict';

  var THEME_KEY = 'theme';
  var LEGACY_KEY = 'darkMode';

  function getStoredTheme() {
    try {
      var t = localStorage.getItem(THEME_KEY);
      if (t === 'light' || t === 'dark' || t === 'night') return t;
      var legacy = localStorage.getItem(LEGACY_KEY);
      if (legacy === 'enabled') return 'dark';
      if (legacy === 'disabled') return 'light';
    } catch (e) {}
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  function applyTheme(theme) {
    var root = document.documentElement;
    var body = document.body;

    root.setAttribute('data-theme', theme);
    root.classList.toggle('dark', theme === 'dark' || theme === 'night');
    root.classList.toggle('night', theme === 'night');

    if (body) {
      body.classList.toggle('dark-mode', theme === 'dark' || theme === 'night');
      body.classList.toggle('night-mode', theme === 'night');
      body.classList.toggle('light-mode', theme === 'light');
    }
  }

  function updateToggleIcon(theme) {
    var btn = document.getElementById('dark-mode-toggle');
    if (!btn) return;

    if (theme === 'light') {
      btn.innerHTML = SUN_SVG;
      btn.setAttribute('aria-label', 'Current: Light Mode (click for Dark Obsidian)');
      btn.setAttribute('title', 'Theme: Light Mode (click for Dark Obsidian)');
    } else if (theme === 'dark') {
      btn.innerHTML = MOON_SVG;
      btn.setAttribute('aria-label', 'Current: Dark Obsidian (click for Night AMOLED)');
      btn.setAttribute('title', 'Theme: Dark Obsidian (click for Night AMOLED)');
    } else {
      btn.innerHTML = NIGHT_SVG;
      btn.setAttribute('aria-label', 'Current: Night AMOLED (click for Light Mode)');
      btn.setAttribute('title', 'Theme: Night AMOLED (click for Light Mode)');
    }
  }

  window.getTheme = function() {
    var root = document.documentElement;
    if (root.classList.contains('night')) return 'night';
    if (root.classList.contains('dark')) return 'dark';
    return 'light';
  };

  window.setTheme = function(theme) {
    if (theme !== 'light' && theme !== 'dark' && theme !== 'night') {
      theme = 'dark';
    }
    try {
      localStorage.setItem(THEME_KEY, theme);
      localStorage.setItem(LEGACY_KEY, theme === 'light' ? 'disabled' : 'enabled');
    } catch (e) {}

    applyTheme(theme);
    updateToggleIcon(theme);

    try {
      window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: theme } }));
    } catch (e) {}
  };

  window.toggleTheme = function() {
    var current = window.getTheme();
    var next = current === 'light' ? 'dark' : (current === 'dark' ? 'night' : 'light');
    window.setTheme(next);
  };

  // Initial immediate application
  var initial = getStoredTheme();
  applyTheme(initial);

  function onReady() {
    applyTheme(initial);
    updateToggleIcon(initial);

    var btn = document.getElementById('dark-mode-toggle');
    if (btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        window.toggleTheme();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
})();
