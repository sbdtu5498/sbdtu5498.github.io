'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });





// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-select-value]"); // FIXED: removed extra 'c'
const filterBtn = document.querySelectorAll("[data-filter-btn]");

if (select) {
  select.addEventListener("click", function () { elementToggleFunc(this); });
}

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form && form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// Utility to activate a page by its data-page value (lowercased string)
const activatePage = function(targetPageKey) {
  for (let j = 0; j < pages.length; j++) {
    if (pages[j].dataset.page === targetPageKey) {
      pages[j].classList.add("active");
    } else {
      pages[j].classList.remove("active");
    }
  }
};

// Utility to activate a nav button by its label (lowercased string)
const activateNav = function(targetPageKey) {
  for (let k = 0; k < navigationLinks.length; k++) {
    const linkKey = navigationLinks[k].innerText.trim().toLowerCase();
    if (linkKey === targetPageKey) {
      navigationLinks[k].classList.add("active");
    } else {
      navigationLinks[k].classList.remove("active");
    }
  }
};

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    const selectedValue = this.innerText.trim().toLowerCase();

    activatePage(selectedValue);
    activateNav(selectedValue);
    window.scrollTo(0, 0);
  });
}

// Sync initial navbar active state with the currently active page on load
(function syncInitialNavToActivePage() {
  const activeArticle = document.querySelector('[data-page].active');
  if (activeArticle) {
    const key = activeArticle.dataset.page;
    activateNav(key);
  }
})();
// --------------------------------------------------
//  Contact form mail app handoff
// --------------------------------------------------
(function() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const btn  = form.querySelector("[data-form-btn]");

  form.addEventListener("submit", function(evt) {
    if (!form.checkValidity()) {
      evt.preventDefault();
      return;
    }

    if (btn) {
      btn.setAttribute("disabled", "");
      btn.innerHTML = '<ion-icon name="paper-plane"></ion-icon> <span>Opening mail app</span>';
    }
  });
})();

// Keep embedded artifacts rendered at a desktop-sized viewport on phones.
(function syncArtifactPreviewScale() {
  const previews = document.querySelectorAll(".artifact-preview");
  if (!previews.length) return;

  const setScale = function(preview) {
    const frameWidth = Number.parseFloat(getComputedStyle(preview).getPropertyValue("--artifact-frame-width")) || 900;
    const scale = Math.min(1, preview.clientWidth / frameWidth);
    preview.style.setProperty("--artifact-scale", scale.toFixed(4));
    preview.style.setProperty("--artifact-scale-inverse", (1 / scale).toFixed(4));
  };

  previews.forEach(setScale);

  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(function(entries) {
      entries.forEach(function(entry) {
        setScale(entry.target);
      });
    });

    previews.forEach(function(preview) {
      observer.observe(preview);
    });
  } else {
    window.addEventListener("resize", function() {
      previews.forEach(setScale);
    });
  }
})();

// --------------------------------------------------
//  Service Worker Registration for Performance & Offline Support
// --------------------------------------------------
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('[SW] Registered successfully:', registration.scope);
        
        // Check for updates periodically
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[SW] New version available! Refresh to update.');
            }
          });
        });
      })
      .catch((error) => {
        console.log('[SW] Registration failed:', error);
      });
  });
}
