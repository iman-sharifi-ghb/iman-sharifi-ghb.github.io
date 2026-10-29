/* ==========================================================================
   Research card animations (home page)

   Each <canvas data-anim="..."> gets a looping scene drawn in a virtual
   480x270 space and scaled to the card. Scenes only run while on screen;
   with reduced motion a representative still frame is drawn instead.
     airspace : two fleets merging at shared waypoints (MARL separation)
     llm      : sim-to-language prompt -> fine-tuned LLM -> advisory
     andre    : attention-based rule extraction (illustrative)
     highway  : DQN proposals filtered by a symbolic safety layer
   ========================================================================== */

(function () {
  "use strict";

  var canvases = document.querySelectorAll("canvas[data-anim]");
  if (!canvases.length || !canvases[0].getContext) return;

  var VW = 480, VH = 270, TAU = Math.PI * 2;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var pal = {};

  function readPalette() {
    var cs = getComputedStyle(document.documentElement);
    var dark = document.documentElement.getAttribute("data-theme") === "dark";
    var v = function (n, f) { return cs.getPropertyValue(n).trim() || f; };
    pal = {
      a: v("--accent", "#c2410c"),
      b: dark ? "#6aa5f0" : "#2f6db5",
      ok: dark ? "#4cc38a" : "#1f9d55",
      bad: dark ? "#ff6b6b" : "#d23c3c",
      ink: v("--ink", "#0f1b2d"),
      soft: v("--ink-soft", "#46566b"),
      faint: v("--ink-faint", "#5f6e80"),
      line: v("--line", "#d2dae3"),
      strong: v("--line-strong", "#bac6d2"),
      surface: v("--surface", "#ffffff"),
      ground: v("--ground-2", "#e4eaf0"),
      mono: v("--font-mono", "monospace"),
      sans: getComputedStyle(document.body).fontFamily,
      dark: dark
    };
  }

  /* ---------- shared drawing helpers ---------- */
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function ease(t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function font(c, w, px, mono) { c.font = w + " " + px + "px " + (mono ? pal.mono : pal.sans); }
  function rrect(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
  }
  function grid(c, step) {
    c.strokeStyle = pal.line; c.lineWidth = 0.6; c.globalAlpha = 0.6;
    c.beginPath();
    for (var x = 0; x <= VW; x += step) { c.moveTo(x, 0); c.lineTo(x, VH); }
    for (var y = 0; y <= VH; y += step) { c.moveTo(0, y); c.lineTo(VW, y); }
    c.stroke(); c.globalAlpha = 1;
  }
  function chevron(c, x, y, h, col, s) {
    s = s || 1;
    c.save(); c.translate(x, y); c.rotate(h);
    c.fillStyle = col;
    c.beginPath(); c.moveTo(7 * s, 0); c.lineTo(-5 * s, 4.5 * s); c.lineTo(-2.5 * s, 0); c.lineTo(-5 * s, -4.5 * s); c.closePath(); c.fill();
    c.restore();
  }
  function star(c, x, y, r, col) {
    c.fillStyle = col; c.beginPath();
    for (var i = 0; i < 10; i++) {
      var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r;
      c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
    }
    c.closePath(); c.fill();
  }
  function ring(c, x, y, r, col, alpha, dash) {
    c.globalAlpha = alpha; c.strokeStyle = col; c.lineWidth = 1;
    if (dash) c.setLineDash(dash);
    c.beginPath(); c.arc(x, y, r, 0, TAU); c.stroke();
    c.setLineDash([]); c.globalAlpha = 1;
  }
  function tag(c, text, x, y, col, align) {
    font(c, "600", 9, true); c.fillStyle = col; c.textAlign = align || "left"; c.fillText(text, x, y); c.textAlign = "left";
  }

  /* ======================================================================
     Scene 1: two fleets merging at shared waypoints (after the BlueSky figure)
     ====================================================================== */
  function airspaceScene() {
    var WP = {
      1: [78, 34], 2: [40, 104], 3: [158, 92], 9: [300, 146], 8: [420, 66],
      4: [440, 210], 5: [58, 236], 7: [178, 196], 6: [150, 262]
    };
    var routes = [
      { fleet: 1, pts: [1, 3, 9, 8], gap: 6.4, off: 0.0 },
      { fleet: 0, pts: [2, 3, 9, 4], gap: 6.8, off: 2.6 },
      { fleet: 1, pts: [5, 7, 9, 8], gap: 7.0, off: 1.3 },
      { fleet: 0, pts: [6, 7, 9, 4], gap: 6.6, off: 4.0 }
    ];
    var SEP = 24, V = 30, GAP = 1.35, MERGES = [3, 7, 9];
    var ac = [], resolved = 0, timers = [], now = 0, lastPass = {};
    routes.forEach(function (r, i) {
      r.segs = []; r.len = 0; r.sAt = {};
      for (var k = 0; k < r.pts.length - 1; k++) {
        var a = WP[r.pts[k]], b = WP[r.pts[k + 1]], L = Math.hypot(b[0] - a[0], b[1] - a[1]);
        if (k > 0) r.sAt[r.pts[k]] = r.len;          // distance along route to each merge point
        r.segs.push({ a: a, b: b, L: L, s0: r.len }); r.len += L;
      }
      timers[i] = r.off;
    });
    function at(r, s) {
      for (var k = 0; k < r.segs.length; k++) {
        var g = r.segs[k];
        if (s <= g.s0 + g.L || k === r.segs.length - 1) {
          var f = clamp((s - g.s0) / g.L, 0, 1);
          return { x: lerp(g.a[0], g.b[0], f), y: lerp(g.a[1], g.b[1], f), h: Math.atan2(g.b[1] - g.a[1], g.b[0] - g.a[0]) };
        }
      }
    }
    function nextMerge(p) {
      for (var k = 1; k < p.r.pts.length - 1; k++) {
        var m = p.r.pts[k];
        if (p.s < p.r.sAt[m]) return m;
      }
      return null;
    }
    function update(dt) {
      now += dt;
      routes.forEach(function (r, i) {
        timers[i] -= dt;
        if (timers[i] <= 0) { timers[i] = r.gap + Math.random() * 1.5; ac.push({ r: r, s: 0, v: V, fleet: r.fleet, warn: 0 }); }
      });
      ac.forEach(function (p) { p.p = at(p.r, p.s); p.m = nextMerge(p); p.vt = V; });

      // Arrival scheduling: at each merge point, aircraft get time slots in
      // order of arrival, spaced GAP apart, and adjust speed to meet them.
      MERGES.forEach(function (m) {
        var queue = ac.filter(function (p) { return p.m === m; })
          .sort(function (a, b) { return (a.r.sAt[m] - a.s) - (b.r.sAt[m] - b.s); });
        var slot = (lastPass[m] === undefined ? -1e9 : lastPass[m]) + GAP;
        queue.forEach(function (p) {
          var dist = p.r.sAt[m] - p.s;
          var t = Math.max(now + dist / V, slot);
          p.vt = clamp(dist / Math.max(t - now, 0.05), V * 0.25, V);
          slot = t + GAP;
        });
      });

      ac.forEach(function (p) {
        var m = p.m;
        p.slow = p.vt < V * 0.92;
        if (p.slow) p.held = true;
        p.v += clamp(p.vt - p.v, -24 * dt, 10 * dt);
        p.s += p.v * dt;
        if (m !== null && p.s >= p.r.sAt[m]) {
          lastPass[m] = now;
          if (p.held) { resolved++; p.held = false; }
        }
        p.warn = Math.max(0, p.warn - dt * 2);
      });
      // proximity cue (visual only)
      for (var i = 0; i < ac.length; i++) for (var j = i + 1; j < ac.length; j++) {
        if (Math.hypot(ac[i].p.x - ac[j].p.x, ac[i].p.y - ac[j].p.y) < SEP * 1.6) ac[i].warn = ac[j].warn = 1;
      }
      ac = ac.filter(function (p) { return p.s < p.r.len + 6; });
    }
    function draw(c, t) {
      grid(c, 30);
      // routes
      c.setLineDash([2, 4]); c.lineWidth = 1;
      routes.forEach(function (r) {
        c.strokeStyle = r.fleet ? pal.b : pal.a; c.globalAlpha = 0.35;
        c.beginPath(); r.pts.forEach(function (k, i) { var w = WP[k]; i ? c.lineTo(w[0], w[1]) : c.moveTo(w[0], w[1]); }); c.stroke();
      });
      c.setLineDash([]); c.globalAlpha = 1;
      // waypoints
      Object.keys(WP).forEach(function (k) {
        var w = WP[k], merge = k === "9";
        star(c, w[0], w[1], merge ? 6.5 : 4.5, merge ? pal.a : pal.faint);
        tag(c, "WP" + k, w[0] + 8, w[1] - 6, pal.faint);
      });
      ring(c, WP[9][0], WP[9][1], 34, pal.a, 0.35 + 0.15 * Math.sin(t * 2), [3, 4]);
      // aircraft
      ac.forEach(function (p) {
        var col = p.fleet ? pal.b : pal.a;
        if (p.warn > 0) ring(c, p.p.x, p.p.y, SEP / 2, pal.a, 0.75 * p.warn, [3, 3]);
        else ring(c, p.p.x, p.p.y, SEP / 2, col, 0.18, [3, 3]);
        chevron(c, p.p.x, p.p.y, p.p.h, col, 1.1);
        if (p.slow) tag(c, "SPD\u2212", p.p.x + 8, p.p.y + 12, pal.a);
      });
      // legend
      font(c, "600", 9, true);
      c.fillStyle = pal.a; c.fillRect(12, VH - 22, 8, 8);
      c.fillStyle = pal.soft; c.fillText("FLEET A", 24, VH - 15);
      c.fillStyle = pal.b; c.fillRect(80, VH - 22, 8, 8);
      c.fillStyle = pal.soft; c.fillText("FLEET B", 92, VH - 15);
      tag(c, "shared conflict point", WP[9][0], WP[9][1] + 50, pal.faint, "center");
      tag(c, resolved + " conflicts resolved", VW - 12, VH - 15, pal.soft, "right");
    }
    return { update: update, draw: draw, still: 14 };
  }

  /* ======================================================================
     Scene 2: sim-to-language prompt -> fine-tuned LLM -> advisory
     ====================================================================== */
  function llmScene() {
    var T = 11.5, X0 = 26, CROSS = [176, 150];
    var prompt = [
      "ownship B03  20 kt  hdg 090",
      "intruder C01 23 kt  crossing",
      "time to conflict  6 s",
      "action? accel | hold | decel"
    ];
    var own = { x: X0, v: 20 }, intr = { y: -8 };
    var tPrev = 0;
    function reset() { own.x = X0; own.v = 20; intr.y = -8; }
    function update(dt, t) {
      if (t < tPrev) reset();
      tPrev = t;
      var target = t > 4.6 && t < 7.6 ? 5 : 20;               // advisory: decelerate, then resume
      own.v += clamp(target - own.v, -18 * dt, 10 * dt);
      own.x += own.v * dt;
      intr.y += 23 * dt;
    }
    function typed(lines, t0, cps, t) {
      var n = Math.max(0, Math.floor((t - t0) * cps)), out = [];
      for (var i = 0; i < lines.length && n > 0; i++) { out.push(lines[i].slice(0, n)); n -= lines[i].length; }
      return out;
    }
    function draw(c, t) {
      var fade = t > T - 0.8 ? (T - t) / 0.8 : t < 0.4 ? t / 0.4 : 1;
      c.globalAlpha = 1;
      // --- map: vertiport corridors ---
      c.save();
      c.globalAlpha = fade;
      c.strokeStyle = pal.line; c.lineWidth = 9; c.lineCap = "round";
      c.beginPath(); c.moveTo(14, 150); c.lineTo(240, 150); c.moveTo(176, 18); c.lineTo(176, 258); c.moveTo(60, 60); c.lineTo(176, 150); c.stroke();
      c.lineCap = "butt";
      [[14, 150], [176, 258], [60, 60], [240, 150]].forEach(function (p) {
        ring(c, p[0], p[1], 8, pal.faint, 0.6 * fade);
        c.globalAlpha = fade;
      });
      var conflict = t > 0.9 && intr.y < CROSS[1] + 16;
      var resolvedOk = intr.y > CROSS[1] + 16;
      if (conflict) {
        c.strokeStyle = pal.a; c.globalAlpha = 0.85 * fade;
        c.beginPath(); c.moveTo(CROSS[0] - 5, CROSS[1] - 5); c.lineTo(CROSS[0] + 5, CROSS[1] + 5);
        c.moveTo(CROSS[0] - 5, CROSS[1] + 5); c.lineTo(CROSS[0] + 5, CROSS[1] - 5); c.stroke();
        c.globalAlpha = fade;
        c.setLineDash([2, 3]);
        c.beginPath(); c.moveTo(own.x, 150); c.lineTo(CROSS[0], CROSS[1]); c.moveTo(176, intr.y); c.lineTo(CROSS[0], CROSS[1]); c.stroke();
        c.setLineDash([]);
      }
      ring(c, own.x, 150, 12, conflict ? pal.a : pal.b, (conflict ? 0.9 : 0.3) * fade, [3, 3]);
      ring(c, 176, intr.y, 12, conflict ? pal.a : pal.a, (conflict ? 0.9 : 0.3) * fade, [3, 3]);
      c.globalAlpha = fade;
      chevron(c, own.x, 150, 0, pal.b, 1.2);
      chevron(c, 176, intr.y, Math.PI / 2, pal.a, 1.2);
      tag(c, "B03 " + Math.round(own.v) + "kt", own.x - 14, 136, pal.b);
      tag(c, "C01", 186, intr.y + 4, pal.a);
      if (resolvedOk && t < T - 0.8) tag(c, "\u2713 separation kept", 20, 248, pal.ok);
      else if (conflict) tag(c, "conflict predicted", 20, 248, pal.a);
      c.restore();

      // --- prompt / LLM panel ---
      c.save(); c.globalAlpha = fade;
      var px = 262, pw = 206;
      rrect(c, px, 16, pw, 104, 8); c.fillStyle = pal.ground; c.fill(); c.strokeStyle = pal.line; c.stroke();
      tag(c, "PROMPT  sim \u2192 language", px + 10, 32, pal.faint);
      font(c, "500", 9.5, true); c.fillStyle = pal.ink;
      typed(prompt, 1.2, 34, t).forEach(function (l, i) { c.fillText(l, px + 10, 52 + i * 15); });

      // LLM node
      var thinking = t > 4.0 && t < 4.9;
      var ly = 150;
      c.strokeStyle = pal.strong; c.beginPath(); c.moveTo(px + pw / 2, 120); c.lineTo(px + pw / 2, ly - 18); c.stroke();
      rrect(c, px + 38, ly - 18, pw - 76, 36, 18);
      c.fillStyle = thinking ? pal.a : pal.surface; c.fill();
      c.strokeStyle = thinking ? pal.a : pal.strong; c.stroke();
      font(c, "700", 10, false); c.textAlign = "center";
      c.fillStyle = thinking ? pal.surface : pal.ink;
      c.fillText("Fine-tuned LLM", px + pw / 2, ly - 1);
      font(c, "500", 8, true);
      c.fillText(thinking ? "thinking" + ".".repeat(1 + Math.floor(t * 4) % 3) : "SFT + GRPO", px + pw / 2, ly + 11);
      c.textAlign = "left";

      // answer
      c.strokeStyle = pal.strong; c.beginPath(); c.moveTo(px + pw / 2, ly + 18); c.lineTo(px + pw / 2, 196); c.stroke();
      rrect(c, px, 196, pw, 46, 8); c.fillStyle = pal.ground; c.fill(); c.strokeStyle = pal.line; c.stroke();
      tag(c, "ADVISORY", px + 10, 212, pal.faint);
      var ans = typed(["\u2192 decelerate"], 4.9, 18, t)[0];
      if (ans) { font(c, "700", 12, true); c.fillStyle = pal.a; c.fillText(ans, px + 10, 232); }
      c.restore();
    }
    return { update: update, draw: draw, period: T, still: 6.5 };
  }

  /* ======================================================================
     Scene 3: attention-based rule extraction (illustrative, after ANDRE)
     ====================================================================== */
  function andreScene() {
    var T = 11, N = 6;
    var py = [], vals = [];
    for (var i = 0; i < N; i++) { py.push(36 + i * 35); vals.push(Math.random()); }
    var conj = [{ x: 262, y: 92 }, { x: 262, y: 196 }];
    var disj = { x: 372, y: 144 }, out = { x: 446, y: 144 };
    // learned structure: conj0 = p2 AND NOT p5, conj1 = p1 AND p4
    var goal = [[0, 1, 0, 0, -1, 0], [1, 0, 0, 1, 0, 0]];
    var init = goal.map(function () { return [0, 0, 0, 0, 0, 0].map(function () { return 0.25 + Math.random() * 0.3; }); });
    var sampleT = 0, dots = [];
    var rule = "\u0125 \u2190 (p\u2082 \u2227 \u00acp\u2085) \u2228 (p\u2081 \u2227 p\u2084)";
    function update(dt) {
      sampleT -= dt;
      if (sampleT <= 0) { sampleT = 0.9; for (var i = 0; i < N; i++) vals[i] = Math.random(); }
      if (Math.random() < dt * 14) dots.push({ k: Math.floor(Math.random() * 2), i: Math.floor(Math.random() * N), f: 0 });
      dots.forEach(function (d) { d.f += dt * 0.9; });
      dots = dots.filter(function (d) { return d.f < 1; });
    }
    function weight(k, i, tau) {
      var g = Math.abs(goal[k][i]);
      return lerp(init[k][i], g ? 1 : 0.04, tau);
    }
    function draw(c, t) {
      var tau = ease((t - 0.6) / 6);
      var fade = t > T - 0.8 ? (T - t) / 0.8 : t < 0.4 ? t / 0.4 : 1;
      c.save(); c.globalAlpha = fade;
      // predicate chips with live truth values
      for (var i = 0; i < N; i++) {
        rrect(c, 14, py[i] - 11, 86, 22, 6); c.fillStyle = pal.surface; c.fill(); c.strokeStyle = pal.line; c.stroke();
        font(c, "600", 10, true); c.fillStyle = pal.ink; c.fillText("p" + (i + 1), 22, py[i] + 4);
        c.fillStyle = pal.line; c.fillRect(46, py[i] - 2, 46, 4);
        c.fillStyle = pal.soft; c.fillRect(46, py[i] - 2, 46 * vals[i], 4);
      }
      // attention edges
      for (var k = 0; k < 2; k++) for (i = 0; i < N; i++) {
        var w = weight(k, i, tau), neg = goal[k][i] < 0 && tau > 0.45;
        c.globalAlpha = fade * (0.12 + 0.8 * w);
        c.strokeStyle = neg ? pal.b : pal.a;
        c.lineWidth = 0.5 + 3.2 * w;
        if (neg) c.setLineDash([5, 3]);
        c.beginPath(); c.moveTo(100, py[i]);
        c.bezierCurveTo(170, py[i], 190, conj[k].y, conj[k].x - 18, conj[k].y); c.stroke();
        c.setLineDash([]);
        if (neg) { font(c, "700", 12, false); c.fillStyle = pal.b; c.fillText("\u00ac", conj[k].x - 34, conj[k].y + (py[i] < conj[k].y ? -6 : 14)); }
      }
      // particles flow along edges in proportion to attention
      dots.forEach(function (d) {
        var w = weight(d.k, d.i, tau), f = d.f, y0 = py[d.i], y1 = conj[d.k].y;
        var x = Math.pow(1 - f, 3) * 100 + 3 * Math.pow(1 - f, 2) * f * 170 + 3 * (1 - f) * f * f * 190 + f * f * f * (conj[d.k].x - 18);
        var y = Math.pow(1 - f, 3) * y0 + 3 * Math.pow(1 - f, 2) * f * y0 + 3 * (1 - f) * f * f * y1 + f * f * f * y1;
        c.globalAlpha = fade * w; c.fillStyle = pal.a;
        c.beginPath(); c.arc(x, y, 2, 0, TAU); c.fill();
      });
      c.globalAlpha = fade; c.lineWidth = 1.6; c.strokeStyle = pal.strong;
      conj.forEach(function (n) { c.beginPath(); c.moveTo(n.x + 18, n.y); c.lineTo(disj.x - 20, disj.y); c.stroke(); });
      c.beginPath(); c.moveTo(disj.x + 20, disj.y); c.lineTo(out.x - 14, out.y); c.stroke();
      // nodes
      function node(n, sym, r, fill) {
        c.beginPath(); c.arc(n.x, n.y, r, 0, TAU); c.fillStyle = fill; c.fill(); c.strokeStyle = pal.strong; c.lineWidth = 1; c.stroke();
        font(c, "700", 15, false); c.fillStyle = pal.ink; c.textAlign = "center"; c.fillText(sym, n.x, n.y + 5); c.textAlign = "left";
      }
      conj.forEach(function (n) { node(n, "\u2227", 18, pal.surface); });
      node(disj, "\u2228", 20, pal.surface);
      c.save(); c.translate(out.x, out.y); c.rotate(Math.PI / 4);
      c.fillStyle = pal.a; c.globalAlpha = fade * (0.3 + 0.7 * tau); c.fillRect(-10, -10, 20, 20); c.restore();
      c.globalAlpha = fade;
      tag(c, "\u0125", out.x - 3, out.y + 26, pal.ink);
      tag(c, "CONJUNCTION", conj[0].x, 30, pal.faint, "center");
      tag(c, "DISJUNCTION", disj.x, 30, pal.faint, "center");
      // training progress + extracted rule
      c.fillStyle = pal.line; c.fillRect(14, 12, 86, 3);
      c.fillStyle = pal.a; c.fillRect(14, 12, 86 * tau, 3);
      tag(c, tau < 1 ? "training\u2026" : "rule extracted", 108, 16, pal.faint);
      var shown = Math.floor(clamp((tau - 0.7) / 0.3, 0, 1) * rule.length + (t > 7 ? rule.length : 0));
      font(c, "700", 12, true); c.fillStyle = pal.ink;
      c.fillText(rule.slice(0, Math.min(rule.length, shown)), 128, 262);
      tag(c, "illustrative", VW - 10, 14, pal.faint, "right");
      c.restore();
    }
    return { update: update, draw: draw, period: T, still: 8 };
  }

  /* ======================================================================
     Scene 4: DQN proposals filtered by a symbolic safety layer
     ====================================================================== */
  function highwayScene() {
    var T = 12, EGO_X = 170;
    var LANES = [92, 132, 172];                 // left, middle, right lane centres
    // ego lane over time: middle -> right (t 3.0-4.4) -> middle (t 8.4-9.8)
    function egoY(t) {
      if (t < 3.0) return LANES[1];
      if (t < 4.4) return lerp(LANES[1], LANES[2], ease((t - 3.0) / 1.4));
      if (t < 8.4) return LANES[2];
      if (t < 9.8) return lerp(LANES[2], LANES[1], ease((t - 8.4) / 1.4));
      return LANES[1];
    }
    // other traffic, positions relative to the ego frame
    var cars = [
      function (t) { return { x: 128 + 6 * t, y: LANES[0] }; },          // alongside, left lane
      function (t) { return { x: 330 - 34 * t, y: LANES[1] }; },         // slower car ahead
      function (t) { return { x: 40 + 5 * t, y: LANES[2] }; },           // far behind, right lane
      function (t) { return { x: 520 - 22 * t, y: LANES[0] }; }
    ];
    var steps = [
      { t0: 1.0, t1: 2.6, dqn: "LANE LEFT", ok: false, why: "left lane occupied", lane: 0 },
      { t0: 2.6, t1: 4.4, dqn: "LANE RIGHT", ok: true, why: "gap is safe", lane: 2 },
      { t0: 7.6, t1: 9.8, dqn: "LANE LEFT", ok: true, why: "gap is safe", lane: 1 }
    ];
    var scroll = 0;
    function update(dt) { scroll = (scroll + dt * 110) % 40; }
    function car(c, x, y, body, glass) {
      rrect(c, x - 17, y - 8, 34, 16, 4); c.fillStyle = body; c.fill();
      c.fillStyle = glass; c.fillRect(x + 3, y - 6, 6, 12); c.fillRect(x - 11, y - 6, 5, 12);
    }
    function draw(c, t) {
      var fade = t > T - 0.7 ? (T - t) / 0.7 : t < 0.4 ? t / 0.4 : 1;
      c.save(); c.globalAlpha = fade;
      // road
      c.fillStyle = pal.dark ? "#1b2533" : "#d9dee5"; c.fillRect(0, 70, VW, 124);
      c.fillStyle = pal.strong; c.fillRect(0, 70, VW, 2); c.fillRect(0, 192, VW, 2);
      c.fillStyle = pal.surface;
      [112, 152].forEach(function (y) { for (var x = -scroll; x < VW; x += 40) c.fillRect(x, y - 1, 20, 2); });
      var ey = egoY(t);
      // active decision
      var s = null;
      for (var i = 0; i < steps.length; i++) if (t >= steps[i].t0 && t < steps[i].t1) s = steps[i];
      if (s) {
        var zy = LANES[s.lane];
        c.globalAlpha = fade * 0.22; c.fillStyle = s.ok ? pal.ok : pal.bad;
        c.fillRect(EGO_X - 70, zy - 19, 160, 38);
        c.globalAlpha = fade;
        c.strokeStyle = s.ok ? pal.ok : pal.bad; c.setLineDash([4, 3]); c.strokeRect(EGO_X - 70, zy - 19, 160, 38); c.setLineDash([]);
        // proposed manoeuvre arrow
        c.strokeStyle = s.ok ? pal.ok : pal.bad; c.lineWidth = 2;
        c.beginPath(); c.moveTo(EGO_X + 18, ey); c.quadraticCurveTo(EGO_X + 46, ey, EGO_X + 60, zy); c.stroke(); c.lineWidth = 1;
        if (!s.ok) { font(c, "700", 16, false); c.fillStyle = pal.bad; c.fillText("\u2715", EGO_X + 56, zy + 6); }
      }
      cars.forEach(function (f) {
        var p = f(t);
        if (p.x > -30 && p.x < VW + 30) car(c, p.x, p.y, pal.dark ? "#8b98aa" : "#ffffff", pal.dark ? "#3b475a" : "#aab4c2");
      });
      car(c, EGO_X, ey, pal.ok, "#0d3b22");
      tag(c, "AV", EGO_X - 6, ey - 12, pal.ok);
      // decision panel
      rrect(c, 12, 206, VW - 24, 54, 8); c.fillStyle = pal.ground; c.fill(); c.strokeStyle = pal.line; c.stroke();
      tag(c, "DQN PROPOSES", 24, 224, pal.faint);
      tag(c, "SYMBOLIC CHECK", 170, 224, pal.faint);
      tag(c, "EXECUTED", 340, 224, pal.faint);
      font(c, "700", 11, true);
      c.fillStyle = pal.ink; c.fillText(s ? s.dqn : "KEEP LANE", 24, 244);
      if (s) {
        c.fillStyle = s.ok ? pal.ok : pal.bad;
        c.fillText((s.ok ? "\u2713 " : "\u2715 ") + s.why, 170, 244);
      } else { c.fillStyle = pal.ok; c.fillText("\u2713 safe", 170, 244); }
      c.fillStyle = pal.ink;
      c.fillText(s && s.ok ? s.dqn : "KEEP LANE", 340, 244);
      tag(c, "symbolic rules filter unsafe RL actions", 12, 22, pal.faint);
      tag(c, "DQN + SLP core", VW - 12, 22, pal.faint, "right");
      c.restore();
    }
    return { update: update, draw: draw, period: T, still: 1.8 };
  }

  var factories = { airspace: airspaceScene, llm: llmScene, andre: andreScene, highway: highwayScene };

  /* ---------- lifecycle ---------- */
  readPalette();
  var items = [];
  canvases.forEach(function (cv) {
    var make = factories[cv.getAttribute("data-anim")];
    if (!make) return;
    var it = { cv: cv, c: cv.getContext("2d"), scene: make(), t: 0, visible: false };
    items.push(it);
    cv.hidden = false;
    if (cv.parentElement) cv.parentElement.classList.add("anim-ready");
  });

  function size(it) {
    var r = it.cv.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
    it.cv.width = Math.max(1, Math.round(r.width * dpr));
    it.cv.height = Math.max(1, Math.round(r.height * dpr));
    it.k = (r.width / VW) * dpr;
  }
  function render(it) {
    var c = it.c;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.clearRect(0, 0, it.cv.width, it.cv.height);
    c.setTransform(it.k, 0, 0, it.k, 0, 0);
    c.lineWidth = 1; c.globalAlpha = 1;
    it.scene.draw(c, it.t);
  }
  function advance(it, dt) {
    it.t += dt;
    if (it.scene.period && it.t >= it.scene.period) it.t -= it.scene.period;
    it.scene.update(dt, it.t);
  }
  function still(it) {
    var target = it.scene.still || 3;
    it.t = 0;
    for (var s = 0; s < target; s += 1 / 30) advance(it, 1 / 30);
    render(it);
  }

  items.forEach(size);

  if (reduceMotion) {
    items.forEach(still);
  } else {
    var last = performance.now();
    var loop = function (now) {
      var dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!document.hidden) items.forEach(function (it) { if (it.visible) { advance(it, dt); render(it); } });
      requestAnimationFrame(loop);
    };
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          items.forEach(function (it) { if (it.cv === e.target) it.visible = e.isIntersecting; });
        });
      });
      items.forEach(function (it) { io.observe(it.cv); });
    } else items.forEach(function (it) { it.visible = true; });
    requestAnimationFrame(loop);
  }

  var onResize = function () { items.forEach(function (it) { size(it); render(it); }); };
  if ("ResizeObserver" in window) {
    var ro = new ResizeObserver(onResize);
    items.forEach(function (it) { ro.observe(it.cv); });
  } else window.addEventListener("resize", onResize);

  new MutationObserver(function () { readPalette(); items.forEach(render); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
})();
