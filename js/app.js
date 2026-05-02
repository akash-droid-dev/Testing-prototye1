/* GB-GMS — interactions, smooth scroll, reveals, custom cursor */

(function () {
  "use strict";

  /* ---------- Loader ---------- */
  const loader = document.querySelector(".loader");
  if (loader) {
    let count = 0;
    const counter = loader.querySelector(".loader-count");
    const tick = setInterval(() => {
      count = Math.min(count + Math.floor(Math.random() * 9) + 3, 100);
      if (counter) counter.textContent = String(count).padStart(3, "0");
      if (count >= 100) {
        clearInterval(tick);
        setTimeout(() => loader.classList.add("is-done"), 350);
      }
    }, 80);
    window.addEventListener("load", () => {
      setTimeout(() => {
        if (counter) counter.textContent = "100";
        loader.classList.add("is-done");
      }, 1200);
    });
  }

  /* ---------- Custom cursor ---------- */
  const cursor = document.querySelector(".cursor");
  const ring = document.querySelector(".cursor-ring");
  if (cursor && ring && window.matchMedia("(min-width: 1025px)").matches) {
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;
    document.addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; });
    function loop() {
      cursor.style.left = mx + "px";
      cursor.style.top = my + "px";
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.left = rx + "px";
      ring.style.top = ry + "px";
      requestAnimationFrame(loop);
    }
    loop();

    const hovers = "a, button, .module, .pillar, .journey-img, .cta-btn, .nav-cta, [data-cursor='hover']";
    document.querySelectorAll(hovers).forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursor.classList.add("is-hover");
        ring.classList.add("is-hover");
      });
      el.addEventListener("mouseleave", () => {
        cursor.classList.remove("is-hover");
        ring.classList.remove("is-hover");
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );
  document
    .querySelectorAll(".reveal, .reveal-stagger, .split-line")
    .forEach((el) => io.observe(el));

  /* ---------- Split text into words for hero ---------- */
  document.querySelectorAll("[data-split]").forEach((el) => {
    const text = el.innerHTML;
    const tmp = document.createElement("div");
    tmp.innerHTML = text;
    // walk nodes
    const wrap = (node) => {
      if (node.nodeType === 3) {
        const frag = document.createDocumentFragment();
        node.nodeValue.split(/(\s+)/).forEach((part) => {
          if (part.trim() === "") {
            frag.appendChild(document.createTextNode(part));
          } else {
            const span = document.createElement("span");
            span.className = "word";
            span.textContent = part;
            frag.appendChild(span);
          }
        });
        node.parentNode.replaceChild(frag, node);
      } else if (node.nodeType === 1 && node.childNodes) {
        Array.from(node.childNodes).forEach(wrap);
      }
    };
    Array.from(tmp.childNodes).forEach(wrap);
    el.innerHTML = tmp.innerHTML;
  });

  /* ---------- Number counters ---------- */
  const animateNumber = (el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const duration = 1800;
    const start = performance.now();
    const startVal = 0;
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    function frame(now) {
      const t = Math.min((now - start) / duration, 1);
      const v = startVal + (target - startVal) * ease(t);
      el.textContent = v.toFixed(decimals);
      if (t < 1) requestAnimationFrame(frame);
      else el.textContent = target.toFixed(decimals);
    }
    requestAnimationFrame(frame);
  };
  const numIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateNumber(entry.target);
          numIO.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  document.querySelectorAll("[data-count]").forEach((el) => numIO.observe(el));

  /* ---------- Parallax (scroll-driven) ---------- */
  const parallaxEls = document.querySelectorAll("[data-parallax]");
  function onScroll() {
    parallaxEls.forEach((el) => {
      const rate = parseFloat(el.dataset.parallax || "0.2");
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      el.style.transform = `translate3d(0, ${center * -rate}px, 0)`;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Page transition on internal nav ---------- */
  const transition = document.querySelector(".page-transition");
  if (transition) {
    document.querySelectorAll('a[href]:not([target]):not([href^="#"]):not([href^="mailto"]):not([href^="tel"])').forEach((a) => {
      const url = a.getAttribute("href");
      if (!url) return;
      // only same-origin local files
      if (url.startsWith("http") && !url.includes(location.host)) return;
      a.addEventListener("click", (e) => {
        e.preventDefault();
        transition.classList.remove("is-in");
        transition.classList.add("is-out");
        setTimeout(() => { window.location.href = url; }, 700);
      });
    });
    window.addEventListener("pageshow", () => {
      transition.classList.remove("is-out");
      transition.classList.add("is-in");
      setTimeout(() => transition.classList.remove("is-in"), 900);
    });
  }

  /* ---------- Header background switch ---------- */
  const header = document.querySelector(".site-header");
  if (header) {
    let lastY = 0;
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      if (y > 60) header.classList.add("is-scrolled"); else header.classList.remove("is-scrolled");
      lastY = y;
    }, { passive: true });
  }
})();
