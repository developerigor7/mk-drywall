(function () {
  "use strict";

  const WHATSAPP_BASE =
    "https://api.whatsapp.com/qr/YDAM5PQMR6JYL1?autoload=1&app_absent=0";

  const DEFAULT_MESSAGE =
    "Olá, gostaria de solicitar um orçamento com a MK Drywall Soluções.";

  /**
   * Monta URL do WhatsApp com mensagem pré-preenchida.
   * Usa o link oficial da empresa e acrescenta o parâmetro text quando suportado.
   */
  function buildWhatsAppUrl(message) {
    const encoded = encodeURIComponent(message);
    const separator = WHATSAPP_BASE.includes("?") ? "&" : "?";
    return `${WHATSAPP_BASE}${separator}text=${encoded}`;
  }

  /* Header scroll + mobile menu */
  const header = document.getElementById("header");
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  function onScroll() {
    if (window.scrollY > 60) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      const isOpen = navMenu.classList.toggle("is-open");
      navToggle.classList.toggle("is-active", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute(
        "aria-label",
        isOpen ? "Fechar menu" : "Abrir menu"
      );
    });

    navMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navMenu.classList.remove("is-open");
        navToggle.classList.remove("is-active");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Scroll reveal */
  const revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && revealEls.length) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = `${Math.min(i % 5, 4) * 0.08}s`;
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* Stagger cards on hover (subtle) */
  document.querySelectorAll(".card--feature, .card--service").forEach(function (card) {
    card.addEventListener("mouseenter", function () {
      card.style.transitionDelay = "0s";
    });
  });

  /* Phone mask */
  const telefoneInput = document.getElementById("telefone");

  if (telefoneInput) {
    telefoneInput.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, "").slice(0, 11);
      if (value.length > 6) {
        value = value.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, "($1) $2-$3");
      } else if (value.length > 2) {
        value = value.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
      } else if (value.length > 0) {
        value = "(" + value;
      }
      e.target.value = value.trim();
    });
  }

  /* Orçamento form */
  const form = document.getElementById("orcamentoForm");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const nome = document.getElementById("nome");
      const telefone = document.getElementById("telefone");
      let valid = true;

      [nome, telefone].forEach(function (field) {
        field.classList.remove("is-invalid");
        if (!field.value.trim()) {
          field.classList.add("is-invalid");
          valid = false;
        }
      });

      if (!valid) {
        (nome.value.trim() ? telefone : nome).focus();
        return;
      }

      const nomeVal = nome.value.trim();
      const telVal = telefone.value.trim();
      let message =
        "Olá, meu nome é " +
        nomeVal +
        " e gostaria de solicitar um orçamento.";

      if (telVal) {
        message += " Meu telefone: " + telVal + ".";
      }

      window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");
    });
  }

  /* WhatsApp floating button */
  const whatsappFloat = document.getElementById("whatsappFloat");

  if (whatsappFloat) {
    whatsappFloat.href = buildWhatsAppUrl(DEFAULT_MESSAGE);
  }

  /* Lightbox */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");
  const triggers = document.querySelectorAll(".galeria__trigger");

  let galleryItems = [];
  let currentIndex = 0;

  triggers.forEach(function (btn) {
    const img = btn.querySelector("img");
    if (img) {
      galleryItems.push({
        src: img.src.replace(/w=\d+/, "w=1200"),
        alt: img.alt,
      });
    }
  });

  function openLightbox(index) {
    if (!galleryItems.length || !lightbox) return;

    currentIndex = index;
    updateLightboxImage();
    lightbox.removeAttribute("hidden");
    requestAnimationFrame(function () {
      lightbox.classList.add("is-open");
    });
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
    setTimeout(function () {
      lightbox.setAttribute("hidden", "");
    }, 300);
  }

  function updateLightboxImage() {
    const item = galleryItems[currentIndex];
    if (!item) return;
    lightboxImg.src = item.src;
    lightboxImg.alt = item.alt;
    lightboxCaption.textContent = item.alt;
  }

  function showPrev() {
    currentIndex =
      (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    updateLightboxImage();
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % galleryItems.length;
    updateLightboxImage();
  }

  triggers.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const index = parseInt(btn.getAttribute("data-index"), 10) || 0;
      openLightbox(index);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener("click", showPrev);
  if (lightboxNext) lightboxNext.addEventListener("click", showNext);

  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener("keydown", function (e) {
    if (!lightbox || !lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showPrev();
    if (e.key === "ArrowRight") showNext();
  });

  /* Footer year */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
