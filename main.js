const TRACKS = [
  'assets/audio/mural_world.mp3',
  'assets/audio/dreaming.mp3',
  'assets/audio/monochrome_world.mp3',
  'assets/audio/the_docks.mp3'
];

const BG_IMAGE_SRC = 'assets/hudf.webp';

const INLINE_TICK_MS = 18;
const INLINE_CHARS_PER_TICK = 3;

(function () {
  'use strict';

  let currentLang = 'en';
  try {
    const saved = localStorage.getItem('kkersia_lang');
    if (saved === 'ru' || saved === 'en') currentLang = saved;
  } catch (e) { }

  let isMuted = false;
  try {
    if (sessionStorage.getItem('kkersia_muted') === '1') {
      sessionStorage.removeItem('kkersia_muted');
    }
    isMuted = sessionStorage.getItem('kkersia_muted') === 'true';
  } catch (e) { }

  const state = {
    nick: false,
    code: false,
    hardware: false,
    systems: false,
    gaming: false,
    reading: false,
    contacts: false
  };

  const inlineRafs = {};
  const audio = new Audio();
  audio.loop = true;
  audio.onerror = (err) => console.warn('Audio playback error:', err);

  let lastTrackIdx = -1;
  let fadeInterval = null;
  let hudfPreloaded = false;

  function pickTrack() {
    if (TRACKS.length <= 1) return TRACKS[0];
    let idx;
    do {
      idx = Math.floor(Math.random() * TRACKS.length);
    } while (idx === lastTrackIdx);
    lastTrackIdx = idx;
    return TRACKS[idx];
  }

  function preloadHudf() {
    if (hudfPreloaded) return;
    hudfPreloaded = true;
    const img = document.getElementById('bg-hudf');
    if (!img) return;
    img.src = BG_IMAGE_SRC;
    img.onerror = () => {
      if (img.src.includes('.webp')) {
        img.src = 'assets/hudf.jpg';
      }
    };
  }

  function fadeInAudio() {
    if (isMuted) return;
    clearInterval(fadeInterval);
    const startVol = audio.volume;
    const targetVol = 0.45;
    const startTime = performance.now();
    const duration = 2000;

    fadeInterval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      audio.volume = startVol + (targetVol - startVol) * progress;
      if (progress >= 1) {
        clearInterval(fadeInterval);
        fadeInterval = null;
      }
    }, 40);
  }

  function fadeOutAudio(onComplete) {
    clearInterval(fadeInterval);
    const startVol = audio.volume;
    const startTime = performance.now();
    const duration = 1000;

    fadeInterval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      audio.volume = Math.max(0, startVol * (1 - progress));
      if (progress >= 1) {
        clearInterval(fadeInterval);
        fadeInterval = null;
        audio.pause();
        if (onComplete) onComplete();
      }
    }, 40);
  }

  function startAmbient() {
    preloadHudf();
    document.body.classList.add('space-active');
    const bg = document.getElementById('bg-hudf');
    if (bg) bg.classList.add('is-visible');
    const layer = document.querySelector('.bg-layer');
    if (layer) layer.classList.add('is-visible');

    if (!isMuted) {
      const nextTrack = pickTrack();
      if (!audio.src || !audio.src.endsWith(nextTrack)) {
        audio.src = nextTrack;
      }
      audio.currentTime = 0;
      audio.volume = 0;
      audio.play().catch(err => console.warn('Audio play error:', err));
      fadeInAudio();
    }
  }

  function stopAmbient() {
    document.body.classList.remove('space-active');
    const bg = document.getElementById('bg-hudf');
    if (bg) bg.classList.remove('is-visible');
    const layer = document.querySelector('.bg-layer');
    if (layer) layer.classList.remove('is-visible');
    fadeOutAudio();
  }

  function getNode(id) {
    const c = SITE_CONTENT[currentLang];
    const map = {
      nick: c.header,
      code: c.intro.code,
      hardware: c.intro.hardware || null,
      systems: c.intro.hardware ? c.intro.hardware.child : (c.intro.code.child || null),
      gaming: c.intro.gaming,
      reading: c.intro.reading,
      contacts: c.contacts
    };
    return map[id] || null;
  }

  function render(animate = false) {
    const app = document.getElementById('app');
    if (!app) return;

    const c = SITE_CONTENT[currentLang];
    document.documentElement.lang = currentLang;

    const codeTriggerHtml = c.intro.code.type === 'block'
      ? `<button type="button" class="trigger block-trigger" data-node="${c.intro.code.id}">${c.intro.code.trigger}</button>`
      : `<button type="button" class="trigger inline-trigger" data-node="${c.intro.code.id}">${c.intro.code.trigger}</button><span class="stretch-inline" data-slot="${c.intro.code.id}"></span>`;

    const codeBlockHtml = c.intro.code.type === 'block'
      ? `<div class="stretch-block" data-block="${c.intro.code.id}">
              <div class="stretch-block-inner">
                ${c.intro.code.lead}<button type="button" class="trigger inline-trigger" data-node="${c.intro.code.child.id}">${c.intro.code.child.trigger}</button><span class="stretch-inline" data-slot="${c.intro.code.child.id}"></span>${c.intro.code.tail}
              </div>
            </div>`
      : '';

    const thirdSlotHtml = c.intro.hardware
      ? `<button type="button" class="trigger block-trigger" data-node="${c.intro.hardware.id}">${c.intro.hardware.trigger}</button>`
      : '';

    const hardwareBlockHtml = c.intro.hardware
      ? `<div class="stretch-block" data-block="${c.intro.hardware.id}">
              <div class="stretch-block-inner">
                ${c.intro.hardware.lead}<button type="button" class="trigger inline-trigger" data-node="${c.intro.hardware.child.id}">${c.intro.hardware.child.trigger}</button><span class="stretch-inline" data-slot="${c.intro.hardware.child.id}"></span>${c.intro.hardware.tail}
              </div>
            </div>`
      : '';

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
            ${c.intro.lead}${codeTriggerHtml}${c.intro.mid1}${thirdSlotHtml}${c.intro.mid2}<span class="no-break"><button type="button" class="trigger block-trigger" data-node="${c.intro.gaming.id}">${c.intro.gaming.trigger}</button>${c.intro.punctGaming}</span>${c.intro.mid3}<span class="no-break"><button type="button" class="trigger block-trigger" data-node="${c.intro.reading.id}">${c.intro.reading.trigger}</button>${c.intro.end}</span>
          </p>

          <div class="blocks-stack">
            ${codeBlockHtml}
            ${hardwareBlockHtml}

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
          <span id="mute-section" class="mute-section" style="display: none;">
            <span class="footer-sep">·</span>
            <button type="button" class="action-link" id="btn-mute"></button>
          </span>
        </footer>
      </div>
    `;

    for (const [id, on] of Object.entries(state)) {
      if (on) {
        const node = getNode(id);
        if (node && node.type === 'inline') {
          const slot = document.querySelector(`[data-slot="${id}"]`);
          if (slot) {
            const chars = Array.from(node.text);
            slot.innerHTML = chars.map(ch => `<span class="inline-char is-visible">${escapeHtmlChar(ch)}</span>`).join('');
          }
        }
      }
    }

    sync();
  }

  function sync() {
    for (const [id, on] of Object.entries(state)) {
      document.querySelectorAll(`button.trigger[data-node="${id}"]`).forEach(b => b.classList.toggle('is-expanded', on));
      const block = document.querySelector(`[data-block="${id}"]`);
      if (block) block.classList.toggle('is-expanded', on);
    }

    const c = SITE_CONTENT[currentLang];
    const activeIds = Object.keys(state).filter(id => Boolean(getNode(id)));
    const count = activeIds.filter(id => state[id]).length;
    const total = activeIds.length;
    const countEl = document.getElementById('expanded-count');
    const totalEl = document.getElementById('total-count');
    const btnExpand = document.getElementById('btn-expand-all');
    const btnCollapse = document.getElementById('btn-collapse-all');
    const muteSection = document.getElementById('mute-section');
    const btnMute = document.getElementById('btn-mute');

    if (countEl) countEl.textContent = count;
    if (totalEl) totalEl.textContent = total;
    if (btnExpand) btnExpand.classList.toggle('is-disabled', count === total);
    if (btnCollapse) btnCollapse.classList.toggle('is-disabled', count === 0);

    if (muteSection && btnMute) {
      if (state.contacts) {
        muteSection.style.display = 'inline-flex';
        btnMute.textContent = isMuted ? c.ui.unmute : c.ui.mute;
      } else {
        muteSection.style.display = 'none';
      }
    }
  }

  function escapeHtmlChar(c) {
    if (c === '&') return '&amp;';
    if (c === '<') return '&lt;';
    if (c === '>') return '&gt;';
    if (c === '"') return '&quot;';
    return c;
  }

  function expand(id) {
    const node = getNode(id);
    if (!node || state[id]) return;
    state[id] = true;
    if (inlineRafs[id]) {
      cancelAnimationFrame(inlineRafs[id]);
      delete inlineRafs[id];
    }
    document.querySelectorAll(`button.trigger[data-node="${id}"]`).forEach(b => b.classList.add('is-expanded'));
    if (node.type === 'inline') {
      const slot = document.querySelector(`[data-slot="${id}"]`);
      if (slot) {
        const chars = Array.from(node.text);
        const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) {
          slot.innerHTML = chars.map(ch => `<span class="inline-char is-visible">${escapeHtmlChar(ch)}</span>`).join('');
        } else {
          slot.innerHTML = chars.map(ch => `<span class="inline-char">${escapeHtmlChar(ch)}</span>`).join('');
          const spans = slot.querySelectorAll('.inline-char');
          const total = spans.length;
          const msPerChar = INLINE_TICK_MS / INLINE_CHARS_PER_TICK;
          let shown = 0;
          let startTime = null;

          function printStep(now) {
            if (startTime === null) startTime = now;
            const elapsed = now - startTime;
            const target = Math.min(total, INLINE_CHARS_PER_TICK + Math.floor(elapsed / msPerChar));
            while (shown < target) {
              spans[shown++].classList.add('is-visible');
            }
            if (shown < total) {
              inlineRafs[id] = requestAnimationFrame(printStep);
            } else {
              delete inlineRafs[id];
            }
          }
          inlineRafs[id] = requestAnimationFrame(printStep);
        }
      }
    } else {
      const block = document.querySelector(`[data-block="${id}"]`);
      if (block) block.classList.add('is-expanded');
      if (id === 'contacts') startAmbient();
    }
    sync();
  }

  function collapse(id) {
    const node = getNode(id);
    if (!node || !state[id]) return;
    state[id] = false;
    if (inlineRafs[id]) {
      cancelAnimationFrame(inlineRafs[id]);
      delete inlineRafs[id];
    }
    document.querySelectorAll(`button.trigger[data-node="${id}"]`).forEach(b => b.classList.remove('is-expanded'));
    if (node.type === 'inline') {
      const slot = document.querySelector(`[data-slot="${id}"]`);
      if (slot) {
        const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) {
          slot.innerHTML = '';
        } else {
          const spans = slot.querySelectorAll('.inline-char.is-visible');
          let remaining = spans.length;
          if (remaining === 0) {
            slot.innerHTML = '';
          } else {
            const eraseBatch = Math.max(8, Math.ceil(remaining / 5));
            function eraseStep() {
              const count = Math.min(eraseBatch, remaining);
              for (let i = 0; i < count; i++) {
                remaining--;
                spans[remaining].classList.remove('is-visible');
              }
              if (remaining > 0) {
                inlineRafs[id] = requestAnimationFrame(eraseStep);
              } else {
                slot.innerHTML = '';
                delete inlineRafs[id];
              }
            }
            inlineRafs[id] = requestAnimationFrame(eraseStep);
          }
        }
      }
    } else {
      const block = document.querySelector(`[data-block="${id}"]`);
      if (block) block.classList.remove('is-expanded');
      if (node.child && state[node.child.id]) collapse(node.child.id);
      if (id === 'contacts') stopAmbient();
    }
    sync();
  }

  function toggle(id) {
    if (state[id]) collapse(id);
    else expand(id);
  }

  function expandAll() {
    Object.keys(state).forEach(id => {
      if (getNode(id)) expand(id);
    });
  }

  function collapseAll() {
    Object.keys(state).forEach(id => {
      if (getNode(id)) collapse(id);
    });
  }

  function switchLang(lang) {
    if (lang === currentLang || (lang !== 'en' && lang !== 'ru')) return;
    currentLang = lang;
    try {
      localStorage.setItem('kkersia_lang', lang);
    } catch (e) {}
    for (const id in inlineRafs) {
      cancelAnimationFrame(inlineRafs[id]);
      delete inlineRafs[id];
    }
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

    app.addEventListener('pointerenter', (e) => {
      if (e.target && e.target.closest && e.target.closest('button.trigger[data-node="contacts"]')) {
        preloadHudf();
      }
    }, true);

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

      const muteBtn = e.target.closest('#btn-mute');
      if (muteBtn) {
        isMuted = !isMuted;
        try {
          sessionStorage.setItem('kkersia_muted', isMuted ? 'true' : 'false');
        } catch (err) { }

        if (isMuted) {
          fadeOutAudio();
        } else if (state.contacts) {
          if (!audio.src || audio.paused) {
            const nextTrack = pickTrack();
            if (!audio.src.endsWith(nextTrack)) audio.src = nextTrack;
            audio.currentTime = 0;
            audio.volume = 0;
            audio.play().catch(err => console.warn('Audio play error:', err));
          }
          fadeInAudio();
        }
        sync();
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
