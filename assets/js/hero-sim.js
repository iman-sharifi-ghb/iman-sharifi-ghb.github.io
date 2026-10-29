/* ==========================================================================
   Hero airspace simulation (decorative)

   An urban UTM traffic display: quadcopters fly delivery missions between
   vertiports (vertical take-off, cruise, landing). Each aircraft predicts
   conflicts with a closest-point-of-approach (CPA) check and resolves them
   with heading/speed advisories, under turn-rate and acceleration limits.
   The mouse cursor is a non-cooperative intruder ("UNK").
   Pauses off-screen and in background tabs; a single still frame is drawn
   when the visitor prefers reduced motion.
   ========================================================================== */

(function () {
  "use strict";

  var hero = document.querySelector(".home-hero");
  var canvas = hero && hero.querySelector(".home-hero__sim");
  if (!canvas || !canvas.getContext) return;

  var ctx = canvas.getContext("2d");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var hud = hero.querySelector(".home-hero__hud");
  var hudField = function (k) { return hud && hud.querySelector('[data-hud="' + k + '"]'); };

  /* ---- Tunables (px, s) ---- */
  var SEP = 42;           // separation minimum, centre to centre
  var LOOKAHEAD = 4;      // conflict-detection horizon
  var DETECT = 300;       // surveillance range
  var TURN = 1.5;         // max turn rate, rad/s
  var ACCEL = 16;         // max acceleration, px/s^2
  var CLIMB_T = 1.8;      // vertical climb / descent duration
  var INTRUDER_R = 48;    // cursor protected radius
  var TAU = Math.PI * 2;

  var W = 0, H = 0, dpr = 1;
  var pal = {};
  var city = null;        // cached city-block layer
  var pads = [], drones = [];
  var pointer = null;
  var pairs = {}, resolved = 0, active = 0;
  var visible = true, running = false, last = 0, hudT = 0, clock = 0;

  /* ---------- helpers ---------- */
  function rand(a, b) { return a + Math.random() * (b - a); }
  function wrap(a) { while (a > Math.PI) a -= TAU; while (a < -Math.PI) a += TAU; return a; }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  function readPalette() {
    var cs = getComputedStyle(document.documentElement);
    var dark = document.documentElement.getAttribute("data-theme") === "dark";
    var v = function (n, f) { return cs.getPropertyValue(n).trim() || f; };
    pal = {
      a: v("--accent", "#c2410c"),
      b: dark ? "#6aa5f0" : "#2f6db5",
      ink: v("--ink", "#0f1b2d"),
      soft: v("--ink-soft", "#46566b"),
      faint: v("--ink-faint", "#5f6e80"),
      line: v("--line", "#d2dae3"),
      surface: v("--surface", "#ffffff"),
      mono: v("--font-mono", "monospace"),
      dark: dark
    };
  }

  // Rectangle of an element in hero coordinates (with padding)
  function rectOf(sel, pad) {
    var el = hero.querySelector(sel);
    if (!el) return null;
    var h = hero.getBoundingClientRect(), r = el.getBoundingClientRect();
    return { x: r.left - h.left - pad, y: r.top - h.top - pad, w: r.width + 2 * pad, h: r.height + 2 * pad };
  }
  function inside(p, r) { return r && p.x > r.x && p.x < r.x + r.w && p.y > r.y && p.y < r.y + r.h; }

  /* ---------- city layer (cached) ---------- */
  function buildCity() {
    city = document.createElement("canvas");
    city.width = Math.round(W * dpr);
    city.height = Math.round(H * dpr);
    var c = city.getContext("2d");
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.translate(W / 2, H / 2);
    c.rotate(-0.21);
    var span = Math.hypot(W, H) / 2 + 80, step = 64, seed = 7;
    var rnd = function () { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    c.fillStyle = pal.line;
    for (var gx = -span; gx < span; gx += step) {
      for (var gy = -span; gy < span; gy += step) {
        var avenue = Math.round(gx / step) % 4 === 0 ? 10 : 0;
        if (rnd() < 0.12) continue;                        // parks / plazas
        var inset = 7 + avenue;
        var bw = step - inset - 7, bh = step - 14;
        // split some blocks into two buildings
        c.globalAlpha = 0.28 + rnd() * 0.22;
        if (rnd() < 0.45) {
          var cut = bw * (0.35 + rnd() * 0.3);
          c.fillRect(gx + inset, gy + 7, cut - 3, bh);
          c.fillRect(gx + inset + cut + 3, gy + 7, bw - cut - 3, bh);
        } else {
          c.fillRect(gx + inset, gy + 7, bw, bh);
        }
      }
    }
    c.globalAlpha = 1;
  }

  /* ---------- vertiports ---------- */
  function placePads() {
    pads = [];
    var avoid = rectOf(".home-portrait", 26);
    var n = W > 1100 ? 7 : W > 700 ? 5 : 4;
    var minD = Math.min(220, Math.sqrt((W * H) / n) * 0.75);
    var names = "ABCDEFGHJK";
    for (var tries = 0; pads.length < n && tries < 600; tries++) {
      var p = { x: rand(40, W - 40), y: rand(36, H - 36) };
      if (inside(p, avoid)) continue;
      var ok = true;
      for (var i = 0; i < pads.length; i++) if (Math.hypot(p.x - pads[i].x, p.y - pads[i].y) < minD) ok = false;
      if (!ok) continue;
      p.name = "VP-" + names[pads.length];
      p.blink = rand(0, TAU);
      pads.push(p);
    }
  }

  /* ---------- aircraft ---------- */
  function pickDest(from) {
    var best = null, bestLoad = 1e9;
    for (var k = 0; k < 4; k++) {
      var p = pads[Math.floor(Math.random() * pads.length)];
      if (p === from) continue;
      var load = 0;
      for (var i = 0; i < drones.length; i++) if (drones[i].to === p) load++;
      if (load < bestLoad) { best = p; bestLoad = load; }
    }
    return best || pads[(pads.indexOf(from) + 1) % pads.length];
  }

  function makeDrone(id) {
    var d = {
      id: id,
      fleet: id % 2,
      cs: (id % 2 ? "B-" : "A-") + String(100 + Math.floor(Math.random() * 800)),
      cruise: rand(34, 48),
      ceiling: [200, 250, 300, 350, 400][Math.floor(Math.random() * 5)],   // assigned cruise altitude, ft
      rotor: rand(0, TAU),
      trail: [], trailT: 0
    };
    d.from = pads[id % pads.length];
    d.to = pickDest(d.from);
    if (Math.random() < 0.6) {                // start mid-mission
      var f = rand(0.1, 0.85);
      d.x = d.from.x + (d.to.x - d.from.x) * f;
      d.y = d.from.y + (d.to.y - d.from.y) * f;
      d.hdg = Math.atan2(d.to.y - d.y, d.to.x - d.x);
      d.spd = d.cruise; d.alt = 1; d.phase = "cruise";
    } else {
      d.x = d.from.x; d.y = d.from.y; d.hdg = rand(-Math.PI, Math.PI);
      d.spd = 0; d.alt = 0; d.phase = "ground"; d.t = rand(0, 3);
    }
    return d;
  }

  function syncCount() {
    var n = Math.round(clamp((W * H) / 65000, 6, 12));
    while (drones.length < n) drones.push(makeDrone(drones.length));
    if (drones.length > n) drones.length = n;
  }

  // CPA between a (with velocity va) and b (velocity vb)
  function cpa(ax, ay, avx, avy, bx, by, bvx, bvy) {
    var rx = bx - ax, ry = by - ay, vx = bvx - avx, vy = bvy - avy;
    var vv = vx * vx + vy * vy;
    var t = vv > 1e-6 ? clamp(-(rx * vx + ry * vy) / vv, 0, LOOKAHEAD) : 0;
    return { t: t, d: Math.hypot(rx + vx * t, ry + vy * t) };
  }

  // Heading change (rad) that best increases the miss distance against an intruder
  function bestTurn(d, bx, by, bvx, bvy, mag) {
    var best = 0, bestMiss = -1;
    [-mag, mag].forEach(function (dh) {
      var h = d.hdg + dh;
      var m = cpa(d.x, d.y, Math.cos(h) * d.spd, Math.sin(h) * d.spd, bx, by, bvx, bvy).d;
      if (m > bestMiss) { bestMiss = m; best = dh; }
    });
    return best;
  }

  /* ---------- simulation step ---------- */
  function step(dt) {
    clock += dt;
    var i, j, d, o, live = {};
    active = 0;

    for (i = 0; i < drones.length; i++) {
      d = drones[i];
      d.adv = 0; d.spdF = 1; d.conflict = null;
    }

    // Detect and resolve conflicts between airborne aircraft
    for (i = 0; i < drones.length; i++) {
      d = drones[i];
      if (d.phase !== "cruise") continue;
      var dvx = Math.cos(d.hdg) * d.spd, dvy = Math.sin(d.hdg) * d.spd;
      for (j = i + 1; j < drones.length; j++) {
        o = drones[j];
        if (o.phase !== "cruise") continue;
        var range = Math.hypot(o.x - d.x, o.y - d.y);
        if (range > DETECT) continue;
        var ovx = Math.cos(o.hdg) * o.spd, ovy = Math.sin(o.hdg) * o.spd;
        var c = cpa(d.x, d.y, dvx, dvy, o.x, o.y, ovx, ovy);
        if (c.d < SEP * 1.35) {
          var sev = clamp((SEP * 1.35 - c.d) / SEP, 0.25, 1);
          d.adv += bestTurn(d, o.x, o.y, ovx, ovy, 0.45 + 0.35 * sev);
          o.adv += bestTurn(o, d.x, d.y, dvx, dvy, 0.45 + 0.35 * sev);
          o.spdF = Math.min(o.spdF, 0.62);           // lower priority also slows
          d.conflict = { t: c.t, o: o };
          o.conflict = o.conflict || { t: c.t, o: d };
          var key = d.id + "-" + o.id;
          live[key] = (pairs[key] && pairs[key].los) || range < SEP;
          active++;
        }
      }
      // Cursor: stationary non-cooperative intruder
      if (pointer) {
        var pc = cpa(d.x, d.y, dvx, dvy, pointer.x, pointer.y, 0, 0);
        if (pc.d < INTRUDER_R + SEP / 2) {
          d.adv += bestTurn(d, pointer.x, pointer.y, 0, 0, 0.9);
          d.spdF = Math.min(d.spdF, 0.75);
          d.unk = true;
        } else d.unk = false;
      }
    }

    for (var k in pairs) if (!(k in live) && !pairs[k].los) resolved++;
    var next = {};
    for (k in live) next[k] = { los: live[k] };
    pairs = next;

    // Flight phases + kinematics
    for (i = 0; i < drones.length; i++) {
      d = drones[i];
      d.rotor += dt * (d.alt > 0.02 || d.phase === "climb" ? 26 : 6);
      if (d.phase === "ground") {
        d.t -= dt;
        if (d.t <= 0) { d.to = pickDest(d.from); d.phase = "climb"; }
        continue;
      }
      var tx = d.to.x - d.x, ty = d.to.y - d.y, dist = Math.hypot(tx, ty);
      var want = Math.atan2(ty, tx);
      if (d.phase === "climb") {
        d.alt = Math.min(1, d.alt + dt / CLIMB_T);
        d.hdg += clamp(wrap(want - d.hdg), -TURN * dt, TURN * dt);   // yaw toward the route
        if (d.alt >= 1) d.phase = "cruise";
        continue;
      }
      if (d.phase === "descend") {
        d.alt = Math.max(0, d.alt - dt / CLIMB_T);
        if (d.alt <= 0) { d.phase = "ground"; d.from = d.to; d.t = rand(1.2, 4); d.trail = []; }
        continue;
      }
      // cruise
      var target = clamp(d.adv, -0.9, 0.9);
      var desired = want + (dist > 50 ? target : 0);
      d.hdg += clamp(wrap(desired - d.hdg), -TURN * dt, TURN * dt);
      var vt = Math.min(d.cruise * d.spdF, Math.max(6, dist * 0.8));
      d.spd += clamp(vt - d.spd, -ACCEL * dt, ACCEL * dt);
      d.x += Math.cos(d.hdg) * d.spd * dt;
      d.y += Math.sin(d.hdg) * d.spd * dt;
      d.trailT += dt;
      if (d.trailT > 0.18) {
        d.trailT = 0;
        d.trail.push(d.x, d.y);
        if (d.trail.length > 36) d.trail.splice(0, 2);
      }
      if (dist < 5) { d.x = d.to.x; d.y = d.to.y; d.spd = 0; d.phase = "descend"; }
    }
  }

  /* ---------- rendering ---------- */
  function drawPad(p) {
    ctx.globalAlpha = 0.5;
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(p.x, p.y, 13, 0, TAU); ctx.stroke();
    ctx.globalAlpha = 0.18;
    ctx.beginPath(); ctx.arc(p.x, p.y, 19, 0, TAU); ctx.stroke();
    ctx.globalAlpha = 0.65;
    ctx.fillStyle = pal.faint;
    ctx.font = "700 9px " + pal.mono;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("H", p.x, p.y + 0.5);
    // edge lights blink in sequence
    for (var k = 0; k < 4; k++) {
      var on = Math.sin(clock * 3 + p.blink + k * 1.57) > 0.6;
      var a = k * Math.PI / 2 + Math.PI / 4;
      ctx.globalAlpha = on ? 0.9 : 0.25;
      ctx.fillStyle = pal.a;
      ctx.beginPath(); ctx.arc(p.x + Math.cos(a) * 13, p.y + Math.sin(a) * 13, 1.6, 0, TAU); ctx.fill();
    }
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = pal.faint;
    ctx.font = "500 9px " + pal.mono;
    ctx.fillText(p.name, p.x, p.y + 29);
    ctx.textAlign = "start"; ctx.textBaseline = "alphabetic";
  }

  function drawQuad(d, col) {
    var s = 1.05 + 0.3 * d.alt;
    var arm = 7 * s, rr = 3.6 * s;

    // shadow on the ground, offset grows with altitude
    if (d.alt > 0.02) {
      var off = 4 + d.alt * 12;
      ctx.save();
      ctx.translate(d.x + off, d.y + off);
      ctx.rotate(d.hdg);
      ctx.globalAlpha = 0.1 + 0.06 * (1 - d.alt);
      ctx.fillStyle = pal.ink;
      for (var q = 0; q < 4; q++) {
        var aq = Math.PI / 4 + q * Math.PI / 2;
        ctx.beginPath(); ctx.arc(Math.cos(aq) * arm * 0.9, Math.sin(aq) * arm * 0.9, rr, 0, TAU); ctx.fill();
      }
      ctx.restore();
    }

    ctx.save();
    ctx.translate(d.x, d.y);
    ctx.rotate(d.hdg);
    // arms
    ctx.globalAlpha = 0.9;
    ctx.strokeStyle = pal.ink;
    ctx.lineWidth = 1.6 * s;
    ctx.beginPath();
    ctx.moveTo(-arm * 0.71, -arm * 0.71); ctx.lineTo(arm * 0.71, arm * 0.71);
    ctx.moveTo(-arm * 0.71, arm * 0.71); ctx.lineTo(arm * 0.71, -arm * 0.71);
    ctx.stroke();
    // rotors: disc + spinning blade
    for (var r = 0; r < 4; r++) {
      var a = Math.PI / 4 + r * Math.PI / 2;
      var rx = Math.cos(a) * arm * 0.71 * 1.41, ry = Math.sin(a) * arm * 0.71 * 1.41;
      ctx.globalAlpha = 0.22;
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.arc(rx, ry, rr, 0, TAU); ctx.fill();
      ctx.globalAlpha = 0.75;
      ctx.strokeStyle = col;
      ctx.lineWidth = 1;
      var sp = d.rotor * (r % 2 ? 1 : -1);
      ctx.beginPath();
      ctx.moveTo(rx + Math.cos(sp) * rr, ry + Math.sin(sp) * rr);
      ctx.lineTo(rx - Math.cos(sp) * rr, ry - Math.sin(sp) * rr);
      ctx.stroke();
    }
    // body + nose light
    ctx.globalAlpha = 1;
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.arc(0, 0, 2.8 * s, 0, TAU); ctx.fill();
    ctx.fillStyle = pal.surface;
    ctx.beginPath(); ctx.arc(2.2 * s, 0, 1 * s, 0, TAU); ctx.fill();
    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    if (city) {
      ctx.globalAlpha = pal.dark ? 0.32 : 0.4;
      ctx.drawImage(city, 0, 0, W, H);
    }
    var i, d, col, showBlocks = W >= 900;

    pads.forEach(drawPad);

    // flight plans + trails
    ctx.lineWidth = 1;
    for (i = 0; i < drones.length; i++) {
      d = drones[i];
      col = d.fleet ? pal.b : pal.a;
      if (d.phase === "cruise") {
        ctx.setLineDash([2, 5]);
        ctx.globalAlpha = 0.22;
        ctx.strokeStyle = col;
        ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d.to.x, d.to.y); ctx.stroke();
        ctx.setLineDash([]);
      }
      ctx.fillStyle = col;
      for (var t = 0; t < d.trail.length; t += 2) {
        ctx.globalAlpha = 0.06 + 0.3 * (t / d.trail.length);
        ctx.beginPath(); ctx.arc(d.trail[t], d.trail[t + 1], 1.1, 0, TAU); ctx.fill();
      }
    }

    // conflicts: predicted CPA points and pair links
    for (i = 0; i < drones.length; i++) {
      d = drones[i];
      if (!d.conflict || d.conflict.o.id < d.id) continue;
      var o = d.conflict.o, tc = d.conflict.t;
      var dx = d.x + Math.cos(d.hdg) * d.spd * tc, dy = d.y + Math.sin(d.hdg) * d.spd * tc;
      var ox = o.x + Math.cos(o.hdg) * o.spd * tc, oy = o.y + Math.sin(o.hdg) * o.spd * tc;
      ctx.strokeStyle = pal.a;
      ctx.globalAlpha = 0.55;
      ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(dx, dy); ctx.moveTo(o.x, o.y); ctx.lineTo(ox, oy); ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 0.8;
      [[dx, dy], [ox, oy]].forEach(function (p) {
        ctx.beginPath();
        ctx.moveTo(p[0] - 3.5, p[1] - 3.5); ctx.lineTo(p[0] + 3.5, p[1] + 3.5);
        ctx.moveTo(p[0] - 3.5, p[1] + 3.5); ctx.lineTo(p[0] + 3.5, p[1] - 3.5);
        ctx.stroke();
      });
    }

    for (i = 0; i < drones.length; i++) {
      d = drones[i];
      col = d.fleet ? pal.b : pal.a;
      var airborne = d.alt > 0.02;

      // protected zone (radius = half the separation minimum)
      if (airborne) {
        var warn = d.conflict || d.unk;
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1;
        ctx.strokeStyle = warn ? pal.a : col;
        ctx.globalAlpha = warn ? 0.5 + 0.3 * Math.sin(clock * 8) : 0.12;
        ctx.beginPath(); ctx.arc(d.x, d.y, SEP / 2, 0, TAU); ctx.stroke();
        ctx.setLineDash([]);
        // velocity leader: where the aircraft will be in 2 s
        if (d.phase === "cruise") {
          ctx.globalAlpha = 0.45;
          ctx.strokeStyle = col;
          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d.x + Math.cos(d.hdg) * d.spd * 2, d.y + Math.sin(d.hdg) * d.spd * 2);
          ctx.stroke();
        }
      }

      drawQuad(d, col);

      // ATC-style data block
      if (showBlocks && airborne) {
        var bx = d.x + 20, by = d.y - 20;
        ctx.globalAlpha = 0.35;
        ctx.strokeStyle = pal.faint;
        ctx.beginPath(); ctx.moveTo(d.x + 9, d.y - 9); ctx.lineTo(bx - 2, by + 4); ctx.stroke();
        ctx.font = "600 9px " + pal.mono;
        ctx.globalAlpha = 0.95;
        ctx.fillStyle = col;
        ctx.fillText(d.cs, bx, by);
        ctx.font = "500 9px " + pal.mono;
        ctx.fillStyle = pal.faint;
        ctx.fillText(Math.round(d.alt * d.ceiling) + "ft " + Math.round(d.spd * 0.9) + "kt", bx, by + 11);
        if (d.conflict || d.unk) {
          var adv = Math.abs(d.adv) > 0.05 ? "HDG " + (d.adv > 0 ? "R" : "L") : "";
          if (d.spdF < 0.95) adv += (adv ? " " : "") + "SPD\u2212";
          if (adv) {
            ctx.fillStyle = pal.a;
            ctx.font = "700 9px " + pal.mono;
            ctx.fillText(adv, bx, by + 22);
          }
        }
      }
    }

    // cursor intruder
    if (pointer) {
      ctx.globalAlpha = 0.55;
      ctx.strokeStyle = pal.a;
      ctx.setLineDash([5, 4]);
      ctx.beginPath(); ctx.arc(pointer.x, pointer.y, INTRUDER_R, 0, TAU); ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.moveTo(pointer.x, pointer.y - 6); ctx.lineTo(pointer.x + 6, pointer.y);
      ctx.lineTo(pointer.x, pointer.y + 6); ctx.lineTo(pointer.x - 6, pointer.y); ctx.closePath();
      ctx.stroke();
      ctx.fillStyle = pal.a;
      ctx.font = "700 9px " + pal.mono;
      ctx.fillText("UNK", pointer.x + 10, pointer.y - 8);
    }
    ctx.globalAlpha = 1;
  }

  function updateHud() {
    if (!hud) return;
    var set = function (k, v) { var el = hudField(k); if (el) el.textContent = v; };
    set("agents", drones.length);
    set("pads", pads.length);
    set("active", active);
    set("conflicts", resolved);
  }

  /* ---------- loop / lifecycle ---------- */
  function frame(now) {
    if (!running) return;
    var dt = Math.min(0.05, (now - last) / 1000 || 0);
    last = now;
    step(dt);
    draw();
    hudT += dt;
    if (hudT > 0.4) { hudT = 0; updateHud(); }
    requestAnimationFrame(frame);
  }

  function setRunning() {
    var should = visible && !document.hidden && !reduceMotion.matches;
    if (should && !running) {
      running = true;
      last = performance.now();
      requestAnimationFrame(frame);
    } else if (!should) running = false;
    if (hud) hud.hidden = reduceMotion.matches;
  }

  function stillFrame() {
    for (var i = 0; i < 240; i++) step(1 / 30);
    draw();
  }

  function resize() {
    var r = hero.getBoundingClientRect();
    if (Math.abs(r.width - W) < 1 && Math.abs(r.height - H) < 1 && drones.length) return;
    W = r.width; H = r.height;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildCity();
    placePads();
    drones = [];
    pairs = {};
    syncCount();
    if (reduceMotion.matches) stillFrame();
    else if (!running) draw();
  }

  readPalette();
  resize();
  updateHud();
  hero.classList.add("has-sim");

  if ("ResizeObserver" in window) new ResizeObserver(resize).observe(hero);
  else window.addEventListener("resize", resize);

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (e) { visible = e[0].isIntersecting; setRunning(); }).observe(hero);
  }
  document.addEventListener("visibilitychange", setRunning);
  if (reduceMotion.addEventListener) {
    reduceMotion.addEventListener("change", function () {
      setRunning();
      if (reduceMotion.matches) stillFrame();
    });
  }

  new MutationObserver(function () {
    readPalette();
    buildCity();
    if (!running) draw();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  hero.addEventListener("pointermove", function (e) {
    if (e.pointerType !== "mouse") return;
    var r = canvas.getBoundingClientRect();
    pointer = { x: e.clientX - r.left, y: e.clientY - r.top };
  });
  hero.addEventListener("pointerleave", function () { pointer = null; });

  setRunning();
})();
