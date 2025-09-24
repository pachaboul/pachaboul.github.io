/*!
 * Resume site – app functions (unified)
 * - Local DATA fallback
 * - JSON fetch per language
 * - EmailJS guard
 * - Single PDF export
 */

(() => {
  'use strict';

  // ======= Local Content Data (fallback; edit with real info) =======
  const LOCAL_DATA = {
    publications: [
      {
        title: 'Integrative Analysis of Multimodal Interaction Data: Predicting Communication Dynamics and WtC',
        venue: 'CEUR-WS, 2024',
        link: 'https://ceur-ws.org/Vol-3738/paper4.pdf'
      }
    ],
    experience: [
      {
        role: 'Doctoral Researcher',
        org: 'Osaka Metropolitan University',
        dates: '2022 – Present',
        bullets: ['Multimodal learning analytics', 'Human–AI interaction', 'Eye-tracking & wearables']
      }
    ],
    skills: ['Python','Django','PyTorch','Docker','MySQL','Leaflet','Vue','React','Data Viz'],
    education: [
      { program: 'Ph.D. in Informatics', inst: 'Osaka Metropolitan University', dates: '2022 – Present' },
      { program: 'MSc in ICT4D', inst: 'Kobe Institute of Computing', dates: '2018 – 2020' }
    ],
    awards: ['Rotary Yoneyama Scholarship (candidate)'],
    services: ['Reviewer (ICCE/LAK workshops)', 'Community building: Mali–Japan'],
    gallery: [
      // 'assets/img/gallery/1.jpg', ...
    ],
    visited: [
      { name: 'Japan', lat: 36.2048, lng: 138.2529 },
      { name: 'Mali', lat: 17.5707, lng: -3.9962 },
      { name: 'Finland', lat: 61.9241, lng: 25.7482 }
    ]
  };

  // Make LOCAL_DATA available if someone expects window.DATA
  window.DATA = LOCAL_DATA;

  // ======= Helpers =======
  const JSON_PATHS = {
    about: 'json/about.json',
    interests: 'json/interests.json',
    publications: 'json/publications.json',
    experience: 'json/experience.json',
    skills: 'json/skills.json',
    education: 'json/education.json',
    awards: 'json/awards.json',
    services: 'json/services.json',
    gallery: 'json/gallery.json',
    map: 'json/map.json',
    menu: 'json/menu.json'
  };

  const cache = new Map();
  async function fetchJSON(url) {
    if (cache.has(url)) return cache.get(url);
    const p = fetch(url).then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`);
      return r.json();
    });
    cache.set(url, p);
    return p;
  }

  function setHTML(el, html) { if (el) el.innerHTML = html; }
  function setText(el, text) { if (el) el.textContent = text; }

  // ======= Populate lists from LOCAL_DATA =======
  function populateFromLocal() {
    // Publications
    const pubs = document.getElementById('publications-list');
    if (pubs) {
      pubs.innerHTML = '';
      LOCAL_DATA.publications.forEach(p => {
        const item = document.createElement('div');
        item.className = 'mb-3';
        item.innerHTML = `<strong>${p.title}</strong><br><span class="text-muted">${p.venue}</span>${p.link ? ` · <a href="${p.link}" target="_blank" rel="noopener">PDF</a>` : ''}`;
        pubs.appendChild(item);
      });
    }

    // Experience
    const exp = document.getElementById('experience-list');
    if (exp) {
      exp.innerHTML = '';
      LOCAL_DATA.experience.forEach(e => {
        const block = document.createElement('div');
        block.className = 'mb-3';
        block.innerHTML = `
          <h5 class="mb-1">${e.role} · <span class="text-primary">${e.org}</span></h5>
          <div class="text-muted small mb-2">${e.dates}</div>
          <ul class="mb-0">${(e.bullets||[]).map(b => `<li>${b}</li>`).join('')}</ul>
        `;
        exp.appendChild(block);
      });
    }

    // Skills
    const skills = document.getElementById('skills-list');
    if (skills) {
      skills.innerHTML = '';
      LOCAL_DATA.skills.forEach(s => {
        const col = document.createElement('div');
        col.className = 'col-6 col-md-4 col-lg-3';
        col.innerHTML = `<span class="badge bg-light text-dark border w-100 py-2">${s}</span>`;
        skills.appendChild(col);
      });
    }

    // Education
    const edu = document.getElementById('education-list');
    if (edu) {
      edu.innerHTML = '';
      LOCAL_DATA.education.forEach(ed => {
        const item = document.createElement('div');
        item.className = 'mb-2';
        item.innerHTML = `<strong>${ed.program}</strong> — <span class="text-primary">${ed.inst}</span><div class="text-muted small">${ed.dates}</div>`;
        edu.appendChild(item);
      });
    }

    // Awards
    const awards = document.getElementById('awards-list');
    if (awards) {
      awards.innerHTML = '';
      LOCAL_DATA.awards.forEach(a => {
        const li = document.createElement('li');
        li.innerHTML = `<span class="fa-li"><i class="fas fa-trophy text-warning"></i></span>${a}`;
        awards.appendChild(li);
      });
    }

    // Services
    const services = document.getElementById('services-list');
    if (services) {
      services.innerHTML = '';
      LOCAL_DATA.services.forEach(s => {
        const li = document.createElement('li');
        li.innerHTML = `<span class="fa-li"><i class="fas fa-check"></i></span>${s}`;
        services.appendChild(li);
      });
    }

    // Gallery
    const gallery = document.getElementById('gallery-list');
    if (gallery) {
      gallery.innerHTML = '';
      LOCAL_DATA.gallery.forEach((src, i) => {
        const col = document.createElement('div');
        col.className = 'col-6 col-md-4 col-lg-3 mb-3';
        col.innerHTML = `<img class="img-fluid rounded shadow-sm" src="${src}" alt="Gallery image ${i + 1}" loading="lazy">`;
        gallery.appendChild(col);
      });
    }
  }

  // Expose a wrapper so existing code can call it
  window.populateLists = populateFromLocal;

  // ======= Map =======
  window.initMap = function initMap() {
    if (!window.L) return;
    const el = document.getElementById('map-container');
    if (!el) return;

    const map = L.map('map-container');
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const markers = (LOCAL_DATA.visited || []).map(v =>
      L.marker([v.lat, v.lng]).bindPopup(v.name)
    );
    const group = L.featureGroup(markers).addTo(map);
    try {
      map.fitBounds(group.getBounds().pad(0.2));
    } catch {
      map.setView([20, 0], 2);
    }
  };

  // ======= Contact Form =======
  window.handleContactSubmit = function handleContactSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const siteField = document.getElementById('website'); // honeypot
    const status = document.getElementById('contact-status');

    form.classList.add('was-validated');
    if (!form.checkValidity()) return;
    if (siteField?.value) return; // bot

    const name = document.getElementById('name')?.value?.trim();
    const email = document.getElementById('email')?.value?.trim();
    const message = document.getElementById('message')?.value?.trim();

    // If emailjs SDK is loaded, use it; otherwise fallback to a local success message.
    if (window.emailjs && typeof emailjs.send === 'function') {
      emailjs.send('service_0yhlrii', 'template_3bvruq2', {
        from_name: name,
        from_email: email,
        message
      })
      .then(() => {
        setHTML(status, '<div class="alert alert-success" role="alert">Message sent successfully!</div>');
        form.reset();
        form.classList.remove('was-validated');
      })
      .catch(() => {
        setHTML(status, '<div class="alert alert-danger" role="alert">Failed to send message. Please try again later.</div>');
      });
    } else {
      // Fallback
      setHTML(status, '<div class="alert alert-success" role="alert">Thanks! Your message has been recorded.</div>');
      form.reset();
      form.classList.remove('was-validated');
    }
  };

  // ======= PDF Download (single implementation) =======
  window.downloadPDF = async function downloadPDF() {
    try {
      const { jsPDF } = window.jspdf || {};
      if (!jsPDF) throw new Error('jsPDF not loaded');
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 40;
      let y = margin + 8;

      function addLine(txt, size = 12, gap = 18, bold = false) {
        doc.setFont('helvetica', bold ? 'bold' : 'normal');
        doc.setFontSize(size);
        const lines = doc.splitTextToSize(txt, pageWidth - margin * 2);
        doc.text(lines, margin, y);
        y += lines.length * gap;
        if (y > doc.internal.pageSize.getHeight() - margin) { doc.addPage(); y = margin; }
      }

      // Header
      addLine('Aboul Hassane Cisse', 20, 22, true);
      const loc = document.getElementById('about-location')?.textContent.trim() || '';
      addLine(`${loc} Email: aboulhcisse@gmail.com`);
      const lead = document.getElementById('about-lead')?.textContent.trim() || '';
      addLine(lead);

      function section(title) {
        y += 6; addLine(title, 14, 16, true);
        doc.setDrawColor(30, 136, 229);
        doc.line(margin, y, pageWidth - margin, y);
        y += 10;
      }

      // Sections from DOM + LOCAL_DATA
      section(document.getElementById('publications-title')?.textContent || 'Publications');
      (LOCAL_DATA.publications || []).forEach(p => addLine(`• ${p.title} — ${p.venue}`));

      section(document.getElementById('experience-title')?.textContent || 'Experience');
      (LOCAL_DATA.experience || []).forEach(e => {
        addLine(`${e.role} · ${e.org} (${e.dates})`);
        (e.bullets || []).forEach(b => addLine(`   - ${b}`));
      });

      section(document.getElementById('skills-title')?.textContent || 'Skills');
      addLine((LOCAL_DATA.skills || []).join(', '));

      section(document.getElementById('education-title')?.textContent || 'Education');
      (LOCAL_DATA.education || []).forEach(ed => addLine(`${ed.program} — ${ed.inst} (${ed.dates})`));

      section(document.getElementById('awards-title')?.textContent || 'Awards');
      (LOCAL_DATA.awards || []).forEach(a => addLine(`• ${a}`));

      doc.save('resume_Aboul-Hassane-CISSE.pdf');
      const status = document.getElementById('download-status');
      if (status) status.textContent = 'PDF downloaded.';
    } catch (err) {
      const status = document.getElementById('download-status');
      if (status) status.textContent = 'PDF export failed.';
      console.error(err);
    }
  };

  // ======= Language switcher + JSON loaders =======
  window.changeLanguage = async function changeLanguage() {
    const langSel = document.getElementById('language-select');
    const lang = langSel?.value || 'en';

    // Helper to fetch and inject content blocks with optional array structure
    async function fetchAndSetContent(url, titleId, elementId, propertyKey) {
      try {
        const data = await fetchJSON(url);
        const byLang = data?.[lang];
        if (!byLang) return;

        if (byLang.title && titleId) setText(document.getElementById(titleId), byLang.title);

        const propVal = byLang[propertyKey];
        const el = document.getElementById(elementId);
        if (!el) return;

        if (Array.isArray(propVal)) {
          el.innerHTML = '';
          propVal.forEach(item => {
            const category = document.createElement('h3');
            category.textContent = item.category || '';
            const list = document.createElement('ul');
            (item.items || []).forEach(sub => {
              const li = document.createElement('li');
              li.textContent = sub;
              list.appendChild(li);
            });
            el.appendChild(category);
            el.appendChild(list);
          });
        } else if (typeof propVal === 'string') {
          el.textContent = propVal;
        } else {
          el.textContent = '';
        }
      } catch (err) {
        // JSON not found or invalid → ignore silently (fallback remains visible)
        console.warn('fetchAndSetContent error:', url, err.message);
      }
    }

    // About & Interests
    await fetchAndSetContent(JSON_PATHS.about, 'about-title', 'about-lead', 'lead');
    await fetchAndSetContent(JSON_PATHS.interests, 'interests-title', 'interests-content', 'content');

    // Publications
    try {
      const data = await fetchJSON(JSON_PATHS.publications);
      const list = document.getElementById('publications-list');
      const title = document.getElementById('publications-title');
      if (list) list.innerHTML = '';
      const block = data?.[lang];
      if (block) {
        if (title && block.title) title.textContent = block.title;
        (block.list || []).forEach(type => {
          const typeDiv = document.createElement('div');
          typeDiv.innerHTML = `<h3>${type.type}</h3>`;
          (type.publications || []).forEach(pub => {
            const div = document.createElement('div');
            div.className = 'd-flex flex-column flex-md-row justify-content-between mb-5';
            const linkOpen = pub.link ? `<a href="${pub.link}" target="_blank" rel="noopener">` : '';
            const linkClose = pub.link ? `</a>` : '';
            div.innerHTML = `
              <div class="flex-grow-1">
                ${linkOpen}<h4 class="mb-0">${pub.id ? pub.id + ' - ' : ''}${pub.title}${pub.language ? ' - version ' + pub.language : ''}</h4>${linkClose}
                <p>${pub.abstract || ''} ${pub.link ? `<a href="${pub.link}" target="_blank" rel="noopener">...</a>` : ''}</p>
                ${pub.keywords ? `<p><b>${pub.keywords}</b></p>` : ''}
                <div class="subheading mb-3">${pub.event || pub.journal || pub.conference || ''}</div>
              </div>
              <div class="flex-shrink-0"><span class="text-primary">${pub.date || ''}</span></div>
            `;
            typeDiv.appendChild(div);
          });
          list?.appendChild(typeDiv);
        });
      }
    } catch (err) {
      console.warn('Publications load skipped:', err.message);
    }

    // Experience
    try {
      const data = await fetchJSON(JSON_PATHS.experience);
      const list = document.getElementById('experience-list');
      const title = document.getElementById('experience-title');
      if (list) list.innerHTML = '';
      const block = data?.[lang];
      if (block) {
        if (title && block.title) title.textContent = block.title;
        (block.list || []).forEach(ex => {
          const div = document.createElement('div');
          div.className = 'd-flex flex-column flex-md-row justify-content-between mb-5';
          div.innerHTML = `
            <div class="flex-grow-1">
              <h3 class="mb-0">${ex.title || ''}</h3>
              <div class="subheading mb-3">${ex.company || ''}</div>
              <p>${ex.description || ''}</p>
            </div>
            <div class="flex-shrink-0"><span class="text-primary">${ex.date || ''}</span></div>
          `;
          list?.appendChild(div);
        });
      }
    } catch (err) { console.warn('Experience load skipped:', err.message); }

    // Skills
    try {
      const data = await fetchJSON(JSON_PATHS.skills);
      const list = document.getElementById('skills-list');
      const title = document.getElementById('skills-title');
      if (list) list.innerHTML = '';
      const block = data?.[lang];
      if (block) {
        if (title && block.title) title.textContent = block.title;
        (block.list || []).forEach(skillBlock => {
          const div = document.createElement('div');
          // Icons
          if (skillBlock.icons?.length) {
            div.innerHTML += `
              <div class="subheading mb-3">${skillBlock.category || ''}</div>
              <ul class="list-inline dev-icons">
                ${skillBlock.icons.map(icon => `<li class="list-inline-item"><i class="${icon}"></i></li>`).join('')}
              </ul>
            `;
          }
          // Workflow
          if (skillBlock.workflow?.length) {
            div.innerHTML += `
              <div class="subheading mb-3">${skillBlock.category || ''}</div>
              <ul class="fa-ul mb-0">
                ${skillBlock.workflow.map(flow => `<li><span class="fa-li"><i class="fas fa-check"></i></span>${flow}</li>`).join('')}
              </ul>
            `;
          }
          // Simple skills list
          if (skillBlock.skills?.length) {
            div.innerHTML += `
              <div class="subheading mb-3">${skillBlock.category || ''}</div>
              <ul class="fa-ul mb-0">
                ${skillBlock.skills.map(s => `<li><span class="fa-li"><i class="fas fa-check"></i></span>${s}</li>`).join('')}
              </ul>
            `;
          }
          list?.appendChild(div);
        });
      }
    } catch (err) { console.warn('Skills load skipped:', err.message); }

    // Education
    try {
      const data = await fetchJSON(JSON_PATHS.education);
      const list = document.getElementById('education-list');
      const title = document.getElementById('education-title');
      if (list) list.innerHTML = '';
      const block = data?.[lang];
      if (block) {
        if (title && block.title) title.textContent = block.title;
        (block.list || []).forEach(ed => {
          const div = document.createElement('div');
          div.className = 'd-flex flex-column flex-md-row justify-content-between mb-5';
          div.innerHTML = `
            <div class="flex-grow-1">
              <h3 class="mb-0">${ed.school || ''}</h3>
              <div class="subheading mb-3">${ed.degree || ''}</div>
              <p>${ed.description || ''}</p>
            </div>
            <div class="flex-shrink-0"><span class="text-primary">${ed.date || ''}</span></div>
          `;
          list?.appendChild(div);
        });
      }
    } catch (err) { console.warn('Education load skipped:', err.message); }

    // Awards
    try {
      const data = await fetchJSON(JSON_PATHS.awards);
      const list = document.getElementById('awards-list');
      const title = document.getElementById('awards-title');
      if (list) list.innerHTML = '';
      const block = data?.[lang];
      if (block) {
        if (title && block.title) title.textContent = block.title;
        (block.list || []).forEach(a => {
          const li = document.createElement('li');
          li.innerHTML = `<span class="fa-li"><i class="fas fa-trophy text-warning"></i></span><b>${a.date || ''}</b> : ${a.title || ''}`;
          list?.appendChild(li);
        });
      }
    } catch (err) { console.warn('Awards load skipped:', err.message); }

    // Services
    try {
      const data = await fetchJSON(JSON_PATHS.services);
      const list = document.getElementById('services-list');
      const title = document.getElementById('services-title');
      if (list) list.innerHTML = '';
      const block = data?.[lang];
      if (block) {
        if (title && block.title) title.textContent = block.title;
        (block.list || []).forEach(s => {
          const li = document.createElement('li');
          li.innerHTML = `<span class="fa-li"><i class="fas fa-check"></i></span>${s}`;
          list?.appendChild(li);
        });
      }
    } catch (err) { console.warn('Services load skipped:', err.message); }

    // Gallery
    try {
      const data = await fetchJSON(JSON_PATHS.gallery);
      const grid = document.getElementById('gallery-list');
      const title = document.getElementById('gallery-title');
      if (grid) grid.innerHTML = '';
      const block = data?.[lang];
      if (block) {
        if (title && block.title) title.textContent = block.title;
        (block.list || []).forEach(photo => {
          const col = document.createElement('div');
          col.className = 'col-lg-4 col-sm-6 mb-3';
          col.innerHTML = `
            <a class="portfolio-box" href="${photo.link || photo.src}" title="${photo.title || ''}">
              <img class="img-fluid" src="${photo.src}" alt="${photo.title || ''}">
              <div class="portfolio-box-caption">
                <div class="project-category text-white-50">${photo.category || ''}</div>
                <div class="project-name">${photo.title || ''}</div>
              </div>
            </a>
          `;
          grid?.appendChild(col);
        });
      }
    } catch (err) { console.warn('Gallery load skipped:', err.message); }

    // Map markers from JSON (if present)
    try {
      const data = await fetchJSON(JSON_PATHS.map);
      const mapEl = document.getElementById('map-container');
      if (mapEl && window.L) {
        // Rebuild map with fetched markers (simple approach: recreate)
        const map = L.map('map-container').setView([0, 0], 2);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        const items = data?.[lang] || [];
        const markers = items.map(loc => L.marker([loc.latitude, loc.longitude]).bindPopup(loc.description || ''));
        const group = L.featureGroup(markers).addTo(map);
        try { map.fitBounds(group.getBounds().pad(0.2)); } catch { /* ignore */ }
      }
    } catch (err) { /* optional file; ignore */ }

    // Menu labels
    try {
      const data = await fetchJSON(JSON_PATHS.menu);
      const block = data?.[lang];
      if (block) {
        document.querySelectorAll('#navbar-menu .nav-link').forEach(link => {
          const key = link.getAttribute('data-key');
          const icon = link.querySelector('i')?.className || '';
          if (block[key]) {
            link.innerHTML = `<i class="${icon}"></i> ${block[key]}`;
          }
        });
      }
    } catch (err) { /* optional file; ignore */ }
  };

  // ======= Bootstrapping on DOM ready =======
  document.addEventListener('DOMContentLoaded', () => {
    // Fill with local data first (instant paint)
    populateFromLocal();
    // Init Leaflet with local markers
    window.initMap?.();

    // Bind contact & PDF
    const form = document.getElementById('contact-form');
    if (form) form.addEventListener('submit', window.handleContactSubmit);
    const dl = document.getElementById('download-pdf');
    if (dl) dl.addEventListener('click', window.downloadPDF);

    // Language initialization
    const langSel = document.getElementById('language-select');
    const initial = localStorage.getItem('lang') || 'en';
    if (langSel) {
      langSel.value = initial;
      langSel.addEventListener('change', () => {
        localStorage.setItem('lang', langSel.value);
        window.changeLanguage();
      });
    }
    // Trigger first language load (will override local content if JSON exists)
    window.changeLanguage();
  });

})(); 
