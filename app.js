/**
 * HubSocial AI - Interactive Logic & Multi-Language Engine
 * Pure Vanilla JS, zero dependencies, lightning fast.
 */

(function () {
  'use strict';

  // Supported languages map
  const LANG_CONFIG = {
    es: { code: 'es', label: 'Español', flag: '🇪🇸' },
    en: { code: 'en', label: 'English', flag: '🇺🇸' },
    pt: { code: 'pt', label: 'Português', flag: '🇧🇷' }
  };

  let currentLang = 'en';

  /**
   * Helper to retrieve nested object property by dot notation (e.g., "hero.badge")
   */
  function getNestedTranslation(obj, path) {
    if (!obj || !path) return null;
    return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : null), obj);
  }

  /**
   * Apply selected language to all DOM elements with data-i18n attributes
   */
  function applyLanguage(lang, updateUrl = true) {
    if (!window.TRANSLATIONS || !window.TRANSLATIONS[lang]) {
      console.warn(`[HubSocial i18n] Translations for language '${lang}' not found.`);
      return;
    }

    currentLang = lang;
    document.documentElement.lang = lang;

    try {
      localStorage.setItem('socialhub_lang', lang);
    } catch (e) {
      // Ignored when file:// protocol or storage is restricted
    }

    const dictionary = window.TRANSLATIONS[lang];

    // 1. Update Document Title and Meta Description
    if (dictionary.meta) {
      if (dictionary.meta.title) document.title = dictionary.meta.title;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && dictionary.meta.description) {
        metaDesc.setAttribute('content', dictionary.meta.description);
      }
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle && dictionary.meta.title) ogTitle.setAttribute('content', dictionary.meta.title);
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc && dictionary.meta.description) ogDesc.setAttribute('content', dictionary.meta.description);
    }

    // 2. Update all elements with textContent translation
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const val = getNestedTranslation(dictionary, key);
      if (val !== null && val !== undefined) {
        el.textContent = val;
      }
    });

    // 3. Update all elements with HTML translation (e.g. formatted texts)
    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const key = el.getAttribute('data-i18n-html');
      const val = getNestedTranslation(dictionary, key);
      if (val !== null && val !== undefined) {
        el.innerHTML = val;
      }
    });

    // 4. Update Placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      const val = getNestedTranslation(dictionary, key);
      if (val !== null && val !== undefined) {
        el.setAttribute('placeholder', val);
      }
    });

    // 5. Update Language Switcher UI Display
    const langBtnText = document.getElementById('currentLangLabel');
    const langBtnFlag = document.getElementById('currentLangFlag');
    if (langBtnText && LANG_CONFIG[lang]) {
      langBtnText.textContent = lang.toUpperCase();
    }
    if (langBtnFlag && LANG_CONFIG[lang]) {
      langBtnFlag.textContent = LANG_CONFIG[lang].flag;
    }

    // Update active highlight in dropdown
    document.querySelectorAll('.lang-option').forEach((opt) => {
      const optLang = opt.getAttribute('data-lang');
      if (optLang === lang) {
        opt.classList.add('active');
      } else {
        opt.classList.remove('active');
      }
    });

    // 6. Sync URL query parameter (?lang=...) without page reload (safe for file:// origins)
    if (updateUrl && window.location.protocol !== 'file:' && window.history && window.history.replaceState) {
      try {
        const url = new URL(window.location.href);
        if (lang === 'en') {
          url.searchParams.delete('lang');
        } else {
          url.searchParams.set('lang', lang);
        }
        window.history.replaceState({}, '', url.toString());
      } catch (e) {
        // Silently skip if history API is restricted
      }
    }
  }

  /**
   * Determine initial language: URL query (?lang=..) -> localStorage -> browser language -> fallback 'en'
   */
  function detectInitialLanguage() {
    // 1. URL search param check (e.g. ?lang=es)
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const urlLang = urlParams.get('lang');
      if (urlLang && LANG_CONFIG[urlLang]) {
        return urlLang;
      }
    } catch (e) {
      // Fallback if URLSearchParams fails
    }

    // 2. Saved language preference
    try {
      const saved = localStorage.getItem('socialhub_lang');
      if (saved && LANG_CONFIG[saved]) {
        return saved;
      }
    } catch (e) {
      // Fallback if localStorage access is restricted in file:// protocol
    }

    // 3. Browser language
    const browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    if (browserLang.startsWith('es')) return 'es';
    if (browserLang.startsWith('pt')) return 'pt';

    // 4. Default fallback: English
    return 'en';
  }

  /**
   * Setup Language Selector Dropdown
   */
  function initLanguageDropdown() {
    const langWrapper = document.querySelector('.lang-selector-wrapper');
    const langBtn = document.getElementById('langBtn');
    const langDropdown = document.getElementById('langDropdown');

    if (!langBtn || !langDropdown) return;

    function toggleDropdown(forceState) {
      const isOpen = typeof forceState === 'boolean'
        ? forceState
        : !langDropdown.classList.contains('open');

      langDropdown.classList.toggle('open', isOpen);
      if (langWrapper) langWrapper.classList.toggle('open', isOpen);
      langBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }

    langBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleDropdown();
    });

    document.querySelectorAll('.lang-option').forEach((option) => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        const selectedLang = option.getAttribute('data-lang');
        if (selectedLang && LANG_CONFIG[selectedLang]) {
          applyLanguage(selectedLang);
          toggleDropdown(false);
        }
      });
    });

    // Close dropdown on click outside
    document.addEventListener('click', (e) => {
      if (langDropdown.classList.contains('open')) {
        if (!langDropdown.contains(e.target) && !langBtn.contains(e.target)) {
          toggleDropdown(false);
        }
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && langDropdown.classList.contains('open')) {
        toggleDropdown(false);
        langBtn.focus();
      }
    });
  }

  /**
   * Sticky Header on Scroll
   */
  function initStickyHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  /**
   * Mobile Menu Drawer
   */
  function initMobileMenu() {
    const toggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');

    if (!toggle || !navLinks) return;

    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const icon = toggle.querySelector('i');
      if (icon) {
        if (navLinks.classList.contains('open')) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-xmark');
        } else {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    });

    // Close menu when tapping any link
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        const icon = toggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      });
    });
  }

  /**
   * FAQ Accordion Interactivity
   */
  function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach((item) => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');

      if (!question || !answer) return;

      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close other accordion items
        faqItems.forEach((other) => {
          if (other !== item) {
            other.classList.remove('active');
            const otherAnswer = other.querySelector('.faq-answer');
            if (otherAnswer) otherAnswer.style.maxHeight = null;
          }
        });

        // Toggle current item
        if (isActive) {
          item.classList.remove('active');
          answer.style.maxHeight = null;
        } else {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });
  }

  /**
   * Pricing Tab Filter Interactivity
   */
  function initPricingTabs() {
    const tabs = document.querySelectorAll('.pricing-tab-btn');
    const creatorsGroup = document.getElementById('pricingCreatorsGroup');
    const agenciesGroup = document.getElementById('pricingAgenciesGroup');

    if (!tabs.length) return;

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');

        const filter = tab.getAttribute('data-filter');

        if (filter === 'all') {
          if (creatorsGroup) creatorsGroup.style.display = 'block';
          if (agenciesGroup) {
            agenciesGroup.style.display = 'block';
            agenciesGroup.style.marginTop = '48px';
          }
        } else if (filter === 'creators') {
          if (creatorsGroup) creatorsGroup.style.display = 'block';
          if (agenciesGroup) agenciesGroup.style.display = 'none';
        } else if (filter === 'agencies') {
          if (creatorsGroup) creatorsGroup.style.display = 'none';
          if (agenciesGroup) {
            agenciesGroup.style.display = 'block';
            agenciesGroup.style.marginTop = '0';
          }
        }
      });
    });
  }

  /**
   * Device Tabs & Multi-Device Panel Interactivity
   */
  function initDeviceTabs() {
    const tabBtns = document.querySelectorAll('.device-tab-btn');
    const panels = document.querySelectorAll('.device-panel');

    if (!tabBtns.length) return;

    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetDevice = btn.getAttribute('data-device');

        tabBtns.forEach((b) => b.classList.remove('active'));
        panels.forEach((p) => p.classList.remove('active'));

        btn.classList.add('active');

        const activePanel = document.getElementById(`panel-${targetDevice}`);
        if (activePanel) {
          activePanel.classList.add('active');
        }
      });
    });
  }

  /**
   * Pricing Comparison Table Toggle
   */
  function initPricingCompare() {
    const toggleBtn = document.getElementById('pricingCompareToggle');
    const collapseContent = document.getElementById('pricingCompareContent');
    const actionLabel = toggleBtn ? toggleBtn.querySelector('.compare-toggle-action-label') : null;

    if (!toggleBtn || !collapseContent) return;

    toggleBtn.addEventListener('click', () => {
      const isExpanded = collapseContent.classList.contains('expanded');

      if (isExpanded) {
        collapseContent.classList.remove('expanded');
        toggleBtn.classList.remove('active');
        toggleBtn.setAttribute('aria-expanded', 'false');
        if (actionLabel) {
          actionLabel.setAttribute('data-i18n', 'pricing.compare_toggle_show');
          const currentLang = document.documentElement.lang || 'es';
          if (window.TRANSLATIONS && window.TRANSLATIONS[currentLang] && window.TRANSLATIONS[currentLang].pricing) {
            actionLabel.textContent = window.TRANSLATIONS[currentLang].pricing.compare_toggle_show;
          }
        }
      } else {
        collapseContent.classList.add('expanded');
        toggleBtn.classList.add('active');
        toggleBtn.setAttribute('aria-expanded', 'true');
        if (actionLabel) {
          actionLabel.setAttribute('data-i18n', 'pricing.compare_toggle_hide');
          const currentLang = document.documentElement.lang || 'es';
          if (window.TRANSLATIONS && window.TRANSLATIONS[currentLang] && window.TRANSLATIONS[currentLang].pricing) {
            actionLabel.textContent = window.TRANSLATIONS[currentLang].pricing.compare_toggle_hide;
          }
        }
      }
    });
  }

  /**
   * Initialize Everything on DOM Load
   */
  document.addEventListener('DOMContentLoaded', () => {
    initStickyHeader();
    initMobileMenu();
    initLanguageDropdown();
    initFaqAccordion();
    initPricingTabs();
    initPricingCompare();
    initDeviceTabs();

    // Detect and apply initial language (without altering initial URL unless user switches)
    const initialLang = detectInitialLanguage();
    applyLanguage(initialLang, false);
  });
})();

