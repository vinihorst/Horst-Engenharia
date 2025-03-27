document.addEventListener('DOMContentLoaded', function () {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenuButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
    // Close mobile menu when clicking on a link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
    const counters = document.querySelectorAll('.counter');
    const animateCounter = (counter) => {
      const target = parseInt(counter.getAttribute('data-target'));
      const duration = parseInt(counter.getAttribute('data-duration'));
      const step = target / (duration / 16); // 16ms per frame for 60fps
      let current = 0;
      const updateCounter = () => {
        current += step;
        if (current < target) {
          counter.textContent = Math.floor(current);
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      };
      updateCounter();
    };
    const observerCallback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target); // 取消观察，确保动画只执行一次
        }
      });
    };
    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.5,
      rootMargin: '0px'
    });
    counters.forEach(counter => observer.observe(counter));
  });