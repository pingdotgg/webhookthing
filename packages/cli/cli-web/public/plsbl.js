!(function () {
  "use strict";
  var s = window.location,
    a = window.document,
    r = a.currentScript,
    o = r.getAttribute("data-api") || new URL(r.src).origin + "/api/event";
  function l(t) {
    console.warn("Ignoring Event: " + t);
  }
  function t(t, e) {
    if (
      !(
        window._phantom ||
        window.__nightmare ||
        window.navigator.webdriver ||
        window.Cypress
      )
    ) {
      try {
        if ("true" === window.localStorage.plausible_ignore)
          return l("localStorage flag");
      } catch (t) {}
      var n = {};
      (n.n = t),
        (n.u = s.href),
        (n.d = r.getAttribute("data-domain")),
        (n.r = a.referrer || null),
        (n.w = window.innerWidth),
        e && e.meta && (n.m = JSON.stringify(e.meta)),
        e && e.props && (n.p = e.props);
      var i = new XMLHttpRequest();
      i.open("POST", o, !0),
        i.setRequestHeader("Content-Type", "text/plain"),
        i.send(JSON.stringify(n)),
        (i.onreadystatechange = function () {
          4 === i.readyState && e && e.callback && e.callback();
        });
    }
  }
  var e = (window.plausible && window.plausible.q) || [];
  window.plausible = t;
  for (var n, i = 0; i < e.length; i++) t.apply(this, e[i]);
  function p() {
    n !== s.pathname && ((n = s.pathname), t("pageview"));
  }
  var c,
    u = window.history;
  u.pushState &&
    ((c = u.pushState),
    (u.pushState = function () {
      c.apply(this, arguments), p();
    }),
    window.addEventListener("popstate", p)),
    "prerender" === a.visibilityState
      ? a.addEventListener("visibilitychange", function () {
          n || "visible" !== a.visibilityState || p();
        })
      : p();
  var d = 1;
  function f(t) {
    if ("auxclick" !== t.type || t.button === d) {
      var e,
        n,
        i,
        a,
        r,
        o = (function (t) {
          for (
            ;
            t &&
            (void 0 === t.tagName ||
              !(e = t) ||
              !e.tagName ||
              "a" !== e.tagName.toLowerCase() ||
              !t.href);

          )
            t = t.parentNode;
          var e;
          return t;
        })(t.target);
      o && o.href && o.href.split("?")[0];
      if ((r = o) && r.href && r.host && r.host !== s.host)
        return (
          (e = t),
          (i = {
            name: "Outbound Link: Click",
            props: {
              url: (n = o).href,
            },
          }),
          (a = !1),
          void (!(function (t, e) {
            if (!t.defaultPrevented) {
              var n = !e.target || e.target.match(/^_(self|parent|top)$/i),
                i =
                  !(t.ctrlKey || t.metaKey || t.shiftKey) && "click" === t.type;
              return n && i;
            }
          })(e, n)
            ? plausible(i.name, {
                props: i.props,
              })
            : (plausible(i.name, {
                props: i.props,
                callback: l,
              }),
              setTimeout(l, 5e3),
              e.preventDefault()))
        );
    }
    function l() {
      a || ((a = !0), (window.location = n.href));
    }
  }
  a.addEventListener("click", f), a.addEventListener("auxclick", f);
})();
