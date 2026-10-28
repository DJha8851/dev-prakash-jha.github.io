(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobile nav ---------- */
  var toggle = document.getElementById('mnavToggle');
  var navlist = document.getElementById('navlist');
  toggle.addEventListener('click', function () {
    var open = navlist.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  navlist.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { navlist.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); });
  });

  /* ---------- Topbar state + active link ---------- */
  var topbar = document.getElementById('topbar');
  function onScroll() { topbar.classList.toggle('scrolled', window.scrollY > 12); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  var links = document.querySelectorAll('.navlist a[href^="#"]');
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (l) { l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (s) { spy.observe(s); });

    var rev = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); rev.unobserve(e.target); } });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { rev.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Tabs (CV) ---------- */
  document.querySelectorAll('.tabs').forEach(function (group) {
    var btns = group.querySelectorAll('.tab-btn');
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        btns.forEach(function (b) {
          b.classList.remove('active');
          var p = document.getElementById(b.dataset.tab); if (p) p.classList.remove('active');
        });
        btn.classList.add('active');
        var t = document.getElementById(btn.dataset.tab); if (t) t.classList.add('active');
      });
    });
  });

  /* ---------- Publication filters ---------- */
  var chips = document.querySelectorAll('.filters .chip');
  var pubs = document.querySelectorAll('.pub');
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      chips.forEach(function (x) { x.classList.remove('active'); });
      c.classList.add('active');
      var f = c.dataset.filter;
      pubs.forEach(function (p) { p.classList.toggle('hide', f !== 'all' && p.dataset.theme !== f); });
    });
  });

  /* ---------- Gallery lightbox ---------- */
  var grid = document.getElementById('galleryGrid');
  if (grid) {
    var lb = document.createElement('div'); lb.className = 'lightbox'; lb.innerHTML = '<img alt="">';
    document.body.appendChild(lb);
    grid.addEventListener('click', function (e) {
      var img = e.target.closest('figure') && e.target.closest('figure').querySelector('img');
      if (img) { lb.firstChild.src = img.src; lb.firstChild.alt = img.alt; lb.classList.add('open'); }
    });
    lb.addEventListener('click', function () { lb.classList.remove('open'); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') lb.classList.remove('open'); });
    grid.querySelectorAll('img').forEach(function (im) { im.addEventListener('error', function () { im.closest('figure').remove(); }); });
  }

  /* ---------- helpers ---------- */
  function fit(canvas) {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = canvas.clientWidth, h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    var ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx: ctx, w: w, h: h };
  }

  /* ---------- Background: feed-forward neural network with signal pulses ---------- */
  (function bgNetwork() {
    var canvas = document.getElementById('bgnet');
    var W, H, ctx, layers, edges, pulses;
    var counts = [4, 7, 9, 9, 7, 3];

    function build() {
      var f = fit(canvas); ctx = f.ctx; W = f.w; H = f.h;
      var mobile = W < 700;
      var cs = mobile ? [3, 5, 6, 6, 5, 2] : counts;
      layers = []; edges = []; pulses = [];
      var padX = W * 0.04;
      cs.forEach(function (n, li) {
        var x = padX + (W - 2 * padX) * (li / (cs.length - 1));
        var layer = [];
        for (var i = 0; i < n; i++) {
          var y = H * (0.12 + 0.76 * ((i + 0.5) / n)) + (Math.random() - 0.5) * 24;
          layer.push({ x: x + (Math.random() - 0.5) * 30, y: y, r: 1.6 + Math.random() * 1.4, ph: Math.random() * 6.28 });
        }
        layers.push(layer);
      });
      for (var l = 0; l < layers.length - 1; l++) {
        layers[l].forEach(function (a) {
          layers[l + 1].forEach(function (b) { if (Math.random() < 0.55) edges.push({ a: a, b: b }); });
        });
      }
    }

    function spawn() {
      if (!edges.length) return;
      var e = edges[(Math.random() * edges.length) | 0];
      pulses.push({ e: e, t: 0, v: 0.004 + Math.random() * 0.006, hue: Math.random() < 0.8 ? 0 : 1 });
    }

    var time = 0;
    function frame() {
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(120,160,255,0.075)';
      ctx.beginPath();
      edges.forEach(function (e) { ctx.moveTo(e.a.x, e.a.y); ctx.lineTo(e.b.x, e.b.y); });
      ctx.stroke();

      layers.forEach(function (layer) {
        layer.forEach(function (n) {
          var a = 0.22 + 0.12 * Math.sin(time * 0.02 + n.ph);
          ctx.fillStyle = 'rgba(140,190,255,' + a + ')';
          ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, 6.283); ctx.fill();
        });
      });

      for (var i = pulses.length - 1; i >= 0; i--) {
        var p = pulses[i]; p.t += p.v;
        if (p.t >= 1) { // propagate to next layer's edge
          var nexts = edges.filter(function (e) { return e.a === p.e.b; });
          if (nexts.length && Math.random() < 0.9) { p.e = nexts[(Math.random() * nexts.length) | 0]; p.t = 0; }
          else { pulses.splice(i, 1); continue; }
        }
        var x = p.e.a.x + (p.e.b.x - p.e.a.x) * p.t, y = p.e.a.y + (p.e.b.y - p.e.a.y) * p.t;
        var col = p.hue ? '255,180,84' : '90,209,255';
        var g = ctx.createRadialGradient(x, y, 0, x, y, 7);
        g.addColorStop(0, 'rgba(' + col + ',0.3)'); g.addColorStop(1, 'rgba(' + col + ',0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 7, 0, 6.283); ctx.fill();
        ctx.fillStyle = 'rgba(' + col + ',0.7)'; ctx.beginPath(); ctx.arc(x, y, 1.6, 0, 6.283); ctx.fill();
      }
      if (pulses.length < 26 && Math.random() < 0.18) spawn();
      time++;
    }

    function loop() { frame(); requestAnimationFrame(loop); }
    build();
    if (reduce) { for (var k = 0; k < 14; k++) spawn(); frame(); }
    else { for (var k2 = 0; k2 < 14; k2++) spawn(); loop(); }
    var rt; window.addEventListener('resize', function () {
      clearTimeout(rt); rt = setTimeout(function () { build(); for (var k = 0; k < 12; k++) spawn(); if (reduce) frame(); }, 150);
    });
  })();

  /* ---------- Hero: closed-loop phase portrait ----------
     x' = M (x - x*), M = A - BK a stable spiral. The target x* follows the pointer. */
  (function phase() {
    var canvas = document.getElementById('phase');
    var card = document.getElementById('phaseCard');
    var ctx, W, H, parts = [], target = { x: 0, y: 0 }, goal = { x: 0, y: 0 }, t0 = 0;
    var M = [[-0.55, 1.35], [-1.35, -0.55]];
    var N = 70, TRAIL = 34;

    function toPx(p) { return { x: W / 2 + p.x * (W / 2) * 0.92, y: H / 2 - p.y * (H / 2) * 0.92 }; }
    function toWorld(px, py) { return { x: (px - W / 2) / ((W / 2) * 0.92), y: -(py - H / 2) / ((H / 2) * 0.92) }; }
    function field(p) {
      var dx = p.x - target.x, dy = p.y - target.y;
      return { x: M[0][0] * dx + M[0][1] * dy, y: M[1][0] * dx + M[1][1] * dy };
    }
    function rnd() { return { x: (Math.random() * 2 - 1) * 1.05, y: (Math.random() * 2 - 1) * 1.05 }; }
    function newPart() { var p = rnd(); return { x: p.x, y: p.y, trail: [], age: Math.random() * 120 | 0, life: 140 + Math.random() * 160 }; }

    function resize() {
      var f = fit(canvas); ctx = f.ctx; W = f.w; H = f.h;
    }
    function init() {
      resize();
      parts = []; for (var i = 0; i < N; i++) parts.push(newPart());
    }

    function drawField() {
      var cols = W < 420 ? 10 : 14, rows = Math.round(cols * H / W);
      ctx.lineWidth = 1;
      for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
          var wp = { x: -1 + 2 * (i + 0.5) / cols, y: -1 + 2 * (j + 0.5) / rows };
          var v = field(wp), m = Math.hypot(v.x, v.y) || 1;
          var len = Math.min(10, 4 + m * 5);
          var px = toPx(wp), ux = v.x / m, uy = -v.y / m;
          ctx.strokeStyle = 'rgba(130,170,255,' + Math.min(0.32, 0.1 + m * 0.1) + ')';
          ctx.beginPath(); ctx.moveTo(px.x - ux * len / 2, px.y - uy * len / 2); ctx.lineTo(px.x + ux * len / 2, px.y + uy * len / 2); ctx.stroke();
          ctx.fillStyle = ctx.strokeStyle;
          ctx.beginPath(); ctx.arc(px.x + ux * len / 2, px.y + uy * len / 2, 1.1, 0, 6.283); ctx.fill();
        }
      }
    }

    function step(dt) {
      // ease target toward goal (pointer)
      target.x += (goal.x - target.x) * 0.08; target.y += (goal.y - target.y) * 0.08;
      parts.forEach(function (p, idx) {
        // RK2 integration
        var k1 = field(p), mid = { x: p.x + k1.x * dt / 2, y: p.y + k1.y * dt / 2 }, k2 = field(mid);
        p.x += k2.x * dt; p.y += k2.y * dt; p.age++;
        p.trail.push({ x: p.x, y: p.y }); if (p.trail.length > TRAIL) p.trail.shift();
        var d = Math.hypot(p.x - target.x, p.y - target.y);
        if (d < 0.05 || p.age > p.life || Math.abs(p.x) > 1.6 || Math.abs(p.y) > 1.6) parts[idx] = newPart();
      });
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      drawField();
      parts.forEach(function (p) {
        var n = p.trail.length; if (n < 2) return;
        for (var i = 1; i < n; i++) {
          var a = toPx(p.trail[i - 1]), b = toPx(p.trail[i]), f = i / n;
          ctx.strokeStyle = 'rgba(90,209,255,' + (f * 0.85) + ')';
          ctx.lineWidth = 0.6 + f * 1.4;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
        var h = toPx(p.trail[n - 1]);
        ctx.fillStyle = '#d8f3ff'; ctx.beginPath(); ctx.arc(h.x, h.y, 1.7, 0, 6.283); ctx.fill();
      });
      // target marker
      var tp = toPx(target), pr = (Math.sin(t0 * 0.06) + 1) / 2;
      ctx.strokeStyle = 'rgba(255,180,84,' + (0.55 - pr * 0.4) + ')'; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.arc(tp.x, tp.y, 12 + pr * 16, 0, 6.283); ctx.stroke();
      ctx.strokeStyle = '#ffb454'; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.arc(tp.x, tp.y, 7, 0, 6.283); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(tp.x - 12, tp.y); ctx.lineTo(tp.x + 12, tp.y); ctx.moveTo(tp.x, tp.y - 12); ctx.lineTo(tp.x, tp.y + 12); ctx.stroke();
      ctx.fillStyle = '#ffb454'; ctx.font = '500 12px "IBM Plex Mono", monospace';
      ctx.fillText('x*', tp.x + 14, tp.y - 12);
      t0++;
    }

    function setGoal(e) {
      var r = canvas.getBoundingClientRect();
      var w = toWorld(e.clientX - r.left, e.clientY - r.top);
      goal.x = Math.max(-0.9, Math.min(0.9, w.x)); goal.y = Math.max(-0.9, Math.min(0.9, w.y));
    }
    canvas.addEventListener('pointermove', function (e) { if (e.pointerType === 'mouse') setGoal(e); });
    canvas.addEventListener('pointerdown', setGoal);
    card.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') { goal.x = 0; goal.y = 0; } });

    // wander gently when idle so the portrait is always alive
    var idle = true, last = 0;
    canvas.addEventListener('pointerenter', function () { idle = false; });
    canvas.addEventListener('pointerleave', function () { idle = true; });

    var running = true, looping = false;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { running = en[0].isIntersecting; if (running && !reduce && !looping) loop(); }, { threshold: 0 }).observe(canvas);
    }
    function loop() {
      if (!running) { looping = false; return; }
      looping = true;
      if (idle) { goal.x = 0.35 * Math.sin(t0 * 0.004); goal.y = 0.3 * Math.sin(t0 * 0.0057 + 1); }
      step(0.016); draw();
      requestAnimationFrame(loop);
    }
    init();
    if (reduce) { for (var i = 0; i < 200; i++) step(0.016); draw(); }
    else loop();
    var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { init(); if (reduce) { for (var i = 0; i < 200; i++) step(0.016); draw(); } }, 150); });
  })();
})();
