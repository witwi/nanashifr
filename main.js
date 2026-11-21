(function () {
  'use strict';

  let currentLang = 'en';
  try {
    const saved = localStorage.getItem('kkersia_lang');
    if (saved === 'ru' || saved === 'en') currentLang = saved;
  } catch (e) {}

  const state = {
    nick: false,
    code: false,
    hardware: false,
    systems: false,
    gaming: false,
    reading: false,
    contacts: false
  };

  const timers = {};

  function getNode(id) {
    const c = SITE_CONTENT[currentLang];
    const map = {
      nick: c.header,
      code: c.intro.code,
      hardware: c.intro.hardware,
      systems: c.intro.hardware.child,
      gaming: c.intro.gaming,
      reading: c.intro.reading,
      contacts: c.contacts
    };
    return map[id];
  }

  function render(animate = false) {
    const app = document.getElementById('app');
    if (!app) return;

    const c = SITE_CONTENT[currentLang];
    document.documentElement.lang = currentLang;

    const contactsHtml = c.contacts.items.map(item => {
      let val = item.url
        ? `<a href="${item.url}" target="_blank" rel="noopener noreferrer" class="contact-val-link ext-link">${item.val}</a>`
        : `<button type="button" class="contact-val-btn" data-copy="${item.val}"><span class="contact-val-text">${item.val}</span></button>`;

      if (item.mailto) {
        val += `<a href="${item.mailto}" class="mailto-link">${c.ui.mailto}</a>`;
      }
      if (item.copy) {
        val += `<span class="copy-feedback-wrap" data-status-for="${item.val}"><span class="copy-hover-hint">${c.ui.copy}</span><span class="copy-done-msg">${c.ui.copied}</span></span>`;
      }
      if (item.note) {
        val += `<span class="contact-note">${item.note}</span>`;
      }

      return `<div class="contact-row"><span class="contact-label">${item.label}</span><span class="contact-sep">—</span><span class="contact-data">${val}</span></div>`;
    }).join('');

    app.innerHTML = `
      <div class="page-container ${animate ? '' : 'no-anim'}">
        <header class="site-header intro-line">
          <h1 class="site-title">
            <button type="button" class="trigger inline-trigger" data-node="${c.header.id}">${c.header.trigger}</button><span class="stretch-inline" data-slot="${c.header.id}"></span>
          </h1>
          <div class="lang-switch" aria-label="Language switcher">
            <button type="button" class="lang-btn ${currentLang === 'en' ? 'active' : ''}" data-lang="en">en</button>
            <span class="lang-sep">/</span>
            <button type="button" class="lang-btn ${currentLang === 'ru' ? 'active' : ''}" data-lang="ru">ru</button>
          </div>
        </header>

        <section class="main-content-section">
          <p class="lead-paragraph intro-line">
            ${c.intro.lead}<button type="button" class="trigger inline-trigger" data-node="${c.intro.code.id}">${c.intro.code.trigger}</button><span class="stretch-inline" data-slot="${c.intro.code.id}"></span>${c.intro.mid1}<button type="button" class="trigger block-trigger" data-node="${c.intro.hardware.id}">${c.intro.hardware.trigger}</button>${c.intro.mid2}<span class="no-break"><button type="button" class="trigger block-trigger" data-node="${c.intro.gaming.id}">${c.intro.gaming.trigger}</button>${c.intro.punctGaming}</span>${c.intro.mid3}<span class="no-break"><button type="button" class="trigger block-trigger" data-node="${c.intro.reading.id}">${c.intro.reading.trigger}</button>${c.intro.end}</span>
          </p>

          <div class="blocks-stack">
            <div class="stretch-block" data-block="${c.intro.hardware.id}">
              <div class="stretch-block-inner">
                ${c.intro.hardware.lead}<button type="button" class="trigger inline-trigger" data-node="${c.intro.hardware.child.id}">${c.intro.hardware.child.trigger}</button><span class="stretch-inline" data-slot="${c.intro.hardware.child.id}"></span>${c.intro.hardware.tail}
              </div>
            </div>

            <div class="stretch-block" data-block="${c.intro.gaming.id}">
              <div class="stretch-block-inner">
                ${c.intro.gaming.lead}<a href="${c.intro.gaming.link.url}" target="_blank" rel="noopener noreferrer" class="ext-link">${c.intro.gaming.link.text}</a>${c.intro.gaming.tail}
              </div>
            </div>

            <div class="stretch-block" data-block="${c.intro.reading.id}">
              <div class="stretch-block-inner">
                ${c.intro.reading.lead}<a href="${c.intro.reading.link.url}" target="_blank" rel="noopener noreferrer" class="ext-link">${c.intro.reading.link.text}</a>${c.intro.reading.tail}
              </div>
            </div>
          </div>
        </section>

        <section class="contacts-section">
          <p class="contacts-lead-paragraph intro-line">
            <span class="no-break"><button type="button" class="trigger block-trigger" data-node="contacts">${c.contacts.trigger}</button></span>
          </p>
          <div class="blocks-stack">
            <div class="stretch-block" data-block="contacts">
              <div class="stretch-block-inner">
                <div class="contacts-ls-container">${contactsHtml}</div>
              </div>
            </div>
          </div>
        </section>

        <footer class="service-footer intro-line">
          <span class="footer-counter">(<span id="expanded-count">0</span> / <span id="total-count">7</span>)</span>
          <span class="footer-sep">·</span>
          <button type="button" class="action-link" id="btn-expand-all">${c.ui.expandAll}</button>
          <span class="footer-sep">·</span>
          <button type="button" class="action-link" id="btn-collapse-all">${c.ui.collapse}</button>
        </footer>
      </div>
    `;

    sync();
  }

  function sync() {
    for (const [id, on] of Object.entries(state)) {
      document.querySelectorAll(`button.trigger[data-node="${id}"]`).forEach(b => b.classList.toggle('is-expanded', on));
      const slot = document.querySelector(`[data-slot="${id}"]`);
      if (slot) slot.textContent = on ? getNode(id).text : '';
      const block = document.querySelector(`[data-block="${id}"]`);
      if (block) block.classList.toggle('is-expanded', on);
    }

    const count = Object.values(state).filter(Boolean).length;
    const total = Object.keys(state).length;
    const countEl = document.getElementById('expanded-count');
    const totalEl = document.getElementById('total-count');
    const btnExpand = document.getElementById('btn-expand-all');
    const btnCollapse = document.getElementById('btn-collapse-all');

    if (countEl) countEl.textContent = count;
    if (totalEl) totalEl.textContent = total;
    if (btnExpand) btnExpand.classList.toggle('is-disabled', count === total);
    if (btnCollapse) btnCollapse.classList.toggle('is-disabled', count === 0);
  }

  function typeText(id) {
    const slot = document.querySelector(`[data-slot="${id}"]`);
    if (!slot) return;
    clearInterval(timers[id]);
    const str = getNode(id).text;
    let i = 0;
    slot.textContent = '';
    timers[id] = setInterval(() => {
      slot.textContent = str.slice(0, ++i);
      if (i >= str.length) clearInterval(timers[id]);
    }, 8.5);
  }

  function expand(id) {
    if (state[id]) return;
    state[id] = true;
    const node = getNode(id);
    document.querySelectorAll(`button.trigger[data-node="${id}"]`).forEach(b => b.classList.add('is-expanded'));
    if (node.type === 'inline') {
      typeText(id);
    } else {
      const block = document.querySelector(`[data-block="${id}"]`);
      if (block) block.classList.add('is-expanded');
    }
    sync();
  }

  function collapse(id) {
    if (!state[id]) return;
    state[id] = false;
    clearInterval(timers[id]);
    const node = getNode(id);
    document.querySelectorAll(`button.trigger[data-node="${id}"]`).forEach(b => b.classList.remove('is-expanded'));
    if (node.type === 'inline') {
      const slot = document.querySelector(`[data-slot="${id}"]`);
      if (slot) slot.textContent = '';
    } else {
      const block = document.querySelector(`[data-block="${id}"]`);
      if (block) block.classList.remove('is-expanded');
      if (id === 'hardware' && state.systems) collapse('systems');
    }
    sync();
  }

  function toggle(id) {
    if (state[id]) collapse(id);
    else expand(id);
  }

  function expandAll() {
    Object.keys(state).forEach(id => expand(id));
  }

  function collapseAll() {
    Object.keys(state).forEach(id => collapse(id));
  }

  function switchLang(lang) {
    if (lang === currentLang || (lang !== 'en' && lang !== 'ru')) return;
    currentLang = lang;
    try {
      localStorage.setItem('kkersia_lang', lang);
    } catch (e) {}
    Object.keys(timers).forEach(id => clearInterval(timers[id]));
    render(false);
  }

  function copy(text, el) {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(text).then(() => {
      if (!el) return;
      el.classList.add('is-copied');
      clearTimeout(el._t);
      el._t = setTimeout(() => el.classList.remove('is-copied'), 1500);
    });
  }

  function bind() {
    const app = document.getElementById('app');
    if (!app) return;

    app.addEventListener('click', (e) => {
      const langBtn = e.target.closest('button.lang-btn');
      if (langBtn) {
        switchLang(langBtn.getAttribute('data-lang'));
        return;
      }

      const triggerBtn = e.target.closest('button.trigger');
      if (triggerBtn) {
        toggle(triggerBtn.getAttribute('data-node'));
        return;
      }

      const copyBtn = e.target.closest('button.contact-val-btn');
      if (copyBtn) {
        const val = copyBtn.getAttribute('data-copy');
        if (val) {
          const wrap = copyBtn.parentElement.querySelector(`[data-status-for="${val}"]`);
          copy(val, wrap);
        }
        return;
      }

      if (e.target.closest('#btn-expand-all')) {
        expandAll();
        return;
      }

      if (e.target.closest('#btn-collapse-all')) {
        collapseAll();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') collapseAll();
    });
  }

  function init() {
    render(true);
    bind();
    setTimeout(() => {
      const c = document.querySelector('.page-container');
      if (c) c.classList.add('no-anim');
    }, 600);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
