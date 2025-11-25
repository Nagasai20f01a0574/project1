
// =======================
// 🧭 MOBILE MENU TOGGLE
// =======================
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.getElementById('nav-links');

if (mobileMenu && navLinks) {
  mobileMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}

// =======================
// ❓ FAQ ACCORDION
// =======================
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  if (question) {
    question.addEventListener('click', () => {
      faqItems.forEach(other => {
        if (other !== item) other.classList.remove('active');
      });
      item.classList.toggle('active');
    });
  }
});

// =======================
// 🌐 SMOOTH SCROLL
// =======================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
      navLinks?.classList.remove('active');
    }
  });
});

// =======================
// 💫 SCROLL ANIMATIONS
// =======================
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('animate');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.service-card, .testimonial-card, .pricing-card')
  .forEach(card => observer.observe(card));

// =======================
// 🎬 PROJECT CARD ANIMATIONS
// =======================
function animateProjects() {
  const projectCards = document.querySelectorAll('.project-card');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  projectCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.6s ease';
    observer.observe(card);
  });
}
document.addEventListener('DOMContentLoaded', animateProjects);

// =======================
// ♾️ TESTIMONIAL SCROLL
// =======================
const track = document.querySelector('.testimonial-track');
const cards = document.querySelectorAll('.testimonial-card');
if (track && cards.length > 0) {
  const cardWidth = 350; // must match CSS width
  const gap = 30; // must match CSS gap
  const totalWidth = (cardWidth * cards.length) + (gap * (cards.length - 1));
  track.style.width = `${totalWidth}px`;

  const grid = document.querySelector('.testimonial-grid');
  if (grid) {
    grid.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
    grid.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
  }

  // Slower movement — increase multiplier for slower speed
  const duration = cards.length * 25; 
  track.style.animationDuration = `${duration}s`;
}

// =======================
// 📩 CONTACT POPUP (Iframe-based)
// =======================
document.addEventListener('DOMContentLoaded', function() {
  const openBtn = document.getElementById('openContact');
  const overlay = document.getElementById('popupOverlay');
  const closeBtn = document.getElementById('closePopup');

  if (openBtn && overlay && closeBtn) {
    openBtn.addEventListener('click', e => {
      e.preventDefault();
      overlay.classList.add('show');
    });

    closeBtn.addEventListener('click', () => overlay.classList.remove('show'));

    overlay.addEventListener('click', e => {
      if (e.target === overlay) overlay.classList.remove('show');
    });
  }
});

// =======================
// 🧾 CONTACT FORM SUBMISSION (Google Apps Script)
// =======================
const modal = document.getElementById('contactModal');
const contactBtns = document.querySelectorAll('.contact-btn');
const closeModal = document.querySelector('.close-modal');
const closeSuccess = document.getElementById('closeSuccess');
const contactForm = document.getElementById('contactForm');
const contactFormContainer = document.getElementById('contactFormContainer');
const successMessage = document.getElementById('successMessage');

// Open modal
if (contactBtns && modal) {
  contactBtns.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      modal.style.display = 'flex';
      contactFormContainer.style.display = 'block';
      successMessage.style.display = 'none';
    });
  });
}

// Close modal
if (closeModal) closeModal.addEventListener('click', () => modal.style.display = 'none');
if (closeSuccess) closeSuccess.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });

// Success function
function showSuccess() {
  contactFormContainer.style.display = 'none';
  successMessage.style.display = 'block';
  contactForm.reset();
}

// Handle form submission
if (contactForm) {
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();

    const payload = {
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      service: document.getElementById('service').value,
      message: document.getElementById('message').value.trim()
    };

    try {
      const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyrknD-0nXM-n0jAvJmzsKIJrmVPD1FFELsoIxCRWp7DJWI7W5J65v8ItSlUzrboyH-vA/exec";

      const res = await fetch(WEB_APP_URL, {
        method: "POST",
        body: JSON.stringify(payload) // no explicit content-type
      });

      const text = await res.text();
      let result;
      try { result = JSON.parse(text); } 
      catch { result = { status: "error", message: text }; }

      if (result.status === "success") {
        showSuccess();
      } else {
        alert("Server error: " + (result.message || "Please try again"));
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Network error — check your Web App URL and deployment settings.");
    }
  });
}

