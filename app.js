/**
 * SocialHub AI - Interactive Logic & Multi-Language Engine
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

  let currentLang = 'es';

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
  function applyLanguage(lang) {
    if (!window.TRANSLATIONS || !window.TRANSLATIONS[lang]) {
      console.warn(`[SocialHub i18n] Translations for language '${lang}' not found.`);
      return;
    }

    currentLang = lang;
    document.documentElement.lang = lang;
    localStorage.setItem('socialhub_lang', lang);

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
  }

  /**
   * Determine initial language: localStorage -> browser language -> fallback 'es'
   */
  function detectInitialLanguage() {
    const saved = localStorage.getItem('socialhub_lang');
    if (saved && LANG_CONFIG[saved]) {
      return saved;
    }
    const browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    if (browserLang.startsWith('pt')) return 'pt';
    if (browserLang.startsWith('en')) return 'en';
    return 'es';
  }

  /**
   * Setup Language Selector Dropdown
   */
  function initLanguageDropdown() {
    const langBtn = document.getElementById('langBtn');
    const langDropdown = document.getElementById('langDropdown');

    if (!langBtn || !langDropdown) return;

    langBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      langDropdown.classList.toggle('open');
    });

    document.querySelectorAll('.lang-option').forEach((option) => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        const selectedLang = option.getAttribute('data-lang');
        if (selectedLang && LANG_CONFIG[selectedLang]) {
          applyLanguage(selectedLang);
          langDropdown.classList.remove('open');
        }
      });
    });

    // Close dropdown on click outside
    document.addEventListener('click', () => {
      if (langDropdown.classList.contains('open')) {
        langDropdown.classList.remove('open');
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
          if (agenciesGroup) agenciesGroup.style.display = 'block';
        } else if (filter === 'creators') {
          if (creatorsGroup) creatorsGroup.style.display = 'block';
          if (agenciesGroup) agenciesGroup.style.display = 'none';
        } else if (filter === 'agencies') {
          if (creatorsGroup) creatorsGroup.style.display = 'none';
          if (agenciesGroup) agenciesGroup.style.display = 'block';
        }
      });
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

    // Detect and apply initial language
    const initialLang = detectInitialLanguage();
    applyLanguage(initialLang);
  });
})();
