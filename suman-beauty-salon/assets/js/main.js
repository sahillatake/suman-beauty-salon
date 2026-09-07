/**
 * SUMAN BEAUTY SALON & ACADEMY - MAIN JAVASCRIPT
 * Handles Sticky Navigation, Booking Form Synchronization, WhatsApp Message Generation,
 * Academy Course Enquiries, and Modal Notifications.
 */

document.addEventListener('DOMContentLoaded', () => {
  const SALON_PHONE = '918135816148';

  // --- 1. STICKY NAVBAR & MOBILE MENU ---
  const siteNav = document.getElementById('siteNav');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky navbar shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      siteNav.classList.add('scrolled');
    } else {
      siteNav.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      hamburgerBtn.classList.toggle('open', isOpen);
      hamburgerBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!siteNav.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        hamburgerBtn.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', false);
      }
    });

    // Close menu when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        hamburgerBtn.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', false);
      });
    });
  }

  // Active navigation link highlighting on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 140;
      const sectionId = current.getAttribute('id');
      const targetNavLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);
      if (targetNavLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          targetNavLink.classList.add('active');
        } else {
          targetNavLink.classList.remove('active');
        }
      }
    });
  });

  // --- 2. SERVICE TABS FILTERING ---
  const serviceTabBtns = document.querySelectorAll('.service-tab-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  serviceTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      serviceTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      serviceCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });

  // Select service from service card button
  const selectServiceBtns = document.querySelectorAll('.select-service-btn');
  const serviceSelectDropdown = document.getElementById('bookService');

  selectServiceBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const selectedServiceName = btn.getAttribute('data-service');
      if (serviceSelectDropdown && selectedServiceName) {
        // Try matching dropdown option
        for (let i = 0; i < serviceSelectDropdown.options.length; i++) {
          if (serviceSelectDropdown.options[i].value.toLowerCase().includes(selectedServiceName.toLowerCase()) ||
              selectedServiceName.toLowerCase().includes(serviceSelectDropdown.options[i].value.toLowerCase())) {
            serviceSelectDropdown.selectedIndex = i;
            break;
          }
        }
        updateAppointmentSummary();
      }
    });
  });

  // --- 3. APPOINTMENT BOOKING SYSTEM ---
  const appointmentForm = document.getElementById('appointmentForm');
  const bookName = document.getElementById('bookName');
  const bookPhone = document.getElementById('bookPhone');
  const bookEmail = document.getElementById('bookEmail');
  const bookService = document.getElementById('bookService');
  const bookDate = document.getElementById('bookDate');
  const bookTime = document.getElementById('bookTime');
  const bookPeople = document.getElementById('bookPeople');
  const bookMessage = document.getElementById('bookMessage');

  // Summary Table Cell elements
  const sumName = document.getElementById('sumName');
  const sumPhone = document.getElementById('sumPhone');
  const sumService = document.getElementById('sumService');
  const sumDate = document.getElementById('sumDate');
  const sumTime = document.getElementById('sumTime');
  const sumRequest = document.getElementById('sumRequest');

  // Set minimum date to today
  if (bookDate) {
    const today = new Date().toISOString().split('T')[0];
    bookDate.setAttribute('min', today);
  }

  // Update live receipt summary
  function updateAppointmentSummary() {
    if (sumName) {
      sumName.textContent = (bookName && bookName.value.trim()) ? bookName.value.trim() : '—';
      sumName.classList.toggle('empty', !bookName || !bookName.value.trim());
    }
    if (sumPhone) {
      sumPhone.textContent = (bookPhone && bookPhone.value.trim()) ? bookPhone.value.trim() : '—';
      sumPhone.classList.toggle('empty', !bookPhone || !bookPhone.value.trim());
    }
    if (sumService) {
      sumService.textContent = (bookService && bookService.value) ? bookService.value : '—';
      sumService.classList.toggle('empty', !bookService || !bookService.value);
    }
    if (sumDate) {
      sumDate.textContent = (bookDate && bookDate.value) ? bookDate.value : '—';
      sumDate.classList.toggle('empty', !bookDate || !bookDate.value);
    }
    if (sumTime) {
      sumTime.textContent = (bookTime && bookTime.value) ? bookTime.value : '—';
      sumTime.classList.toggle('empty', !bookTime || !bookTime.value);
    }
    if (sumRequest) {
      const msg = (bookMessage && bookMessage.value.trim()) ? bookMessage.value.trim() : 'None';
      sumRequest.textContent = msg;
      sumRequest.classList.toggle('empty', msg === 'None');
    }
  }

  // Attach live update listeners
  [bookName, bookPhone, bookEmail, bookService, bookDate, bookTime, bookPeople, bookMessage].forEach(input => {
    if (input) {
      input.addEventListener('input', updateAppointmentSummary);
      input.addEventListener('change', updateAppointmentSummary);
    }
  });

  // Handle Appointment Form Submission
  if (appointmentForm) {
    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = bookName ? bookName.value.trim() : '';
      const phone = bookPhone ? bookPhone.value.trim() : '';
      const service = bookService ? bookService.value : '';
      const date = bookDate ? bookDate.value : '';
      const time = bookTime ? bookTime.value : '';
      const message = bookMessage && bookMessage.value.trim() ? bookMessage.value.trim() : 'None';

      if (!name || !phone || !service || !date || !time) {
        alert('Please fill in all required fields (Name, Phone, Service, Date, and Time).');
        return;
      }

      // Generate exact WhatsApp Message requested:
      // Hello Suman Beauty Salon & Academy, I would like to book an appointment.
      // Name: [Customer Name]
      // Phone: [Phone Number]
      // Service: [Selected Service]
      // Preferred Date: [Date]
      // Preferred Time: [Time]
      // Message: [Message]
      // Please confirm availability.

      const waMessage = `Hello Suman Beauty Salon & Academy, I would like to book an appointment.\n\n` +
                        `Name: ${name}\n` +
                        `Phone: ${phone}\n` +
                        `Service: ${service}\n` +
                        `Preferred Date: ${date}\n` +
                        `Preferred Time: ${time}\n` +
                        `Message: ${message}\n\n` +
                        `Please confirm availability.`;

      const encodedMsg = encodeURIComponent(waMessage);
      const waUrl = `https://wa.me/${SALON_PHONE}?text=${encodedMsg}`;

      // Open WhatsApp in new tab
      window.open(waUrl, '_blank');

      // Show on-screen confirmation modal
      showConfirmationModal(
        'Appointment Enquiry Received!',
        'Thank you! Your appointment enquiry has been received. We will contact you shortly to confirm availability.'
      );

      // Reset form & summary
      appointmentForm.reset();
      updateAppointmentSummary();
    });
  }

  // --- 4. ACADEMY ENQUIRY FORM ---
  const academyForm = document.getElementById('academyEnquiryForm');
  const studentName = document.getElementById('studentName');
  const studentPhone = document.getElementById('studentPhone');
  const studentCourse = document.getElementById('studentCourse');
  const studentContactTime = document.getElementById('studentContactTime');
  const studentMessage = document.getElementById('studentMessage');

  if (academyForm) {
    academyForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = studentName ? studentName.value.trim() : '';
      const phone = studentPhone ? studentPhone.value.trim() : '';
      const course = studentCourse ? studentCourse.value : '';
      const contactTime = studentContactTime ? studentContactTime.value : 'Anytime';
      const message = studentMessage && studentMessage.value.trim() ? studentMessage.value.trim() : 'None';

      if (!name || !phone || !course) {
        alert('Please provide your name, phone number, and select a course.');
        return;
      }

      const waCourseMessage = `Hello Suman Beauty Salon & Academy, I would like to enquire about your Academy courses.\n\n` +
                              `Student Name: ${name}\n` +
                              `Mobile Number: ${phone}\n` +
                              `Selected Course: ${course}\n` +
                              `Preferred Contact Time: ${contactTime}\n` +
                              `Message: ${message}\n\n` +
                              `Please share the course syllabus, upcoming batch schedule, and admission details.`;

      const encodedCourseMsg = encodeURIComponent(waCourseMessage);
      const waUrl = `https://wa.me/${SALON_PHONE}?text=${encodedCourseMsg}`;

      window.open(waUrl, '_blank');

      showConfirmationModal(
        'Course Enquiry Sent!',
        'Thank you for your interest in Suman Beauty Academy! We have received your enquiry and our training coordinator will contact you shortly.'
      );

      academyForm.reset();
    });
  }

  // Auto-select course from Course Card "Enquire About Course" buttons
  const courseEnquireBtns = document.querySelectorAll('.course-enquire-btn');
  courseEnquireBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const courseVal = btn.getAttribute('data-course');
      if (studentCourse && courseVal) {
        for (let i = 0; i < studentCourse.options.length; i++) {
          if (studentCourse.options[i].value.includes(courseVal) || courseVal.includes(studentCourse.options[i].value)) {
            studentCourse.selectedIndex = i;
            break;
          }
        }
      }
    });
  });

  // --- 5. FLOATING WHATSAPP BUTTON & QUICK ACTION MENU ---
  const floatingWaBtn = document.getElementById('floatingWaBtn');
  const floatingWaMenu = document.getElementById('floatingWaMenu');
  const closeWaMenu = document.getElementById('closeWaMenu');

  if (floatingWaBtn && floatingWaMenu) {
    floatingWaBtn.addEventListener('click', () => {
      floatingWaMenu.classList.toggle('open');
    });

    if (closeWaMenu) {
      closeWaMenu.addEventListener('click', () => {
        floatingWaMenu.classList.remove('open');
      });
    }

    document.addEventListener('click', (e) => {
      if (!floatingWaBtn.contains(e.target) && !floatingWaMenu.contains(e.target)) {
        floatingWaMenu.classList.remove('open');
      }
    });
  }

  // --- 6. MODAL UTILITY ---
  const confirmationModal = document.getElementById('confirmationModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalMessage = document.getElementById('modalMessage');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalOkBtn = document.getElementById('modalOkBtn');

  function showConfirmationModal(title, message) {
    if (modalTitle) modalTitle.textContent = title;
    if (modalMessage) modalMessage.textContent = message;
    if (confirmationModal) {
      confirmationModal.classList.add('active');
    }
  }

  function hideConfirmationModal() {
    if (confirmationModal) {
      confirmationModal.classList.remove('active');
    }
  }

  if (closeModalBtn) closeModalBtn.addEventListener('click', hideConfirmationModal);
  if (modalOkBtn) modalOkBtn.addEventListener('click', hideConfirmationModal);
  if (confirmationModal) {
    confirmationModal.addEventListener('click', (e) => {
      if (e.target === confirmationModal) {
        hideConfirmationModal();
      }
    });
  }

  // --- 7. REVIEWS & FEEDBACK SYSTEM ---
  const writeReviewBtn = document.getElementById('writeReviewBtn');
  const reviewModal = document.getElementById('reviewModal');
  const closeReviewModalBtn = document.getElementById('closeReviewModalBtn');
  const reviewForm = document.getElementById('reviewForm');
  const starRatingPicker = document.getElementById('starRatingPicker');
  const reviewRatingInput = document.getElementById('reviewRating');
  const reviewsContainer = document.getElementById('reviewsContainer');

  let selectedRating = 5;

  // Star Rating Picker
  if (starRatingPicker) {
    const stars = starRatingPicker.querySelectorAll('span');
    
    function updateStarDisplay(rating) {
      stars.forEach(s => {
        const val = parseInt(s.getAttribute('data-value'), 10);
        if (val <= rating) {
          s.classList.add('active');
          s.textContent = '★';
        } else {
          s.classList.remove('active');
          s.textContent = '☆';
        }
      });
    }

    stars.forEach(star => {
      star.addEventListener('mouseenter', () => {
        const val = parseInt(star.getAttribute('data-value'), 10);
        updateStarDisplay(val);
      });

      star.addEventListener('click', () => {
        selectedRating = parseInt(star.getAttribute('data-value'), 10);
        if (reviewRatingInput) reviewRatingInput.value = selectedRating;
        updateStarDisplay(selectedRating);
      });
    });

    starRatingPicker.addEventListener('mouseleave', () => {
      updateStarDisplay(selectedRating);
    });

    // Initialize with 5 stars
    updateStarDisplay(5);
  }

  // Open & Close Review Modal
  if (writeReviewBtn && reviewModal) {
    writeReviewBtn.addEventListener('click', () => {
      reviewModal.classList.add('active');
    });
  }

  if (closeReviewModalBtn && reviewModal) {
    closeReviewModalBtn.addEventListener('click', () => {
      reviewModal.classList.remove('active');
    });
  }

  if (reviewModal) {
    reviewModal.addEventListener('click', (e) => {
      if (e.target === reviewModal) {
        reviewModal.classList.remove('active');
      }
    });
  }

  // Initial Default Reviews & Local Storage Loading
  const defaultReviews = [
    {
      name: "Pooja Deshmukh",
      service: "Bridal Maharashtrian Makeup",
      rating: 5,
      date: "Recent Client",
      text: "Suman Salon did my traditional Maharashtrian bridal makeup and it was absolutely stunning! The jewellery setting, nauvari draping, and makeup stayed flawless all day."
    },
    {
      name: "Sneha Kadam",
      service: "Keratin & Hair Spa",
      rating: 5,
      date: "Recent Client",
      text: "Best salon in Kanjurmarg East for hair treatments. My hair felt so smooth and healthy after the Keratin therapy. Very hygienic and clean studio!"
    },
    {
      name: "Ankita Patil",
      service: "Hydra Facial & Cleanup",
      rating: 5,
      date: "Recent Client",
      text: "The facial and cleanup gave an instant glow to my skin. Professional staff, personalized consultation, and relaxing ambiance. Highly recommended!"
    }
  ];

  function getStoredReviews() {
    try {
      const stored = localStorage.getItem('suman_salon_reviews');
      return stored ? JSON.parse(stored) : defaultReviews;
    } catch (e) {
      return defaultReviews;
    }
  }

  function renderReviews() {
    if (!reviewsContainer) return;
    const allReviews = getStoredReviews();
    reviewsContainer.innerHTML = '';

    allReviews.forEach(rev => {
      const card = document.createElement('div');
      card.className = 'review-card';
      const starString = '★'.repeat(rev.rating) + '☆'.repeat(5 - rev.rating);
      const initial = rev.name ? rev.name.charAt(0).toUpperCase() : 'C';

      card.innerHTML = `
        <div class="review-card-top">
          <div class="review-stars">${starString}</div>
          <span class="review-date">${rev.date || 'Verified Client'}</span>
        </div>
        <p class="review-text">“${rev.text}”</p>
        <div class="review-author">
          <div class="author-avatar">${initial}</div>
          <div class="author-info">
            <h4>${rev.name}</h4>
            <span>${rev.service || 'Salon Service'}</span>
          </div>
        </div>
      `;
      reviewsContainer.appendChild(card);
    });
  }

  renderReviews();

  // Handle Review Form Submission
  if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('reviewerName') ? document.getElementById('reviewerName').value.trim() : '';
      const service = document.getElementById('reviewerService') ? document.getElementById('reviewerService').value : 'Beauty Service';
      const text = document.getElementById('reviewerText') ? document.getElementById('reviewerText').value.trim() : '';

      if (!name || !text) {
        alert('Please fill in your name and feedback.');
        return;
      }

      const newReview = {
        name: name,
        service: service,
        rating: selectedRating,
        date: "Just Now",
        text: text
      };

      const currentList = getStoredReviews();
      currentList.unshift(newReview);
      try {
        localStorage.setItem('suman_salon_reviews', JSON.stringify(currentList));
      } catch (err) {}

      renderReviews();

      if (reviewModal) reviewModal.classList.remove('active');
      reviewForm.reset();
      selectedRating = 5;
      if (starRatingPicker) {
        starRatingPicker.querySelectorAll('span').forEach(s => {
          s.classList.add('active');
          s.textContent = '★';
        });
      }

      showConfirmationModal(
        'Thank You for Your Review!',
        'Your review has been submitted successfully and added to our client feedback wall!'
      );
    });
  }
});

