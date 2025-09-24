/*!
* Start Bootstrap - Resume (customized)
* Original: https://startbootstrap.com/theme/resume
* License: MIT
*/
(() => {
  'use strict';

  // ===== i18n dictionary =====
  const I18N = {
    en: {
      nav: { about: 'About', interests: 'Interests', publications: 'Publications', experience: 'Experience', skills: 'Skills', education: 'Education', awards: 'Awards', services: 'Services', gallery: 'Gallery', map: 'Around the World', contact: 'Contact', download: 'Download as PDF' },
      about: { lead: 'Researcher in AI & Educational Technology. I build data-driven tools to understand and enhance learning.', location: 'SAKAI-KU, SAKAI-SHI, OSAKA 590-0976 · ' },
      section: { interests: 'Interests', publications: 'Publications', experience: 'Experience', skills: 'Skills', education: 'Education', awards: 'Awards & Scholarships', services: 'Services', gallery: 'Gallery', map: 'Around the World', contact: 'Contact' },
      contact: { name: 'Name:', email: 'Email:', message: 'Message:', send: 'Send', name_req: 'Please enter your name.', email_req: 'Please enter a valid email.', message_req: 'Please write a message.' },
      interests: 'Multimodal learning analytics, human-AI interaction, eye-tracking, wearable sensing, inclusive education.'
    },
    fr: {
      nav: { about: 'À propos', interests: 'Centres d’intérêt', publications: 'Publications', experience: 'Expérience', skills: 'Compétences', education: 'Éducation', awards: 'Prix', services: 'Services', gallery: 'Galerie', map: 'Autour du monde', contact: 'Contact', download: 'Télécharger en PDF' },
      about: { lead: 'Chercheur en IA et technologies éducatives. Je conçois des outils basés sur les données pour améliorer l’apprentissage.', location: 'SAKAI-KU, SAKAI-SHI, OSAKA 590-0976 · ' },
      section: { interests: 'Centres d’intérêt', publications: 'Publications', experience: 'Expérience', skills: 'Compétences', education: 'Éducation', awards: 'Prix & Bourses', services: 'Services', gallery: 'Galerie', map: 'Autour du monde', contact: 'Contact' },
      contact: { name: 'Nom :', email: 'Email :', message: 'Message :', send: 'Envoyer', name_req: 'Veuillez entrer votre nom.', email_req: 'Veuillez saisir un email valide.', message_req: 'Veuillez écrire un message.' },
      interests: 'Analytique d’apprentissage multimodale, interaction humain-IA, eye-tracking, capteurs portables, éducation inclusive.'
    },
    ja: {
      nav: { about: '自己紹介', interests: '関心分野', publications: '業績', experience: '経験', skills: 'スキル', education: '学歴', awards: '受賞', services: 'サービス', gallery: 'ギャラリー', map: '世界での活動', contact: '連絡先', download: 'PDF をダウンロード' },
      about: { lead: 'AI と教育工学の研究者。学習を理解・向上させるデータ駆動型ツールを開発しています。', location: '大阪府堺市堺区 590-0976 · ' },
      section: { interests: '関心分野', publications: '業績', experience: '経験', skills: 'スキル', education: '学歴', awards: '受賞・奨学金', services: 'サービス', gallery: 'ギャラリー', map: '世界での活動', contact: '連絡先' },
      contact: { name: 'お名前：', email: 'メール：', message: 'メッセージ：', send: '送信', name_req: 'お名前を入力してください。', email_req: '有効なメールを入力してください。', message_req: 'メッセージを入力してください。' },
      interests: 'マルチモーダル学習分析、人間とAIのインタラクション、視線計測、ウェアラブル計測、インクルーシブ教育。'
    }
  };

  function applyI18n(lang) {
    const dict = I18N[lang] || I18N.en;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const keys = el.getAttribute('data-i18n').split('.');
      let v = dict;
      for (const k of keys) v = v?.[k];
      if (typeof v === 'string') el.textContent = v;
    });
    const aboutLead = document.getElementById('about-lead');
    if (aboutLead) aboutLead.textContent = dict.about.lead;
    const interests = document.getElementById('interests-content');
    if (interests) interests.textContent = dict.interests;
  }

  // One DOMContentLoaded for everything
  document.addEventListener('DOMContentLoaded', () => {
    // ===== ScrollSpy (Bootstrap 5) =====
    const sideNav = document.querySelector('#sideNav');
    if (sideNav && window.bootstrap?.ScrollSpy) {
      // Use offset (px). 80 works well with fixed side nav.
      new bootstrap.ScrollSpy(document.body, {
        target: '#sideNav',
        offset: 80
      });
    }

    // ===== Collapse responsive navbar on item click =====
    const navbarToggler = document.querySelector('.navbar-toggler');
    const responsiveNavItems = Array.from(
      document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.forEach(item => {
      item.addEventListener('click', () => {
        if (navbarToggler && getComputedStyle(navbarToggler).display !== 'none') {
          navbarToggler.click();
        }
      });
    });

    // ===== i18n wiring =====
    const langSel = document.getElementById('language-select');
    const initial = localStorage.getItem('lang') || 'en';
    if (langSel) {
      langSel.value = initial;
      applyI18n(initial);
      langSel.addEventListener('change', () => {
        const lang = langSel.value || 'en';
        localStorage.setItem('lang', lang);
        applyI18n(lang);
      });
    } else {
      // Fallback if selector not present
      applyI18n(initial);
    }

    // ===== Buttons & forms: expect handlers defined globally (functions.js) =====
    const dl = document.getElementById('download-pdf');
    if (dl && typeof window.downloadPDF === 'function') {
      dl.addEventListener('click', window.downloadPDF);
    }

    const form = document.getElementById('contact-form');
    if (form && typeof window.handleContactSubmit === 'function') {
      form.addEventListener('submit', window.handleContactSubmit);
    }

    // ===== Dynamic data + map =====
    if (typeof window.populateLists === 'function') window.populateLists();
    if (typeof window.initMap === 'function') window.initMap();
  });
})();
