/**
 * SUMAN BEAUTY SALON & ACADEMY - GALLERY & LIGHTBOX JAVASCRIPT
 * Handles Category Filtering, Responsive Masonry Display, Lightbox Navigation with
 * Touch Gestures, Keyboard Controls, and Full Resolution Display.
 */

document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryCards = document.querySelectorAll('.gallery-card');

  // Lightbox DOM Elements
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCategory = document.getElementById('lightboxCategory');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
  const lightboxNextBtn = document.getElementById('lightboxNextBtn');

  let currentVisibleCards = Array.from(galleryCards);
  let currentIndex = 0;

  // --- 1. GALLERY CATEGORY FILTERING ---
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryCards.forEach(card => {
        const categories = card.getAttribute('data-categories') || '';
        const categoryList = categories.split(' ');

        if (filterValue === 'all' || categoryList.includes(filterValue)) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });

      // Update currently active items for lightbox navigation
      setTimeout(() => {
        currentVisibleCards = Array.from(galleryCards).filter(c => c.style.display !== 'none');
      }, 300);
    });
  });

  // --- 2. LIGHTBOX CONTROLLER ---
  function openLightbox(index) {
    if (!lightboxModal || !currentVisibleCards.length) return;

    currentIndex = index;
    if (currentIndex < 0) currentIndex = currentVisibleCards.length - 1;
    if (currentIndex >= currentVisibleCards.length) currentIndex = 0;

    const targetCard = currentVisibleCards[currentIndex];
    const imgSrc = targetCard.getAttribute('data-src') || targetCard.querySelector('img').src;
    const imgTitle = targetCard.getAttribute('data-title') || 'Suman Beauty Salon Portfolio';
    const imgCategory = targetCard.getAttribute('data-tag') || 'Portfolio';

    if (lightboxImg) lightboxImg.src = imgSrc;
    if (lightboxTitle) lightboxTitle.textContent = imgTitle;
    if (lightboxCategory) lightboxCategory.textContent = imgCategory;
    if (lightboxCounter) lightboxCounter.textContent = `${currentIndex + 1} / ${currentVisibleCards.length}`;

    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showNextImage() {
    openLightbox(currentIndex + 1);
  }

  function showPrevImage() {
    openLightbox(currentIndex - 1);
  }

  // Attach click to open lightbox on gallery cards
  galleryCards.forEach(card => {
    card.addEventListener('click', () => {
      const idx = currentVisibleCards.indexOf(card);
      if (idx !== -1) {
        openLightbox(idx);
      }
    });
  });

  // Attach Lightbox Controls
  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', showNextImage);
  if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', showPrevImage);

  // Close when clicking modal backdrop
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal || e.target.classList.contains('lightbox-dialog')) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation (Escape to close, Left/Right arrows to navigate)
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNextImage();
    if (e.key === 'ArrowLeft') showPrevImage();
  });

  // Mobile Touch Swipe Navigation
  let touchStartX = 0;
  let touchEndX = 0;

  if (lightboxModal) {
    lightboxModal.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightboxModal.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipeGesture();
    }, { passive: true });
  }

  function handleSwipeGesture() {
    const swipeThreshold = 45;
    if (touchEndX < touchStartX - swipeThreshold) {
      // Swiped Left -> Next Image
      showNextImage();
    }
    if (touchEndX > touchStartX + swipeThreshold) {
      // Swiped Right -> Previous Image
      showPrevImage();
    }
  }
});
