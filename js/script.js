const filterLinks = document.querySelectorAll("nav ul li a");
const allItems = document.querySelectorAll(".carousel-item, .banner");

// ✅ Define allowed categories (nav ke hisaab se)
const allowedCategories = [
  "Daily Needs",
  "Health & Wellness",
  "Education & Training",
  "Lifestyle & Living",
  "Food & Hospitality",
  "Travel & Services",
  "Puja & Religious",
  "Gift & Stationary",
  "Miscellaneous"
];

let selectedCategory = "all";

// 🟢 Apply filters
function applyFilters() {
  allItems.forEach(item => {
    let category = (item.dataset.category || "").trim();

    // ✅ fallback Miscellaneous if unknown category
    if (!allowedCategories.includes(category)) {
      category = "Miscellaneous";
      item.dataset.category = "Miscellaneous";
    }

    // ✅ Special handling for sponsored listings (carousel-item)
    if (item.classList.contains("carousel-item")) {
      // find all sponsored items of selected category
      const sponsoredInCategory = Array.from(allItems).filter(
        i =>
          i.classList.contains("carousel-item") &&
          (i.dataset.category || "").toLowerCase() ===
            selectedCategory.toLowerCase()
      );

      if (selectedCategory !== "all" && sponsoredInCategory.length <= 1) {
        // agar 0 ya 1 sponsored ho → fallback: show all sponsored
        item.classList.remove("hidden");
      } else {
        // normal filter
        const match =
          selectedCategory === "all" ||
          category.toLowerCase() === selectedCategory.toLowerCase();
        if (match) item.classList.remove("hidden");
        else item.classList.add("hidden");
      }
    } else {
      // ✅ Normal business banners (non-sponsored)
      const match =
        selectedCategory === "all" ||
        category.toLowerCase() === selectedCategory.toLowerCase();
      if (match) item.classList.remove("hidden");
      else item.classList.add("hidden");
    }
  });
}

// 🟢 Handle clicks in nav
filterLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();

    if (link.dataset.filter) {
      selectedCategory = link.dataset.filter;
    } else {
      selectedCategory = "all";
    }

    // active class update
    filterLinks.forEach(l => l.classList.remove("active"));
    link.classList.add("active");

    applyFilters();
  });
});

// =====================
//  Carousel Functionality
// =====================
const track = document.getElementById("sponsoredCarousel");
const prevBtn = document.querySelector(".carousel-btn.prev");
const nextBtn = document.querySelector(".carousel-btn.next");

let index = 0;

function moveCarousel() {
  const visibleItems = track.querySelectorAll(".carousel-item:not(.hidden)");
  if (visibleItems.length === 0) return;

  const itemWidth = visibleItems[0].offsetWidth || 0;
  track.style.transform = `translateX(${-index * itemWidth}px)`;
}

function getItemsPerView() {
  if (window.innerWidth <= 600) return 1;
  if (window.innerWidth <= 1024) return 2;
  return 3;
}

function nextSlide() {
  const visibleItems = track.querySelectorAll(".carousel-item:not(.hidden)");
  let itemsPerView = getItemsPerView();
  if (visibleItems.length === 0) return;

  if (index < visibleItems.length - itemsPerView) {
    index++;
  } else {
    index = 0;
  }
  moveCarousel();
}

function prevSlide() {
  const visibleItems = track.querySelectorAll(".carousel-item:not(.hidden)");
  let itemsPerView = getItemsPerView();
  if (visibleItems.length === 0) return;

  if (index > 0) {
    index--;
  } else {
    index = visibleItems.length - itemsPerView;
  }
  moveCarousel();
}

// auto scroll
let autoScroll = setInterval(nextSlide, 3000);

function resetAutoScroll() {
  clearInterval(autoScroll);
  autoScroll = setInterval(nextSlide, 3000);
}

nextBtn.addEventListener("click", () => {
  nextSlide();
  resetAutoScroll();
});
prevBtn.addEventListener("click", () => {
  prevSlide();
  resetAutoScroll();
});

window.addEventListener("resize", () => moveCarousel());

// =====================
//  Lightbox
// =====================
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const closeBtn = document.querySelector(".lightbox .close");

function openLightbox(src) {
  lightbox.style.display = "flex";
  lightboxImg.src = src;
}
function closeLightbox() {
  lightbox.style.display = "none";
  lightboxImg.src = "";
}

document.querySelectorAll(".carousel-item img, .banner img").forEach(img => {
  img.addEventListener("click", () => openLightbox(img.src));
});

closeBtn.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", e => {
  if (e.target === lightbox) closeLightbox();
});

// =====================
//  Basic Protection (Disable Inspect/View Source for normal users)
// =====================
document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
  alert("Right click is disabled on this page.");
});

document.addEventListener("keydown", function (e) {
  // F12
  if (e.key === "F12") {
    e.preventDefault();
    alert("Developer tools are disabled.");
  }
  // Ctrl+Shift+I or Ctrl+U
  if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "i") || (e.ctrlKey && e.key.toLowerCase() === "u")) {
    e.preventDefault();
    alert("This action is disabled.");
  }
});

