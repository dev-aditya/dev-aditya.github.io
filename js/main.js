// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});

// Scrollspy and Active Pill Background Logic
const sections = document.querySelectorAll('main, section');
const navItems = document.querySelectorAll('.nav-item');
const activePillBg = document.querySelector('.active-pill-bg');

function updateActivePill() {
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    // Activate section when scroll is past a certain point
    if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
      current = section.getAttribute('id');
    }
  });

  navItems.forEach(item => {
    item.classList.remove('current');
    const link = item.querySelector('a');
    
    if (link.getAttribute('href') === `#${current}`) {
      item.classList.add('current');
      
      // Move the active pill background
      const linkRect = item.getBoundingClientRect();
      const navRect = item.parentElement.getBoundingClientRect();
      
      activePillBg.style.width = `${linkRect.width}px`;
      activePillBg.style.left = `${linkRect.left - navRect.left}px`;
    }
  });
}

// Update on scroll
window.addEventListener('scroll', updateActivePill);
// Update on initial load
window.addEventListener('load', () => {
  // Add a small delay to ensure fonts/layout are loaded before calculating pill size
  setTimeout(updateActivePill, 100);
});
// Update on window resize to keep pill aligned
window.addEventListener('resize', updateActivePill);