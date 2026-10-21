// Випадаючі меню для телефону та пошти (hover на десктопі, тап на мобільних).
// Розмітка: <a class="contact-trigger" data-contact="phone|email" href="tel:...|mailto:...">
(function () {
  const PHONE = "+380938278066";
  const EMAIL = "ocinka@expert365.com";
  const SUBJECT = "Запит на оцінку";

  const MAILTO = `mailto:${EMAIL}?subject=${encodeURIComponent(SUBJECT)}`;
  const GMAIL = `https://mail.google.com/mail/?view=cm&to=${EMAIL}&su=${encodeURIComponent(SUBJECT)}`;

  const ICONS = {
    phone: '<i class="fas fa-phone"></i>',
    viber: '<i class="fab fa-viber"></i>',
    telegram: '<i class="fab fa-telegram-plane"></i>',
    whatsapp: '<i class="fab fa-whatsapp"></i>',
    mail: '<i class="far fa-envelope"></i>',
    gmail: '<i class="fab fa-google"></i>',
    copy: '<i class="far fa-copy"></i>',
  };

  const MENUS = {
    phone: {
      title: "Зв'язатися за номером",
      items: [
        { icon: "phone", tone: "blue", label: "Подзвонити", hint: "+38 (093) 82-78-066", href: `tel:${PHONE}` },
        { icon: "viber", tone: "violet", label: "Viber", hint: "Написати в чат", href: `viber://chat?number=${encodeURIComponent(PHONE)}`, blank: true },
        { icon: "telegram", tone: "sky", label: "Telegram", hint: "Написати в чат", href: `https://t.me/${PHONE}`, blank: true },
        { icon: "whatsapp", tone: "green", label: "WhatsApp", hint: "Написати в чат", href: `https://wa.me/${PHONE.slice(1)}`, blank: true },
      ],
    },
    email: {
      items: [
        { icon: "mail", tone: "blue", label: "Написати листа", hint: "Відкриється ваша пошта", href: MAILTO, action: "mailto" },
        { icon: "gmail", tone: "red", label: "Написати через Gmail", hint: "Якщо пошта не відкрилась", href: GMAIL, blank: true, gmail: true },
        { icon: "copy", tone: "gray", label: "Скопіювати адресу", hint: EMAIL, action: "copy" },
      ],
    },
  };

  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  let openMenu = null;

  function buildMenu(type) {
    const config = MENUS[type];
    const menu = document.createElement("div");
    menu.className = `contact-menu contact-menu--${type}`;
    menu.setAttribute("role", "menu");

    if (config.title) {
      const title = document.createElement("div");
      title.className = "contact-menu__title";
      title.textContent = config.title;
      menu.appendChild(title);
    }

    config.items.forEach((item) => {
      const el = document.createElement(item.href ? "a" : "button");
      el.className = "contact-menu__item";
      el.setAttribute("role", "menuitem");
      if (item.href) el.href = item.href;
      else el.type = "button";
      if (item.blank) {
        el.target = "_blank";
        el.rel = "noopener noreferrer";
      }
      if (item.gmail) el.hidden = true;
      if (item.action) el.dataset.action = item.action;

      el.innerHTML = `
        <span class="contact-menu__icon contact-menu__icon--${item.tone}">${ICONS[item.icon]}</span>
        <span class="contact-menu__text">
          <span class="contact-menu__label"></span>
          <span class="contact-menu__hint"></span>
        </span>`;
      el.querySelector(".contact-menu__label").textContent = item.label;
      el.querySelector(".contact-menu__hint").textContent = item.hint;
      menu.appendChild(el);
    });

    return menu;
  }

  function position(trigger, menu) {
    const gap = 8;
    const margin = 12;
    const rect = trigger.getBoundingClientRect();
    // У <dialog> з transform position: fixed рахується від самого діалогу.
    const host = menu.parentNode;
    const origin = host === document.body ? { left: 0, top: 0 } : host.getBoundingClientRect();
    const width = menu.offsetWidth;
    const height = menu.offsetHeight;

    let left = rect.left;
    left = Math.min(left, window.innerWidth - width - margin);
    left = Math.max(left, margin);

    let top = rect.bottom + gap;
    if (top + height > window.innerHeight - margin && rect.top - gap - height > margin) {
      top = rect.top - gap - height;
    }

    menu.style.left = `${left - origin.left}px`;
    menu.style.top = `${top - origin.top}px`;
  }

  function show(widget) {
    if (openMenu && openMenu !== widget) hide(openMenu);
    clearTimeout(widget.closeTimer);
    // Меню всередині <dialog> має жити в ньому, інакше опиниться під модальним шаром.
    const host = widget.trigger.closest("dialog") || document.body;
    if (widget.menu.parentNode !== host) host.appendChild(widget.menu);
    widget.menu.classList.add("is-open");
    widget.trigger.setAttribute("aria-expanded", "true");
    position(widget.trigger, widget.menu);
    openMenu = widget;
  }

  function hide(widget) {
    clearTimeout(widget.closeTimer);
    widget.menu.classList.remove("is-open");
    widget.trigger.setAttribute("aria-expanded", "false");
    if (openMenu === widget) openMenu = null;
  }

  function scheduleHide(widget) {
    clearTimeout(widget.closeTimer);
    widget.closeTimer = setTimeout(() => hide(widget), 180);
  }

  function showCopied(button) {
    const hint = button.querySelector(".contact-menu__hint");
    button.classList.add("is-copied");
    hint.textContent = "Скопійовано!";
    clearTimeout(button.copiedTimer);
    button.copiedTimer = setTimeout(() => {
      button.classList.remove("is-copied");
      hint.textContent = EMAIL;
    }, 2000);
  }

  function copyEmail(button) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(EMAIL).then(() => showCopied(button), () => legacyCopy(button));
    } else {
      legacyCopy(button);
    }
  }

  function legacyCopy(button) {
    const input = document.createElement("input");
    input.value = EMAIL;
    input.style.position = "fixed";
    input.style.opacity = "0";
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    input.remove();
    showCopied(button);
  }

  // Якщо після mailto: сторінка не втратила фокус — поштової програми, ймовірно, немає.
  function watchMailClient(menu) {
    let left = false;
    const onBlur = () => (left = true);
    window.addEventListener("blur", onBlur, { once: true });
    setTimeout(() => {
      window.removeEventListener("blur", onBlur);
      if (!left && document.hasFocus()) {
        document.querySelectorAll(".contact-menu--email [hidden]").forEach((el) => (el.hidden = false));
        if (menu.classList.contains("is-open") && openMenu) position(openMenu.trigger, menu);
      }
    }, 1000);
  }

  function init(trigger) {
    const type = trigger.dataset.contact;
    if (!MENUS[type]) return;

    const widget = { trigger, menu: buildMenu(type), closeTimer: null };
    trigger.setAttribute("aria-haspopup", "menu");
    trigger.setAttribute("aria-expanded", "false");
    if (type === "email") trigger.href = MAILTO;

    if (canHover) {
      [trigger, widget.menu].forEach((el) => {
        el.addEventListener("mouseenter", () => show(widget));
        el.addEventListener("mouseleave", () => scheduleHide(widget));
      });
      // Клік по самому номеру одразу телефонує; по пошті — відкриває меню.
      if (type === "email") {
        trigger.addEventListener("click", (e) => {
          e.preventDefault();
          show(widget);
        });
      }
    } else {
      // На тач-пристроях перший тап відкриває меню.
      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        widget.menu.classList.contains("is-open") ? hide(widget) : show(widget);
      });
    }

    // Лише для клавіатури: на тач-пристроях focus приходить разом із тапом.
    trigger.addEventListener("focus", () => {
      if (trigger.matches(":focus-visible")) show(widget);
    });

    widget.menu.addEventListener("click", (e) => {
      // Не даємо кліку дійти до <dialog>, який закривається по кліку поза своїми межами.
      e.stopPropagation();
      const item = e.target.closest(".contact-menu__item");
      if (!item) return;
      if (item.dataset.action === "copy") {
        e.preventDefault();
        copyEmail(item);
        return;
      }
      if (item.dataset.action === "mailto") watchMailClient(widget.menu);
      if (!canHover) hide(widget);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".contact-trigger").forEach(init);

    document.addEventListener("click", (e) => {
      if (!openMenu) return;
      if (openMenu.trigger.contains(e.target) || openMenu.menu.contains(e.target)) return;
      hide(openMenu);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && openMenu) hide(openMenu);
    });
    window.addEventListener("resize", () => openMenu && position(openMenu.trigger, openMenu.menu));
    window.addEventListener("scroll", () => openMenu && position(openMenu.trigger, openMenu.menu), { passive: true });
  });
})();
