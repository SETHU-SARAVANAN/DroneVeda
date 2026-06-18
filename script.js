document.addEventListener('DOMContentLoaded', () => {
  // Update dynamic background gradient based on scroll
  window.addEventListener('scroll', () => {
    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    document.documentElement.style.setProperty('--scroll-y', scrollPercent);
  });

  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link, .nav-btn');

  if (mobileToggle) {
    const toggleMenu = () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('active');
    };

    const closeMenu = () => {
      mobileToggle.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('active');
    };

    mobileToggle.addEventListener('click', toggleMenu);
    navLinks.forEach(link => link.addEventListener('click', closeMenu));
    
    document.addEventListener('click', (e) => {
      if (!mobileToggle.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('active')) {
        closeMenu();
      }
    });
  }

  const animatedElements = document.querySelectorAll('.scroll-reveal');
  const updateAnimations = (force = false) => {
    const vh = window.innerHeight;
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - vh;
    const scrollRemaining = maxScroll - scrollY;
    
    animatedElements.forEach(el => {
        if (!force && el.dataset.inView !== "true") return;

        const rect = el.getBoundingClientRect();
        
        const start = vh * 1.0; 
        const end = vh * 0.5;   
        
        const finalTop = rect.top - scrollRemaining;
        const effectiveEnd = (finalTop > end) ? finalTop : end;

        let progress = (start - rect.top) / (start - effectiveEnd);
        progress = Math.max(0, Math.min(1, progress));
        
        el.style.setProperty('--g-progress', progress.toFixed(4));
    });
  };

  const scrollObserver = new IntersectionObserver((entries) => {
    let needsUpdate = false;
    entries.forEach(entry => {
        const wasInView = entry.target.dataset.inView === "true";
        const isInView = entry.isIntersecting;
        entry.target.dataset.inView = isInView ? "true" : "false";
        
        if (isInView && !wasInView) needsUpdate = true;
    });
    
    if (needsUpdate) updateAnimations();
  }, { 
    threshold: 0,
    rootMargin: '100px 0px'
  });

  animatedElements.forEach(el => scrollObserver.observe(el));

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateAnimations();
            ticking = false;
        });
        ticking = true;
    }
  }, { passive: true });

  updateAnimations(true);

  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      const requiredFields = contactForm.querySelectorAll('[required]');

      requiredFields.forEach(field => {
        const group = field.closest('.form-group');
        if (!field.value.trim()) {
          group.classList.add('has-error');
          isValid = false;
        } else {
          group.classList.remove('has-error');
        }
      });

      if (isValid) {
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = true;
        
        formStatus.style.display = 'flex';
        formStatus.className = 'form-status-box form-status-sending';
        formStatus.innerHTML = 'Transmitting inquiry protocol...';
        
        const payload = Object.fromEntries(new FormData(contactForm).entries());
        fetch('/api/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(data => {
          formStatus.className = 'form-status-box form-status-success';
          formStatus.innerHTML = 'Transmission successful. Engineering will review your scope.';
          contactForm.reset();
          submitBtn.disabled = false;
          
          setTimeout(() => {
            formStatus.style.display = 'none';
          }, 5000);
        })
        .catch(error => {
          formStatus.className = 'form-status-box';
          formStatus.innerHTML = 'Transmission failed. Try again.';
          formStatus.style.color = 'var(--error-color)';
          submitBtn.disabled = false;
        });
      }
    });
  }

  // Auto-resize and word count for project details textarea
  const projectDetailsTextarea = document.getElementById('projectDetailsTextarea');
  const wordCountDisplay = document.getElementById('wordCount');
  
  if (projectDetailsTextarea && wordCountDisplay) {
    projectDetailsTextarea.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = this.scrollHeight + 'px';
      
      const text = this.value.trim();
      const words = text.split(/\s+/).filter(word => word.length > 0);
      wordCountDisplay.textContent = words.length + (words.length === 1 ? ' WORD' : ' WORDS');
    });
  }
});
