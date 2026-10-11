(function () {
  'use strict';

  /* ---------- Edit the words here ---------- */
  var CONFIG = {
    name: '',              // her name, shown under the title when filled in
    from: 'Yours, always',
    since: '',             // YYYY-MM-DD, shows how many days you have been together when filled in
    letter: [
      'Today the world got you, and I got to be the one who loves you. I tried to find words that match what you are to me, and every one I found was too small. So I built you a small place instead, quiet and soft, where you can wander at your own pace.',
      'You are the calm in my loudest days and the reason a plain evening turns into something I want to remember. When you laugh, I forget what I was worried about. When you are tired, I wish I could carry it for you.',
      'Take your time here. Open the windows, light the candle, pull the stars down one by one, and look through the few things that remind me of you. Each one is you.',
      'I love you more than this page can hold.'
    ],
    hello: 'Happy birthday, my angel,',
    openWhen: [
      { label: 'You miss me', text: 'Close your eyes and breathe out slowly. I am thinking of you right now, even if you cannot feel it. Look at the moon tonight. I will be under the same one.' },
      { label: 'You cannot sleep', text: 'Put a hand on your chest and count ten slow breaths as you taught me before honey. Then picture the softest place you know and let me be standing in it. You are safe, you are loved, and the night will end gently.' },
      { label: 'You feel small', text: 'You are not small. You take up exactly the room a person like you should, and the world is better lit for it. Drink some water, sit up straight, and be proud of one thing you did today.' },
      { label: 'You want to laugh', text: 'Say "idk hehe" but say it out loud in your most dramatic voice and try to keep a straight face. If it did not work, I am laughing with you from far away, and I love you for it.' }
    ],
    stars: [
      'The way you go quiet when something is truly beautiful.',
      'Your laugh, especially the one that escapes before you can stop it.',
      'How gentle you are with soft, small things.',
      'That you make an ordinary evening feel like somewhere to stay.',
      'Your personality and the way its make me fall more and more.',
      'The strength you carry without ever announcing it.',
      'How you make me want to be softer and braver at once.',
      'Every version of you: the tired one, the silly one, the shining one.',
      'That out of everyone in the world, you let me love you.'
    ],
    starsDone: 'That is the whole sky. It is yours, and so am I.',
    things: [
      { src: 'giselle-2.jpg', title: 'Giselle', alt: 'Photo of Giselle with a hand in her hair', note: 'That glance through her hair, mysterious and a little shy. I cannot look away from it without seeing you in her mary.' },
      { src: 'wolves.jpg', title: 'Two wolves', alt: 'A black wolf and a white wolf pressing their heads together in the snow', note: 'One dark, one pale, leaning into each other in the snow. Wild with the world and tender with each other. That is how I see us.' },
      { src: 'eyes-sketch.jpg', title: 'Sleepy lashes', alt: 'Drawing of half-closed eyes with long lashes', note: 'Drawn eyes half closed in a dream. I feel that you look like this right before you fall asleep, and I wish I can see that one day.' },
      { src: 'lilies-white.jpg', title: 'White lilies', alt: 'Large white lilies in bloom', note: 'Pure white, impossible to ignore, and the scent fills the whole room. Just like you.' }
    ]
  };
  var STAR_POS = [[12, 70], [22, 40], [34, 60], [44, 26], [55, 52], [64, 20], [74, 48], [84, 28], [90, 64]];

  /* ---------- helpers ---------- */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var ls = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  /* ---------- theme ---------- */
  var root = document.documentElement;
  function effectiveTheme() {
    return root.getAttribute('data-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }
  function syncThemeLabel() { $('#themeLabel').textContent = effectiveTheme() === 'dark' ? 'day' : 'night'; }
  var savedTheme = ls.get('angel-theme');
  if (savedTheme === 'dark' || savedTheme === 'light') root.setAttribute('data-theme', savedTheme);
  syncThemeLabel();
  $('#themeBtn').addEventListener('click', function () {
    var next = effectiveTheme() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    ls.set('angel-theme', next);
    syncThemeLabel();
    readCols();
  });

  /* ---------- falling petals, hearts, bursts ---------- */
  var cv = $('#fx'), cx = cv.getContext('2d');
  var W = 0, H = 0, parts = [], running = false, cols = {};
  function readCols() {
    var s = getComputedStyle(root);
    cols = {
      a: s.getPropertyValue('--petal-a').trim() || '#fff',
      b: s.getPropertyValue('--petal-b').trim() || '#f2b8cb',
      h: s.getPropertyValue('--rose').trim() || '#c4839d',
      st: s.getPropertyValue('--line').trim() || '#00000033'
    };
  }
  function size() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function heart(c, s) {
    c.beginPath();
    c.moveTo(0, s * 0.35);
    c.bezierCurveTo(-s * 0.9, -s * 0.25, -s * 0.45, -s * 0.95, 0, -s * 0.4);
    c.bezierCurveTo(s * 0.45, -s * 0.95, s * 0.9, -s * 0.25, 0, s * 0.35);
    c.fill();
  }
  function addPetal(x, y, vx, vy, amb) {
    parts.push({ kind: 'petal', x: x, y: y, vx: vx, vy: vy, r: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.06,
      s: 6 + Math.random() * 8, c: Math.random() < 0.5 ? 'a' : 'b', life: 1, amb: !!amb, ph: Math.random() * 6.28 });
  }
  function addHeart(x, y) {
    parts.push({ kind: 'heart', x: x, y: y, vx: (Math.random() - 0.5) * 1.6, vy: -1.2 - Math.random() * 1.6, s: 8 + Math.random() * 8, life: 1 });
  }
  function kick() { if (!running) { running = true; requestAnimationFrame(tick); } }
  function tick() {
    if (!running) return;
    cx.clearRect(0, 0, W, H);
    for (var i = parts.length - 1; i >= 0; i--) {
      var p = parts[i];
      if (p.kind === 'heart') {
        p.x += p.vx; p.y += p.vy; p.vy *= 0.99; p.life -= 0.013;
        if (p.life <= 0) { parts.splice(i, 1); continue; }
        cx.save(); cx.globalAlpha = p.life; cx.translate(p.x, p.y); cx.fillStyle = cols.h; heart(cx, p.s); cx.restore();
      } else {
        p.ph += 0.03; p.x += p.vx + Math.sin(p.ph) * 0.5; p.y += p.vy; p.r += p.vr;
        if (!p.amb) { p.vy += 0.012; p.vx *= 0.995; p.life -= 0.0035; }
        if (p.y > H + 24 || p.life <= 0 || p.x < -40 || p.x > W + 40) {
          if (p.amb) { p.y = -20; p.x = Math.random() * W; } else { parts.splice(i, 1); continue; }
        }
        cx.save();
        cx.globalAlpha = p.amb ? 0.7 : Math.min(1, p.life * 1.5);
        cx.translate(p.x, p.y); cx.rotate(p.r); cx.scale(1, 0.55 + 0.45 * Math.abs(Math.sin(p.ph)));
        cx.fillStyle = cols[p.c]; cx.strokeStyle = cols.st; cx.lineWidth = 1;
        cx.beginPath(); cx.ellipse(0, 0, p.s, p.s * 0.5, 0, 0, 6.2832); cx.fill(); cx.stroke();
        cx.restore();
      }
    }
    if (parts.length) requestAnimationFrame(tick); else running = false;
  }
  function burstPetals(x, y, n) {
    for (var i = 0; i < n; i++) {
      var a = -Math.PI / 2 + (Math.random() - 0.5) * 2.2, sp = 2 + Math.random() * 5;
      addPetal(x, y, Math.cos(a) * sp, Math.sin(a) * sp - 1, false);
    }
    kick();
  }
  function burstHearts(x, y, n) {
    for (var i = 0; i < n; i++) addHeart(x + (Math.random() - 0.5) * 40, y + (Math.random() - 0.5) * 20);
    kick();
  }
  size(); readCols();
  window.addEventListener('resize', size);
  if (!reduce) {
    for (var k = 0; k < 14; k++) addPetal(Math.random() * W, Math.random() * H, (Math.random() - 0.5) * 0.4, 0.35 + Math.random() * 0.5, true);
    kick();
  }

  /* ---------- hero text ---------- */
  if (CONFIG.name) { var fn = $('#forname'); fn.textContent = 'for ' + CONFIG.name; fn.hidden = false; }
  $('#from').textContent = CONFIG.from;
  if (CONFIG.since) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(CONFIG.since);
    if (m) {
      var days = Math.floor((Date.now() - new Date(+m[1], +m[2] - 1, +m[3]).getTime()) / 86400000);
      if (days >= 0) { var sn = $('#since'); sn.textContent = days.toLocaleString('en') + ' days of you'; sn.hidden = false; }
    }
  }

  /* ---------- ears ---------- */
  var ears = $('#ears');
  ears.addEventListener('click', function (e) {
    ears.classList.remove('twitch'); void ears.getBoundingClientRect(); ears.classList.add('twitch');
    burstHearts(e.clientX, e.clientY, 7);
  });
  ears.addEventListener('animationend', function (e) { if (e.animationName === 'twitch') ears.classList.remove('twitch'); });

  /* ---------- letter ---------- */
  var letter = $('#letter');
  letter.appendChild(el('p', 'hello', CONFIG.hello));
  CONFIG.letter.forEach(function (t) { letter.appendChild(el('p', null, t)); });
  letter.appendChild(el('p', 'sign', CONFIG.from));

  /* ---------- candle ---------- */
  var candle = $('#candle'), blow = $('#blow'), relight = $('#relight'), wishIn = $('#wish'), wishMsg = $('#wishMsg');
  blow.addEventListener('click', function () {
    candle.classList.add('out');
    var r = candle.getBoundingClientRect();
    burstPetals(r.left + r.width / 2, r.top + 40, reduce ? 12 : 46);
    wishMsg.textContent = wishIn.value.trim() ? 'Sealed. It stays between you and the dark.' : 'Wish made. Keep it close.';
    wishIn.value = '';
    blow.hidden = true; relight.hidden = false;
  });
  relight.addEventListener('click', function () {
    candle.classList.remove('out');
    wishMsg.textContent = '';
    relight.hidden = true; blow.hidden = false;
  });

  /* ---------- curtained windows ---------- */
  var wins = $('#wins'), note = $('#note'), winBtns = [];
  CONFIG.openWhen.forEach(function (o) {
    var b = el('button', 'win');
    b.type = 'button';
    b.setAttribute('aria-expanded', 'false');
    b.setAttribute('aria-label', 'Open when ' + o.label.toLowerCase());
    var pane = el('span', 'pane');
    pane.appendChild(el('span', 'glass'));
    pane.appendChild(el('span', 'heart-in', '♥'));
    pane.appendChild(el('span', 'curt l'));
    pane.appendChild(el('span', 'curt r'));
    b.appendChild(pane);
    b.appendChild(el('span', 'win-label', 'Open when ' + o.label.toLowerCase()));
    b.addEventListener('click', function () {
      winBtns.forEach(function (x) { x.setAttribute('aria-expanded', 'false'); });
      b.setAttribute('aria-expanded', 'true');
      note.textContent = '';
      note.appendChild(el('p', 'n-title', 'Open when ' + o.label.toLowerCase()));
      note.appendChild(el('p', 'n-text', o.text));
      var r = b.getBoundingClientRect();
      burstHearts(r.left + r.width / 2, r.top + 30, 4);
    });
    winBtns.push(b);
    wins.appendChild(b);
  });

  /* ---------- star map ---------- */
  var sky = $('#sky'), lines = $('#lines'), dust = $('#dust'), skyMsg = $('#skyMsg'), skyCount = $('#skyCount');
  var lit = [];
  for (var d = 0; d < 46; d++) {
    var sp = document.createElement('span');
    sp.style.left = (Math.random() * 100) + '%';
    sp.style.top = (Math.random() * 100) + '%';
    sp.style.animationDelay = (-Math.random() * 4).toFixed(2) + 's';
    sp.style.animationDuration = (3 + Math.random() * 4).toFixed(2) + 's';
    dust.appendChild(sp);
  }
  function drawLines() {
    lines.textContent = '';
    for (var i = 0; i < STAR_POS.length - 1; i++) {
      if (lit[i] && lit[i + 1]) {
        var ln = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        ln.setAttribute('x1', STAR_POS[i][0]); ln.setAttribute('y1', STAR_POS[i][1]);
        ln.setAttribute('x2', STAR_POS[i + 1][0]); ln.setAttribute('y2', STAR_POS[i + 1][1]);
        lines.appendChild(ln);
      }
    }
  }
  CONFIG.stars.forEach(function (txt, i) {
    var b = el('button', 'star');
    b.type = 'button';
    b.setAttribute('aria-label', 'Star ' + (i + 1));
    b.style.left = STAR_POS[i][0] + '%';
    b.style.top = STAR_POS[i][1] + '%';
    b.addEventListener('click', function () {
      lit[i] = true; b.classList.add('lit');
      skyMsg.textContent = txt;
      var count = lit.filter(Boolean).length;
      skyCount.textContent = count + ' of ' + CONFIG.stars.length + ' lit';
      drawLines();
      var r = b.getBoundingClientRect();
      burstHearts(r.left + r.width / 2, r.top + r.height / 2, 3);
      if (count === CONFIG.stars.length) {
        sky.classList.add('done');
        setTimeout(function () { skyMsg.textContent = CONFIG.starsDone; burstPetals(window.innerWidth / 2, window.innerHeight * 0.6, reduce ? 10 : 40); }, 1400);
      }
    });
    sky.appendChild(b);
  });

  /* ---------- things that remind me of you ---------- */
  var things = $('#things'), lb = $('#lb'), lbImg = $('#lbImg'), lbTitle = $('#lbTitle'), lbNote = $('#lbNote');
  var lbIdx = 0, lbOpener = null;
  CONFIG.things.forEach(function (t, i) {
    var b = el('button', 'thing');
    b.type = 'button';
    b.setAttribute('aria-label', t.title + ': open picture');
    var img = document.createElement('img');
    img.alt = t.alt || t.title;
    img.decoding = 'async';
    img.addEventListener('load', function () { if (img.naturalHeight >= img.naturalWidth * 0.95) b.classList.add('arch'); });
    img.src = (window.ANGEL_IMAGES && window.ANGEL_IMAGES[t.src]) || t.src;
    b.appendChild(img);
    b.appendChild(el('span', 'thing-cap', t.title));
    b.addEventListener('click', function () { openLb(i, b); });
    things.appendChild(b);
  });
  function showLb(i) {
    var n = CONFIG.things.length;
    lbIdx = (i + n) % n;
    var t = CONFIG.things[lbIdx];
    lbImg.src = (window.ANGEL_IMAGES && window.ANGEL_IMAGES[t.src]) || t.src; lbImg.alt = t.alt || t.title;
    lbTitle.textContent = t.title; lbNote.textContent = t.note || '';
  }
  function openLb(i, opener) {
    lbOpener = opener; showLb(i); lb.hidden = false;
    document.body.style.overflow = 'hidden';
    $('#lbClose').focus();
  }
  function closeLb() {
    lb.hidden = true; document.body.style.overflow = '';
    if (lbOpener) lbOpener.focus();
  }
  $('#lbClose').addEventListener('click', closeLb);
  $('#lbPrev').addEventListener('click', function () { showLb(lbIdx - 1); });
  $('#lbNext').addEventListener('click', function () { showLb(lbIdx + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLb();
    else if (e.key === 'ArrowLeft') showLb(lbIdx - 1);
    else if (e.key === 'ArrowRight') showLb(lbIdx + 1);
  });

  /* ---------- moon ---------- */
  var SYN = 29.530588853, REF = 2451550.1;
  function moonAt(y, mo, da) {
    var jd = Date.UTC(y, mo - 1, da, 12) / 86400000 + 2440587.5;
    var p = ((jd - REF) / SYN) % 1; if (p < 0) p += 1;
    return { p: p, lit: (1 - Math.cos(2 * Math.PI * p)) / 2 };
  }
  var PHASES = ['New moon', 'Waxing crescent', 'First quarter', 'Waxing gibbous', 'Full moon', 'Waning gibbous', 'Last quarter', 'Waning crescent'];
  function phaseName(p) { return PHASES[Math.floor(p * 8 + 0.5) % 8]; }
  function moonSVG(p) {
    var r = 44, c = 50, k = Math.cos(2 * Math.PI * p), rx = (r * Math.abs(k)).toFixed(2), path;
    if (p < 0.5) path = 'M' + c + ' ' + (c - r) + ' A' + r + ' ' + r + ' 0 0 1 ' + c + ' ' + (c + r) + ' A' + rx + ' ' + r + ' 0 0 ' + (k > 0 ? 0 : 1) + ' ' + c + ' ' + (c - r) + ' Z';
    else path = 'M' + c + ' ' + (c - r) + ' A' + r + ' ' + r + ' 0 0 0 ' + c + ' ' + (c + r) + ' A' + rx + ' ' + r + ' 0 0 ' + (k > 0 ? 1 : 0) + ' ' + c + ' ' + (c - r) + ' Z';
    return '<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="44" class="moon-dark"/><path d="' + path + '" class="moon-lit"/></svg>';
  }
  var SIGNS = [[1, 20, 'Aquarius'], [2, 19, 'Pisces'], [3, 21, 'Aries'], [4, 20, 'Taurus'], [5, 21, 'Gemini'], [6, 21, 'Cancer'], [7, 23, 'Leo'], [8, 23, 'Virgo'], [9, 23, 'Libra'], [10, 23, 'Scorpio'], [11, 22, 'Sagittarius'], [12, 22, 'Capricorn']];
  function signOf(mo, da) {
    var name = 'Capricorn';
    SIGNS.forEach(function (s) { if (mo > s[0] || (mo === s[0] && da >= s[1])) name = s[2]; });
    return name;
  }
  var now = new Date();
  var tonight = moonAt(now.getFullYear(), now.getMonth() + 1, now.getDate());
  $('#moonNow').innerHTML = moonSVG(tonight.p);
  var toFull = Math.round(((0.5 - tonight.p + 1) % 1) * SYN);
  $('#moonNowText').textContent = phaseName(tonight.p) + ', ' + Math.round(tonight.lit * 100) + '% lit. ' +
    (toFull === 0 ? 'It is full tonight.' : 'The next full moon is in about ' + toFull + (toFull === 1 ? ' day.' : ' days.'));
  var bday = $('#bday'), bornBadge = $('#moonBorn'), bornText = $('#moonBornText');
  bornBadge.innerHTML = moonSVG(0.2);
  function showBorn(v) {
    var m2 = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v || '');
    if (!m2) return false;
    var y = +m2[1], mo = +m2[2], da = +m2[3];
    var mi = moonAt(y, mo, da);
    var dow = new Date(y, mo - 1, da).toLocaleDateString('en', { weekday: 'long' });
    bornBadge.classList.remove('empty');
    bornBadge.innerHTML = moonSVG(mi.p);
    bornText.textContent = 'You arrived on a ' + dow + ', under a ' + phaseName(mi.p).toLowerCase() + ' (' + Math.round(mi.lit * 100) + '% lit). ' + signOf(mo, da) + ' season.';
    return true;
  }
  var savedB = ls.get('angel-bday');
  if (savedB) { bday.value = savedB; showBorn(savedB); }
  bday.addEventListener('change', function () {
    if (showBorn(bday.value)) { ls.set('angel-bday', bday.value); burstPetals(window.innerWidth / 2, window.innerHeight * 0.5, reduce ? 6 : 24); }
  });

  /* ---------- music box ---------- */
  var actx = null, master = null, timer = null, stepI = 0, playing = false;
  var MEL = [74, 78, 81, 78, 76, 74, 71, 74, 76, 81, 83, 81, 78, 76, 74, 0, 81, 83, 86, 83, 81, 78, 76, 78, 74, 71, 69, 71, 74, 0, 0, 0];
  function hz(n) { return 440 * Math.pow(2, (n - 69) / 12); }
  function ping(n, t, vol, dur) {
    var f = hz(n);
    var g = actx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
    g.connect(master);
    var o1 = actx.createOscillator(); o1.type = 'triangle'; o1.frequency.value = f;
    var o2 = actx.createOscillator(); o2.type = 'sine'; o2.frequency.value = f * 2;
    var g2 = actx.createGain(); g2.gain.value = 0.22;
    o1.connect(g); o2.connect(g2); g2.connect(g);
    o1.start(t); o2.start(t); o1.stop(t + dur + 0.05); o2.stop(t + dur + 0.05);
  }
  function stepMusic() {
    var t = actx.currentTime + 0.04, n = MEL[stepI % MEL.length];
    if (n) ping(n, t, 0.2, 1.8);
    if (stepI % 8 === 0) ping(n ? n - 24 : 50, t, 0.12, 2.4);
    stepI++;
  }
  var mBtn = $('#musicBtn');
  mBtn.addEventListener('click', function () {
    try {
      if (!actx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) { $('#musicLabel').textContent = 'no sound'; return; }
        actx = new AC();
        master = actx.createGain(); master.gain.value = 0.5; master.connect(actx.destination);
      }
      if (!playing) {
        actx.resume();
        stepMusic();
        timer = setInterval(stepMusic, 420);
        playing = true;
      } else {
        clearInterval(timer); playing = false;
      }
      mBtn.setAttribute('aria-pressed', playing ? 'true' : 'false');
      $('#musicLabel').textContent = playing ? 'playing' : 'music box';
    } catch (e) { $('#musicLabel').textContent = 'no sound'; }
  });
})();