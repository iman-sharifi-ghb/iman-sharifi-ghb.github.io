/* ==========================================================================
   Site extras: BibTeX copy buttons, publication topic filter, poster viewer.
   Plain JS, no build step. Every feature is progressive: without JS the
   page still shows the BibTeX, all publications, and links to full images.
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- Copy-to-clipboard (BibTeX) ---------- */
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    var target = document.querySelector(btn.getAttribute("data-copy"));
    if (!target || !navigator.clipboard) return;
    btn.hidden = false;
    var label = btn.querySelector("span");
    btn.addEventListener("click", function () {
      navigator.clipboard.writeText(target.textContent.trim()).then(function () {
        label.textContent = "Copied!";
        btn.classList.add("is-done");
        setTimeout(function () {
          label.textContent = "Copy BibTeX";
          btn.classList.remove("is-done");
        }, 1800);
      });
    });
  });

  /* ---------- Publication topic filter ---------- */
  var filter = document.querySelector(".pub-filter");
  if (filter) {
    var buttons = filter.querySelectorAll(".pub-filter__btn");
    var cards = document.querySelectorAll(".pub-card[data-topics]");
    var status = document.querySelector(".pub-filter__status");
    filter.hidden = false;

    var apply = function (topic) {
      var shown = 0;
      cards.forEach(function (card) {
        var match = !topic || card.getAttribute("data-topics").split("|").indexOf(topic) !== -1;
        card.hidden = !match;
        if (match) shown++;
      });
      // Hide empty category groups and keep their counts honest
      document.querySelectorAll(".pub-group").forEach(function (group) {
        var visible = group.querySelectorAll(".pub-card:not([hidden])").length;
        group.hidden = visible === 0;
        var count = group.querySelector(".pub-group__count");
        if (count) count.textContent = visible;
      });
      buttons.forEach(function (b) {
        b.setAttribute("aria-pressed", String(b.getAttribute("data-topic") === topic));
      });
      if (status) status.textContent = topic ? shown + (shown === 1 ? " publication" : " publications") + " on " + topic : "";
    };

    buttons.forEach(function (b) {
      b.addEventListener("click", function () { apply(b.getAttribute("data-topic")); });
    });

    // Deep links from the research cards: /publications/?topic=LLMs
    var wanted = new URLSearchParams(location.search).get("topic");
    if (wanted && filter.querySelector('[data-topic="' + CSS.escape(wanted) + '"]')) apply(wanted);
  }

  /* ---------- Scroll reveal + autoplay videos ---------- */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if ("IntersectionObserver" in window) {
    var reveals = document.querySelectorAll(".reveal");
    if (reveals.length && !reduceMotion) {
      document.documentElement.classList.add("reveal-on");
      var revealer = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            revealer.unobserve(e.target);
          }
        });
      }, { rootMargin: "0px 0px -8% 0px" });
      reveals.forEach(function (el) { revealer.observe(el); });
    }

    // Loop research clips only while on screen; never autoplay for reduced motion
    var videos = document.querySelectorAll("video[autoplay]");
    if (videos.length) {
      var player = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) e.target.play().catch(function () {});
          else e.target.pause();
        });
      });
      videos.forEach(function (v) {
        if (reduceMotion) {
          v.removeAttribute("autoplay");
          v.pause();
          v.controls = true;
        } else {
          player.observe(v);
        }
      });
    }
  }

  /* ---------- Image viewer (posters + photo galleries) ---------- */
  var openers = Array.prototype.slice.call(document.querySelectorAll("[data-viewer]"));
  if (openers.length && typeof HTMLDialogElement === "function") {
    var dialog = document.createElement("dialog");
    dialog.className = "viewer";
    dialog.innerHTML =
      '<div class="viewer__bar">' +
        '<span class="viewer__title"></span>' +
        '<span class="viewer__count"></span>' +
        '<span class="viewer__tip">Click the image to zoom &middot; Esc to close</span>' +
        '<button type="button" class="viewer__close" aria-label="Close"><i class="fas fa-xmark" aria-hidden="true"></i></button>' +
      "</div>" +
      '<div class="viewer__stage"><img class="viewer__img" alt=""></div>' +
      '<button type="button" class="viewer__nav viewer__nav--prev" aria-label="Previous image"><i class="fas fa-chevron-left" aria-hidden="true"></i></button>' +
      '<button type="button" class="viewer__nav viewer__nav--next" aria-label="Next image"><i class="fas fa-chevron-right" aria-hidden="true"></i></button>';
    document.body.appendChild(dialog);

    var stage = dialog.querySelector(".viewer__stage");
    var img = dialog.querySelector(".viewer__img");
    var group = [], index = 0;

    var setZoom = function (on, e) {
      // Keep the clicked point under the cursor when zooming in
      var rect = img.getBoundingClientRect();
      var fx = e ? (e.clientX - rect.left) / rect.width : 0.5;
      var fy = e ? (e.clientY - rect.top) / rect.height : 0.5;
      dialog.classList.toggle("is-zoomed", on);
      if (on) {
        stage.scrollLeft = fx * img.scrollWidth - stage.clientWidth / 2;
        stage.scrollTop = fy * img.scrollHeight - stage.clientHeight / 2;
      }
    };

    var show = function (i) {
      index = (i + group.length) % group.length;
      var a = group[index], thumb = a.querySelector("img");
      dialog.classList.remove("is-zoomed");
      dialog.classList.add("no-zoom");
      img.src = a.getAttribute("href");
      img.alt = thumb ? thumb.alt : "";
      dialog.querySelector(".viewer__title").textContent = a.getAttribute("data-viewer-title") || "";
      dialog.querySelector(".viewer__count").textContent = group.length > 1 ? (index + 1) + " / " + group.length : "";
      dialog.classList.toggle("has-nav", group.length > 1);
    };

    // Only offer zoom when the image is larger than the space it is shown in
    img.addEventListener("load", function () {
      var fits = img.naturalWidth <= stage.clientWidth && img.naturalHeight <= stage.clientHeight;
      dialog.classList.toggle("no-zoom", fits);
    });

    openers.forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        var box = a.closest("[data-viewer-group]");
        group = box ? Array.prototype.slice.call(box.querySelectorAll("[data-viewer]")) : [a];
        show(group.indexOf(a));
        dialog.showModal();
      });
    });

    img.addEventListener("click", function (e) {
      if (dialog.classList.contains("no-zoom")) return;
      setZoom(!dialog.classList.contains("is-zoomed"), e);
    });
    dialog.querySelector(".viewer__close").addEventListener("click", function () { dialog.close(); });
    dialog.querySelector(".viewer__nav--prev").addEventListener("click", function () { show(index - 1); });
    dialog.querySelector(".viewer__nav--next").addEventListener("click", function () { show(index + 1); });
    dialog.addEventListener("keydown", function (e) {
      if (group.length < 2) return;
      if (e.key === "ArrowLeft") { e.preventDefault(); show(index - 1); }
      if (e.key === "ArrowRight") { e.preventDefault(); show(index + 1); }
    });
    // Clicking the dark backdrop (outside the image) closes the viewer
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog || e.target === stage) dialog.close();
    });
  }

  /* ---------- Click-to-play YouTube talks ---------- */
  // Nothing is requested from YouTube until the visitor presses play.
  document.querySelectorAll("[data-youtube]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      var id = a.getAttribute("data-youtube");
      var frame = document.createElement("iframe");
      frame.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(id) + "?autoplay=1&rel=0";
      frame.title = a.getAttribute("data-title") || "Talk video";
      frame.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
      frame.allowFullscreen = true;
      a.parentNode.replaceChild(frame, a);
    });
  });
})();
