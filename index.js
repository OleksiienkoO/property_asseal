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

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded, initializing...");
  initNavigation();
  initServiceDialog();
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

  console.log("Service buttons found:", serviceButtons.length);
  console.log("Service dialog found:", !!serviceDialog);

  if (!serviceDialog) {
    console.error("Service dialog not found!");
    return;
  }

  serviceButtons.forEach((btn) => {
    btn.addEventListener("click", function (event) {
      event.preventDefault();
      console.log("Button clicked, opening dialog...");
      serviceDialog.showModal();
      document.body.style.overflow = "hidden";

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
    document.body.style.overflow = "auto";
  }
}
