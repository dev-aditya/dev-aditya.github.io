const themeToggle = document.getElementById('theme-toggle');
const themeStylesheet = document.getElementById('theme-stylesheet');
const transitionOverlay = document.getElementById('theme-transition-overlay');
const particlesEl = document.getElementById('particles-js-canvas-el');

// The site starts in Light State by default
let isDarkState = false;

themeToggle.addEventListener('click', (e) => {
  e.preventDefault();
  
  // 1. Show the transition overlay
  transitionOverlay.classList.add('active');
  
  // 2. Wait for overlay to fade in completely, then swap states
  setTimeout(() => {
    isDarkState = !isDarkState;
    
    if (isDarkState) {
      // Switch to Dark State
      themeStylesheet.setAttribute('href', 'css/dark.css');
      themeToggle.textContent = 'Light State';
      
      // Stop particles, start matrix
      particlesEl.style.opacity = '0';
      if (window.pJSDom && window.pJSDom.length > 0) {
        window.pJSDom[0].pJS.fn.vendors.destroypJS();
        window.pJSDom = [];
      }
      
      // Start matrix
      if (window.startMatrix) {
        window.startMatrix();
      }
      
    } else {
      // Switch to Light State
      themeStylesheet.setAttribute('href', 'css/main.css');
      themeToggle.textContent = 'Dark State';
      
      // Stop matrix, start particles
      if (window.stopMatrix) {
        window.stopMatrix();
      }
      
      particlesEl.style.opacity = '1';
      // Re-init particles.js
      if (window.particlesJS) {
        window.particlesJS.load(
          "particles-js-canvas-el",
          "../particle/particles.json",
          function () {}
        );
      }
    }
    
    // 3. After swapping states behind the overlay, let the atom spin a bit longer
    // Then fade out the overlay
    setTimeout(() => {
      transitionOverlay.classList.remove('active');
    }, 1500); // Overlay stays solid for 1.5s after swapping
    
  }, 500); // Wait 0.5s for the CSS fade-in
});
