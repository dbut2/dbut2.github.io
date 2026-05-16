/* photo-gallery — lightbox with zoom, pan and a fixed EXIF panel.
   Reads per-photo data from [data-pg-item] elements emitted by the layout.
   The full-size original is shown directly, so right-click → "Save image"
   downloads the original file. Close with Escape or by clicking the backdrop. */
(function () {
  'use strict';

  var items = [].slice.call(document.querySelectorAll('[data-pg-item]'));
  if (!items.length) return;

  var photos = items.map(function (el) {
    var exif = {};
    try { exif = JSON.parse(el.getAttribute('data-exif') || '{}') || {}; } catch (e) {}
    return {
      full: el.getAttribute('data-full'),
      name: el.getAttribute('data-name') || 'photo',
      w: parseInt(el.getAttribute('data-w'), 10) || 0,
      h: parseInt(el.getAttribute('data-h'), 10) || 0,
      exif: exif
    };
  });

  /* ---- build the lightbox once ---- */
  var lb = document.createElement('div');
  lb.className = 'pg-lb';
  lb.hidden = true;
  lb.innerHTML =
    '<div class="pg-lb__stage" data-stage><img class="pg-lb__img" data-img alt=""></div>' +
    '<button class="pg-lb__nav pg-lb__nav--prev" data-prev aria-label="previous photo">‹</button>' +
    '<button class="pg-lb__nav pg-lb__nav--next" data-next aria-label="next photo">›</button>' +
    '<div class="pg-lb__bar">' +
      '<span class="pg-lb__idx" data-idx></span>' +
      '<span class="pg-lb__name" data-name></span>' +
      '<span class="pg-lb__spacer"></span>' +
      '<span class="pg-lb__zoom" data-zoom hidden></span>' +
    '</div>' +
    '<aside class="pg-lb__exif" data-exif></aside>';
  document.body.appendChild(lb);

  var stage  = lb.querySelector('[data-stage]');
  var img    = lb.querySelector('[data-img]');
  var elIdx  = lb.querySelector('[data-idx]');
  var elName = lb.querySelector('[data-name]');
  var elZoom = lb.querySelector('[data-zoom]');
  var elExif = lb.querySelector('[data-exif]');

  var cur = 0;
  var view = { scale: 1, x: 0, y: 0 };
  var MIN = 1, MAX = 6;

  /* ---- value formatting ---- */
  function evalNum(v) {
    if (v == null || v === '') return null;
    if (typeof v === 'number') return v;
    var s = String(v);
    if (s.indexOf('/') > -1) {
      var p = s.split('/');
      var d = parseFloat(p[1]);
      return d ? parseFloat(p[0]) / d : parseFloat(p[0]);
    }
    var n = parseFloat(s);
    return isNaN(n) ? null : n;
  }
  function round1(v) { return Math.round(v * 10) / 10; }
  function fmtShutter(v) {
    if (v == null || v === '') return null;
    if (typeof v === 'string') return v;
    if (v >= 1) return round1(v) + '"';
    return '1/' + Math.round(1 / v);
  }
  function cameraName(e) {
    var mk = (e.make || '').trim();
    var md = (e.model || '').trim();
    if (md && mk && md.toLowerCase().indexOf(mk.toLowerCase()) === 0) return md;
    return [mk, md].filter(Boolean).join(' ');
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function renderExif(p) {
    var e = p.exif || {};
    var cam = e.gearCamera || cameraName(e);
    var lens = e.gearLens || e.lens;

    var settings = [];
    var f = evalNum(e.focal);
    if (f != null) settings.push(round1(f) + 'mm');
    var fn = evalNum(e.fnumber);
    if (fn != null) settings.push('ƒ/' + round1(fn));
    var sh = fmtShutter(e.exposure);
    if (sh) settings.push(sh);
    var iso = evalNum(e.iso);
    if (iso != null) settings.push('ISO ' + Math.round(iso));

    var rows = [];
    if (cam) rows.push(['camera', cam]);
    if (e.gearFilm) rows.push(['film', e.gearFilm]);
    if (lens) rows.push(['lens', lens]);
    var f35 = evalNum(e.focal35);
    if (f35 && (f == null || Math.round(f35) !== Math.round(f))) {
      rows.push(['35mm equiv', round1(f35) + 'mm']);
    }
    if (e.date) rows.push(['taken', e.date]);
    if (p.w && p.h) rows.push(['dimensions', p.w + ' × ' + p.h + ' px']);

    var html = '<h3>' + esc(p.name) + '</h3>';
    if (settings.length) {
      html += '<div class="pg-lb__settings">' + esc(settings.join(' · ')) + '</div>';
    }
    if (rows.length || e.lat || e.long) {
      html += '<dl>';
      rows.forEach(function (r) {
        html += '<dt>' + r[0] + '</dt><dd>' + esc(r[1]) + '</dd>';
      });
      if (e.lat || e.long) {
        html += '<dt>location</dt><dd><a href="https://maps.google.com/?q=' +
          encodeURIComponent(e.lat + ',' + e.long) +
          '" target="_blank" rel="noopener">open map</a></dd>';
      }
      html += '</dl>';
    } else if (!settings.length) {
      html += '<p class="pg-lb__empty">no exif metadata embedded in this image.</p>';
    }
    elExif.innerHTML = html;
  }

  /* ---- zoom + pan ---- */
  function applyView() {
    img.style.transform =
      'translate(' + view.x + 'px,' + view.y + 'px) scale(' + view.scale + ')';
    var zoomed = view.scale > 1.01;
    elZoom.textContent = Math.round(view.scale * 100) + '%';
    elZoom.hidden = !zoomed;
    stage.classList.toggle('is-zoomed', zoomed);
    lb.classList.toggle('is-zoomed', zoomed);
  }
  function resetView() {
    view.scale = 1; view.x = 0; view.y = 0;
    applyView();
  }
  function clampPan() {
    var r = img.getBoundingClientRect();
    var maxX = Math.max(0, (r.width - stage.clientWidth) / 2 + 60);
    var maxY = Math.max(0, (r.height - stage.clientHeight) / 2 + 60);
    view.x = Math.max(-maxX, Math.min(maxX, view.x));
    view.y = Math.max(-maxY, Math.min(maxY, view.y));
  }
  function zoomTo(scale, px, py) {
    scale = Math.max(MIN, Math.min(MAX, scale));
    var rect = stage.getBoundingClientRect();
    var ox = px - rect.left - rect.width / 2;
    var oy = py - rect.top - rect.height / 2;
    var ratio = scale / view.scale;
    view.x = ox - (ox - view.x) * ratio;
    view.y = oy - (oy - view.y) * ratio;
    view.scale = scale;
    if (scale <= MIN) { view.x = 0; view.y = 0; }
    clampPan();
    applyView();
  }
  function zoomCentre(scale) {
    var r = stage.getBoundingClientRect();
    zoomTo(scale, r.left + r.width / 2, r.top + r.height / 2);
  }

  /* ---- show + navigate ---- */
  function show(i) {
    var n = photos.length;
    cur = ((i % n) + n) % n;
    var p = photos[cur];
    resetView();
    img.style.opacity = '0';
    img.src = p.full;
    img.alt = p.name;
    elIdx.textContent = (cur + 1) + ' / ' + n;
    elName.textContent = p.name;
    renderExif(p);
    preload(cur + 1);
    preload(cur - 1);
  }
  function preload(i) {
    var n = photos.length;
    new Image().src = photos[((i % n) + n) % n].full;
  }
  function step(d) { show(cur + d); }

  function open(i) {
    lb.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    show(i);
    requestAnimationFrame(function () { lb.classList.add('is-open'); });
  }
  function close() {
    lb.classList.remove('is-open');
    document.documentElement.style.overflow = '';
    window.setTimeout(function () {
      lb.hidden = true;
      img.src = '';
    }, 240);
  }

  img.addEventListener('load', function () { img.style.opacity = '1'; });

  /* ---- wiring ---- */
  items.forEach(function (el, i) {
    el.addEventListener('click', function () { open(i); });
  });
  lb.querySelector('[data-prev]').addEventListener('click', function () { step(-1); });
  lb.querySelector('[data-next]').addEventListener('click', function () { step(1); });

  stage.addEventListener('wheel', function (e) {
    e.preventDefault();
    zoomTo(view.scale * (e.deltaY < 0 ? 1.2 : 1 / 1.2), e.clientX, e.clientY);
  }, { passive: false });

  stage.addEventListener('dblclick', function (e) {
    if (view.scale > 1.01) resetView();
    else zoomTo(2.6, e.clientX, e.clientY);
  });

  /* click the backdrop (not the image) to close, when not zoomed */
  stage.addEventListener('click', function (e) {
    if (e.target === stage && view.scale <= 1.01) close();
  });

  /* mouse drag to pan when zoomed — left button only, so right-click
     keeps the native "Save image as…" context menu */
  var drag = null;
  stage.addEventListener('mousedown', function (e) {
    if (e.button !== 0 || view.scale <= 1.01) return;
    e.preventDefault();
    drag = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y };
    stage.classList.add('is-grabbing');
    img.classList.add('is-panning');
  });
  window.addEventListener('mousemove', function (e) {
    if (!drag) return;
    view.x = drag.vx + (e.clientX - drag.x);
    view.y = drag.vy + (e.clientY - drag.y);
    clampPan();
    applyView();
  });
  window.addEventListener('mouseup', function () {
    if (!drag) return;
    drag = null;
    stage.classList.remove('is-grabbing');
    img.classList.remove('is-panning');
  });

  /* touch: swipe to navigate, drag to pan, pinch to zoom */
  var touch = null;
  function tdist(t) {
    return Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
  }
  function tmid(t) {
    return { x: (t[0].clientX + t[1].clientX) / 2, y: (t[0].clientY + t[1].clientY) / 2 };
  }
  stage.addEventListener('touchstart', function (e) {
    if (e.touches.length === 2) {
      touch = { mode: 'pinch', d: tdist(e.touches), s: view.scale };
    } else if (e.touches.length === 1) {
      touch = {
        mode: view.scale > 1.01 ? 'pan' : 'swipe',
        x: e.touches[0].clientX, y: e.touches[0].clientY,
        vx: view.x, vy: view.y, t: Date.now(), target: e.target
      };
    }
  }, { passive: true });
  stage.addEventListener('touchmove', function (e) {
    if (!touch) return;
    if (touch.mode === 'pinch' && e.touches.length === 2) {
      e.preventDefault();
      var m = tmid(e.touches);
      zoomTo(touch.s * (tdist(e.touches) / touch.d), m.x, m.y);
      img.classList.add('is-panning');
    } else if (touch.mode === 'pan' && e.touches.length === 1) {
      e.preventDefault();
      view.x = touch.vx + (e.touches[0].clientX - touch.x);
      view.y = touch.vy + (e.touches[0].clientY - touch.y);
      clampPan();
      applyView();
      img.classList.add('is-panning');
    }
  }, { passive: false });
  stage.addEventListener('touchend', function (e) {
    if (!touch) return;
    img.classList.remove('is-panning');
    if (touch.mode === 'swipe') {
      var dx = e.changedTouches[0].clientX - touch.x;
      var dy = e.changedTouches[0].clientY - touch.y;
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.6) {
        step(dx < 0 ? 1 : -1);
      } else if (Math.abs(dx) < 12 && Math.abs(dy) < 12 &&
                 Date.now() - touch.t < 320 && touch.target === stage) {
        close();
      }
    }
    if (view.scale <= 1.01) resetView();
    touch = null;
  }, { passive: true });

  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'ArrowRight') step(1);
    else if (e.key === '+' || e.key === '=') zoomCentre(view.scale * 1.5);
    else if (e.key === '-' || e.key === '_') zoomCentre(view.scale / 1.5);
    else if (e.key === '0') resetView();
  });
})();
