document.addEventListener('DOMContentLoaded', () => {
  
  // Mobile menu toggle
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
  }

  // Smooth scroll for nav links
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      
      // Only prevent default and smooth scroll if it's an anchor link on the same page
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      } else if (targetId && targetId.includes('.html#')) {
        // If it's a link to another page's anchor, we let it navigate naturally.
        // No e.preventDefault() here.
      }
    });
  });

  // Intersection Observer for cleanly revealing and hiding elements via scrolling
  const revealOptions = {
    root: null,
    rootMargin: '0px 0px -10% 0px', // Animates slightly before hitting the edge of the screen
    threshold: 0.1 
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        // Remove class to hide it as soon as the element drops out of view
        entry.target.classList.remove('visible');
      }
    });
  }, revealOptions);

  // Attach observer to all elements meant to reveal
  const revealElements = document.querySelectorAll('.reveal, .reveal-group');
  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });

  // Pre-fill contact form based on URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const product = urlParams.get('product');
  if (product) {
    const msgBox = document.querySelector('textarea[name="message"]');
    if (msgBox) {
      msgBox.value = "I am interested in purchasing the " + product + " kit. Please contact me with pricing and availability.";
    }

    // Scroll to contact form smoothly if product is in URL
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      setTimeout(() => {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  }

});