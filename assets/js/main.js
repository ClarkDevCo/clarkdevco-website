/* Clark Development Co. — menu, header, reveal, forms, hero video. No dependencies. */
(function () {
  "use strict";
  var d = document, root = d.documentElement;
  root.classList.add("js");
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Header: solid after scrolling; mobile menu */
  var header = d.querySelector(".site-header");
  if (header) {
    var onScroll = function () { header.classList.toggle("is-solid", window.scrollY > 40); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    var btn = header.querySelector(".menu-toggle"), nav = header.querySelector(".nav");
    if (btn && nav) {
      var setOpen = function (open) {
        header.classList.toggle("is-open", open);
        btn.setAttribute("aria-expanded", open ? "true" : "false");
        btn.textContent = open ? "Close" : "Menu";
      };
      btn.addEventListener("click", function () { setOpen(btn.getAttribute("aria-expanded") !== "true"); });
      d.addEventListener("keydown", function (e) { if (e.key === "Escape" && header.classList.contains("is-open")) { setOpen(false); btn.focus(); } });
      nav.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
    }
  }

  /* Subtle scroll reveal */
  var items = d.querySelectorAll(".reveal");
  if (!reduce && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (el) { io.observe(el); });
  } else { items.forEach(function (el) { el.classList.add("is-in"); }); }

  /* Hero video: only when motion is OK and data saver is off; poster otherwise */
  var v = d.querySelector("video[data-hero]");
  if (v) {
    var conn = navigator.connection || {};
    if (!reduce && !conn.saveData) {
      v.querySelectorAll("source[data-src]").forEach(function (s) { s.src = s.getAttribute("data-src"); });
      v.load();
      v.addEventListener("playing", function () { v.classList.add("is-playing"); });
      var p = v.play();
      if (p && p.catch) p.catch(function () { /* autoplay blocked: poster stays */ });
    }
  }

  /* Forms. Default: build a pre-filled email (works on any static host, incl. GitHub Pages).
     To post to Netlify Forms or Formspree instead, set data-mode="post" on the <form>
     (see the comments in the form markup). */
  var params = new URLSearchParams(location.search);
  d.querySelectorAll("form[data-contact]").forEach(function (form) {
    var topic = form.querySelector("select[name=topic]");
    if (topic && params.get("topic")) {
      var want = params.get("topic");
      Array.prototype.forEach.call(topic.options, function (o) { if (o.value === want) topic.value = want; });
    }
    form.addEventListener("submit", function (e) {
      if (form.getAttribute("data-mode") === "post") return; // let the host handle it
      e.preventDefault();
      if (!form.reportValidity()) return;
      var hp = form.querySelector(".hp input");
      if (hp && hp.value) return; // bot
      var lines = [], subject = form.getAttribute("data-subject") || "Website inquiry";
      form.querySelectorAll("[data-label]").forEach(function (f) {
        var val = f.tagName === "SELECT" ? f.options[f.selectedIndex].text : f.value.trim();
        if (val) lines.push(f.getAttribute("data-label") + ": " + val);
        if (f.name === "topic" && val) subject = "Website inquiry: " + val;
      });
      lines.push("", "Sent from " + location.href.split("?")[0]);
      var href = "mailto:chris@clarkdevco.com?cc=alex@clarkdevco.com&subject=" +
        encodeURIComponent(subject) + "&body=" + encodeURIComponent(lines.join("\n"));
      window.location.href = href;
      var status = form.querySelector(".form-status");
      if (status) { status.hidden = false; status.focus(); }
    });
  });
})();
