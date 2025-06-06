document.addEventListener('DOMContentLoaded', () => {
  // Cache elements
  const themeToggleBtn = document.getElementById('theme-toggle');
  const layoutButtons = document.querySelectorAll('.layout-btn');
  const layoutSections = document.querySelectorAll('.layout-section');

  // Initialize theme & layout from localStorage or config
  let currentTheme = localStorage.getItem('lk-theme') || config.themeDefault;
  let currentLayout = localStorage.getItem('lk-layout') || config.layoutDefault;

  // Apply theme
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeToggleIcon(currentTheme);

  // Show active layout section and highlight button
  showLayout(currentLayout);
  setActiveButton(currentLayout);

  // Theme toggle handler
  themeToggleBtn.addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('lk-theme', currentTheme);
    updateThemeToggleIcon(currentTheme);
  });

  // Layout buttons handler
  layoutButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selected = btn.getAttribute('data-layout');
      if (selected === currentLayout) return;
      showLayout(selected);
      setActiveButton(selected);
      localStorage.setItem('lk-layout', selected);
      currentLayout = selected;
    });
  });

  function showLayout(layout) {
    layoutSections.forEach(section => {
      section.hidden = section.id !== layout;
    });
  }

  function setActiveButton(layout) {
    layoutButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-layout') === layout);
    });
  }

  function updateThemeToggleIcon(theme) {
    themeToggleBtn.textContent = theme === 'light' ? '🌙' : '☀️';
  }

  // Testimonial slider
  (() => {
    const testimonials = document.querySelectorAll('.testimonial');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    if (!testimonials.length || !prevBtn || !nextBtn) return;

    let currentIndex = 0;

    function showTestimonial(index) {
      testimonials.forEach((t, i) => {
        t.classList.toggle('active', i === index);
      });
    }

    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
      showTestimonial(currentIndex);
    });

    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % testimonials.length;
      showTestimonial(currentIndex);
    });

    setInterval(() => {
      currentIndex = (currentIndex + 1) % testimonials.length;
      showTestimonial(currentIndex);
    }, 5000);

    showTestimonial(currentIndex);
  })();

  // Contact form submission with Formspree
  (() => {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const statusMsg = form.querySelector('.form-status');

    form.addEventListener('submit', async e => {
      e.preventDefault();
      statusMsg.textContent = 'Sending...';

      const formData = new FormData(form);

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          statusMsg.textContent = 'Thanks for your message! We will get back to you soon.';
          form.reset();
        } else {
          const data = await response.json();
          if (data.errors) {
            statusMsg.textContent = data.errors.map(err => err.message).join(', ');
          } else {
            statusMsg.textContent = 'Oops! There was a problem submitting your form.';
          }
        }
      } catch (error) {
        statusMsg.textContent = 'Oops! There was a problem submitting your form.';
      }
    });
  })();
});
