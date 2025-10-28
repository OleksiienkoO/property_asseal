// ============================================
// INITIALIZATION
// ============================================

document.addEventListener("DOMContentLoaded", function () {
  initCopyFunctionality();
  initNavigation();
  initServiceDialog();
});

// ============================================
// COPY TO CLIPBOARD FUNCTIONALITY
// ============================================

function initCopyFunctionality() {
  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      showNotification("Скопійовано!", "success");
    }).catch(err => {
      console.error('Failed to copy:', err);
      showNotification("Помилка копіювання", "error");
    });
  }

  function showNotification(message, type = "success") {
    const notification = document.getElementById("copyNotification");
    
    if (notification) {
      notification.querySelector("span").textContent = message;
      notification.classList.add("show");

      setTimeout(() => {
        notification.classList.remove("show");
      }, 2500);
    }
  }

  // Copy elements from header
  const copyElements = document.querySelectorAll(".phone, .email, .address");

  copyElements.forEach((element) => {
    element.addEventListener("click", function (e) {
      e.stopPropagation();
      let textToCopy = "";

      if (this.classList.contains("phone")) {
        textToCopy = "(093) 45-19-023";
      } else if (this.classList.contains("email")) {
        textToCopy = "exprertna_ocinka_maina@urk.net";
      } else if (this.classList.contains("address")) {
        const span = this.querySelector("span");
        textToCopy = span ? span.textContent : this.textContent;
      }

      if (textToCopy) {
        copyToClipboard(textToCopy);
      }
    });
  });

  // Copy elements from dialog
  const dialogCopyElements = document.querySelectorAll(".contact-item-dialog.phone, .contact-item-dialog.email");
  
  dialogCopyElements.forEach((element) => {
    element.addEventListener("click", function (e) {
      e.stopPropagation();
      let textToCopy = "";

      if (this.classList.contains("phone")) {
        const phoneNumber = this.querySelector(".phone-number");
        textToCopy = phoneNumber ? phoneNumber.textContent : "(093) 45-19-023";
      } else if (this.classList.contains("email")) {
        const emailElement = this.querySelector("p");
        textToCopy = emailElement ? emailElement.textContent : "expertna_ocinka_maina@urk.net";
      }

      if (textToCopy) {
        copyToClipboard(textToCopy);
      }
    });
  });
}

// ============================================
// NAVIGATION
// ============================================

function initNavigation() {
  const navItems = document.querySelectorAll(".navigation-list li");

  navItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      // Don't handle if clicking on a link
      if (e.target.tagName === 'A') return;
      
      const targetId = this.getAttribute("data-target");
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        // Миттєво активуємо пункт меню
        navItems.forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');

        const offsetTop = targetSection.offsetTop - 100;

        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    });
  });

  // Highlight active section on scroll
  window.addEventListener('scroll', highlightActiveSection);
  
  // Initial highlight
  highlightActiveSection();
}

function highlightActiveSection() {
  const sections = document.querySelectorAll('.section[id], .about-section[id], .contact-section[id]');
  const navItems = document.querySelectorAll('.navigation-list li[data-target]');
  
  let current = '';
  const scrollPosition = window.pageYOffset + 150; // Offset для кращого визначення
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    const sectionBottom = sectionTop + sectionHeight;
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
      current = section.getAttribute('id');
    }
  });
  
  navItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('data-target') === current) {
      item.classList.add('active');
    }
  });
}

// ============================================
// SERVICE DIALOG
// ============================================

function initServiceDialog() {
  const serviceButtons = document.querySelectorAll(".service-button");
  const serviceDialog = document.getElementById("service-dialog");
  const closeButton = document.querySelector(".close-button");

  console.log('Service buttons found:', serviceButtons.length);
  console.log('Service dialog found:', !!serviceDialog);

  if (!serviceDialog) {
    console.error('Service dialog not found!');
    return;
  }

  serviceButtons.forEach((btn) => {
    btn.addEventListener("click", function (event) {
      event.preventDefault();
      console.log('Button clicked, opening dialog...');
      serviceDialog.showModal();
      document.body.style.overflow = 'hidden';
      
      // Add entrance animation
      serviceDialog.style.animation = 'dialogFadeIn 0.3s ease-out';
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

  // Close on Escape key
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && serviceDialog.open) {
      closeDialog();
    }
  });

  function closeDialog() {
    serviceDialog.close();
    document.body.style.overflow = 'auto';
  }
}
