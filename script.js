document.documentElement.classList.add("js-ready");
document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const header = document.querySelector("#site-header");
  const menuButton = document.querySelector("#menu-toggle");
  const nav = document.querySelector("#primary-nav");
  root.style.setProperty("--page-bg", "#0b1016");

  // The navigation remains ordinary links when JavaScript is unavailable.
  if (header) {
    const updateHeader = () =>
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    window.addEventListener("scroll", updateHeader, { passive: true });
    updateHeader();
  }
  if (menuButton && nav) {
    const setMenu = (open, restoreFocus = false) => {
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
      nav.classList.toggle("is-open", open);
      document.body.classList.toggle("menu-open", open);
      if (open) nav.querySelector("a")?.focus();
      else if (restoreFocus) menuButton.focus();
    };
    menuButton.addEventListener("click", () => {
      setMenu(menuButton.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && nav.classList.contains("is-open"))
        setMenu(false, true);
    });
    document.addEventListener("click", (event) => {
      if (nav.classList.contains("is-open") && !header.contains(event.target))
        setMenu(false);
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 1080 && nav.classList.contains("is-open"))
        setMenu(false);
    });
  }

  // Laboratory 11: each change exists only while the pointer is over the text.
  const ambient = document.querySelector("#ambient-trigger");
  if (ambient) {
    ambient.addEventListener("mouseenter", () =>
      root.style.setProperty("--page-bg", "#18313a"),
    );
    ambient.addEventListener("mouseleave", () =>
      root.style.setProperty("--page-bg", "#0b1016"),
    );
  }
  document.querySelectorAll("[data-effect]").forEach((paragraph) => {
    paragraph.addEventListener("mouseenter", () => {
      if (paragraph.dataset.effect === "color")
        paragraph.style.color = "#a9efcb";
      if (paragraph.dataset.effect === "background")
        paragraph.style.backgroundColor = "#344b55";
      if (paragraph.dataset.effect === "temporary")
        paragraph.style.backgroundColor = "#31584f";
    });
    paragraph.addEventListener("mouseleave", () => {
      paragraph.style.color = "";
      paragraph.style.backgroundColor = "";
    });
  });

  const comparison = document.querySelector("#comparison");
  const range = document.querySelector("#compare-range");
  if (comparison && range) {
    const update = () =>
      comparison.style.setProperty("--split", `${range.value}%`);
    range.addEventListener("input", update);
    update();
    const images = [...comparison.querySelectorAll("img")];
    Promise.all(
      images.map((img) =>
        img.complete
          ? Promise.resolve()
          : new Promise((resolve) => {
              img.addEventListener("load", resolve, { once: true });
              img.addEventListener("error", resolve, { once: true });
            }),
      ),
    ).then(() => {
      comparison.classList.remove("is-loading");
      comparison.removeAttribute("aria-busy");
    });
  }

  // The gallery uses real files; the modal only changes how they are viewed.
  const dialog = document.querySelector("#media-lightbox");
  if (dialog) {
    const cards = [...document.querySelectorAll(".media-card")];
    const image = dialog.querySelector("#lightbox-image");
    const caption = dialog.querySelector("#lightbox-caption");
    const count = dialog.querySelector("#lightbox-count");
    let index = 0;
    let opener = null;
    const show = (next) => {
      index = (next + cards.length) % cards.length;
      const card = cards[index];
      const original = card.querySelector("img");
      image.src = original.getAttribute("src");
      image.alt = original.alt;
      caption.textContent = card.querySelector("figcaption").textContent.trim();
      count.textContent = `${String(index + 1).padStart(2, "0")} / ${String(cards.length).padStart(2, "0")}`;
    };
    cards.forEach((card, i) =>
      card.querySelector(".gallery-open").addEventListener("click", (event) => {
        opener = event.currentTarget;
        show(i);
        dialog.showModal();
        dialog.querySelector(".lightbox-close").focus();
      }),
    );
    dialog
      .querySelector(".lightbox-close")
      .addEventListener("click", () => dialog.close());
    dialog
      .querySelector(".lightbox-prev")
      .addEventListener("click", () => show(index - 1));
    dialog
      .querySelector(".lightbox-next")
      .addEventListener("click", () => show(index + 1));
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        show(index - 1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        show(index + 1);
      }
    });
    dialog.addEventListener("close", () => opener?.focus());
  }

  // One media item plays at a time, including across audio and video.
  const media = [...document.querySelectorAll("audio, video")];
  media.forEach((player) => {
    player.addEventListener("play", () => {
      media.forEach((other) => {
        if (other !== player) other.pause();
      });
      player.closest(".music-player")?.classList.add("is-playing");
    });
    ["pause", "ended"].forEach((event) =>
      player.addEventListener(event, () => {
        player.closest(".music-player")?.classList.remove("is-playing");
      }),
    );
  });

  const survey = document.querySelector("#visitor-survey");
  if (survey) {
    const result = document.querySelector("#survey-result");
    survey.addEventListener("submit", (event) => {
      event.preventDefault();
      const values = new FormData(survey);
      const scene =
        values.get("preferredScene") === "night" ? "ночную" : "дневную";
      result.textContent = `Спасибо, ${values.get("visitorName")}! Вы выбрали ${scene} версию. Ответ показан только в этом браузере.`;
    });
    survey.addEventListener("reset", () => {
      result.textContent = "";
    });
  }

  // Animate only entering content; the document never depends on hidden blocks.
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!motionPreference.matches && "IntersectionObserver" in window) {
    const animations = new Set();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        observer.unobserve(target);
        if (motionPreference.matches || typeof target.animate !== "function") return;
        const animation = target.animate(
          [{ opacity: 0, transform: "translateY(14px)" }, { opacity: 1, transform: "none" }],
          { duration: 600, easing: "cubic-bezier(.22,1,.36,1)" },
        );
        animations.add(animation);
        animation.finished.finally(() => animations.delete(animation)).catch(() => {});
      });
    }, { threshold: 0, rootMargin: "0px 0px -32px 0px" });
    document.querySelectorAll(".reveal, .technology-article > section").forEach(section => observer.observe(section));
    motionPreference.addEventListener("change", event => {
      if (!event.matches) return;
      observer.disconnect();
      animations.forEach(animation => animation.cancel());
      animations.clear();
    });
  }
});
