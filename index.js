import "./styles/base.css";
import "./styles/dialogs.css";

const currentPage = window.location.pathname;
if (currentPage.includes("banks.html")) {
  import("./styles/banks.css");
} else if (currentPage.includes("private_executors.html")) {
  import("./styles/private_executors.css");
} else if (currentPage.includes("arbitrage_manager.html")) {
  import("./styles/arbitrage_manager.css");
} else {
  import("./styles/index.css");
}

// Import responsive styles last
import("./styles/responsive.css");

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded, initializing...");
  initNavigation();
  initServiceDialog();
  initTabsScroll();
  initScrollBehavior();
});

function initNavigation() {
  const navItems = document.querySelectorAll(".navigation-list li");

  console.log("Nav items found:", navItems.length);

  navItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      if (e.target.tagName === "A") return;

      const targetId = this.getAttribute("data-target");
      const targetSection = document.getElementById(targetId);

      console.log("Clicked nav item:", targetId);

      if (targetSection) {
        navItems.forEach((nav) => nav.classList.remove("active"));
        this.classList.add("active");

        const offsetTop = targetSection.offsetTop - 100;

        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    });
  });

  // Добавляем слушатель scroll
  window.addEventListener("scroll", highlightActiveSection);

  // Вызываем после небольшой задержки, чтобы DOM точно загрузился
  requestAnimationFrame(() => {
    setTimeout(highlightActiveSection, 50);
  });
}

function highlightActiveSection() {
  const sections = document.querySelectorAll(
    ".section[id], .about-section[id], .contact-section[id], .partners-section[id]"
  );
  const navItems = document.querySelectorAll(
    ".navigation-list li[data-target]"
  );

  if (!sections.length || !navItems.length) {
    console.warn("No sections or nav items found");
    return;
  }

  let current = "";
  const scrollPosition = window.pageYOffset + 200; // Увеличил offset

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    const sectionBottom = sectionTop + sectionHeight;

    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
      current = section.getAttribute("id");
    }
  });

  // Если в самом начале страницы - подсвечиваем первую секцию
  if (!current && scrollPosition < 300) {
    current = sections[0].getAttribute("id");
  }

  console.log("Current section:", current, "Scroll:", scrollPosition);

  navItems.forEach((item) => {
    item.classList.remove("active");
    const target = item.getAttribute("data-target");
    if (target === current) {
      item.classList.add("active");
      console.log("Activated:", target);
    }
  });
}

function initServiceDialog() {
  const serviceButtons = document.querySelectorAll(".service-button");
  const serviceDialog = document.getElementById("service-dialog");
  const closeButton = document.querySelector(".close-button");

  if (!serviceDialog) {
    return;
  }

  serviceButtons.forEach((btn) => {
    btn.addEventListener("click", function (event) {
      event.preventDefault();
      console.log("Button clicked, opening dialog...");
      serviceDialog.showModal();
      document.body.classList.add("dialog-open");

      serviceDialog.style.animation = "dialogFadeIn 0.3s ease-out";
    });
  });

  if (closeButton) {
    closeButton.addEventListener("click", function () {
      closeDialog();
    });
  }

  serviceDialog.addEventListener("click", function (event) {
    const rect = serviceDialog.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    ) {
      closeDialog();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && serviceDialog.open) {
      closeDialog();
    }
  });

  function closeDialog() {
    serviceDialog.close();
    document.body.classList.remove("dialog-open");
  }
}

// Нова функція для обробки скролу табів
function initTabsScroll() {
  const tabsWrapper = document.querySelector(".tabs-wrapper");

  if (!tabsWrapper) {
    console.log("Tabs wrapper not found");
    return;
  }

  console.log("Initializing tabs scroll...");

  // Функція для оновлення індикаторів скролу
  function updateScrollIndicators() {
    const canScrollLeft = tabsWrapper.scrollLeft > 0;
    const canScrollRight =
      tabsWrapper.scrollLeft <
      tabsWrapper.scrollWidth - tabsWrapper.clientWidth - 1;

    if (canScrollLeft) {
      tabsWrapper.classList.add("can-scroll-left");
    } else {
      tabsWrapper.classList.remove("can-scroll-left");
    }

    if (canScrollRight) {
      tabsWrapper.classList.add("can-scroll-right");
    } else {
      tabsWrapper.classList.remove("can-scroll-right");
    }
  }

  // Слухаємо події скролу
  tabsWrapper.addEventListener("scroll", updateScrollIndicators);

  // Перевіряємо при завантаженні
  updateScrollIndicators();

  // Перевіряємо при зміні розміру вікна
  window.addEventListener("resize", updateScrollIndicators);

  // Прокручуємо до активного табу при завантаженні
  const activeTab = tabsWrapper.querySelector(".tab-item.active");
  if (activeTab) {
    setTimeout(() => {
      const tabRect = activeTab.getBoundingClientRect();
      const wrapperRect = tabsWrapper.getBoundingClientRect();

      // Якщо активний таб не видимий повністю
      if (
        tabRect.left < wrapperRect.left ||
        tabRect.right > wrapperRect.right
      ) {
        activeTab.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }, 100);
  }

  // Додаємо можливість свайпу на мобільних
  let isDown = false;
  let startX;
  let scrollLeft;

  tabsWrapper.addEventListener("mousedown", (e) => {
    isDown = true;
    tabsWrapper.style.cursor = "grabbing";
    startX = e.pageX - tabsWrapper.offsetLeft;
    scrollLeft = tabsWrapper.scrollLeft;
  });

  tabsWrapper.addEventListener("mouseleave", () => {
    isDown = false;
    tabsWrapper.style.cursor = "default";
  });

  tabsWrapper.addEventListener("mouseup", () => {
    isDown = false;
    tabsWrapper.style.cursor = "default";
  });

  tabsWrapper.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - tabsWrapper.offsetLeft;
    const walk = (x - startX) * 2; // Швидкість скролу
    tabsWrapper.scrollLeft = scrollLeft - walk;
  });

  console.log("Tabs scroll initialized");
}

// Нова функція для покращення поведінки скролу
function initScrollBehavior() {
  const navigation = document.querySelector(".navigation");

  if (!navigation) return;

  let lastScroll = 0;

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    // Додаємо клас при скролі
    if (currentScroll > 50) {
      navigation.classList.add("scrolled");
    } else {
      navigation.classList.remove("scrolled");
    }

    lastScroll = currentScroll;
  });

  // Smooth scroll для всіх внутрішніх посилань
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href !== "#") {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    });
  });
}

// Функція для lazy loading зображень
function initLazyLoading() {
  const images = document.querySelectorAll("img[loading='lazy']");

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.add("loaded");
          observer.unobserve(img);
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));
  } else {
    // Fallback для старих браузерів
    images.forEach((img) => {
      img.src = img.dataset.src || img.src;
    });
  }
}

// Викликаємо lazy loading після завантаження DOM
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initLazyLoading);
} else {
  initLazyLoading();
}

// Додаємо обробку помилок завантаження зображень
document.addEventListener("DOMContentLoaded", function () {
  const images = document.querySelectorAll("img");

  images.forEach((img) => {
    img.addEventListener("error", function () {
      console.warn("Failed to load image:", this.src);
      // Можна додати placeholder зображення
      this.style.background = "#f0f0f0";
      this.alt = "Зображення недоступне";
    });
  });
});

// Експортуємо функції для можливого використання
export {
  initNavigation,
  initServiceDialog,
  initTabsScroll,
  initScrollBehavior,
  initLazyLoading,
};
