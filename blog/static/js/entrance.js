document.addEventListener('DOMContentLoaded', () => {
  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    return; // Do nothing if reduced motion is preferred
  }

  const elements = document.querySelectorAll('.post-content > *');
  
  elements.forEach((el, index) => {
    // 50ms stagger per element
    const delay = index * 0.05;
    el.style.animation = `fadeInUp 0.5s ease-out ${delay}s forwards`;
  });
});
