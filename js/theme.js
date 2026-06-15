const themeToggle = document.getElementById('theme-toggle');
const themeStylesheet = document.getElementById('theme-stylesheet');
const transitionOverlay = document.getElementById('theme-transition-overlay');
const particlesEl = document.getElementById('particles-js-canvas-el');

// The site starts in Light State by default
let isDarkState = false;

function buildSuperposition(sign) {
  const atomHTML = `
      <div class="atom superposition-atom">
        <div class="nucleus"></div>
        <div class="orbit orbit-1"></div>
        <div class="orbit orbit-2"></div>
        <div class="orbit orbit-3"></div>
      </div>
  `;
  
  return `
    <div class="superposition-equation">
      <div class="norm-factor">1/&radic;2</div>
      <div class="bracket">(</div>
      <div class="bracket">|</div>
      ${atomHTML}
      <div class="bracket">&rang;</div>
      <div class="sign">${sign}</div>
      <div class="bracket">|</div>
      ${atomHTML}
      <div class="bracket">&rang;</div>
      <div class="bracket">)</div>
    </div>
  `;
}

themeToggle.addEventListener('click', (e) => {
  e.preventDefault();
  
  // Decide the next state (we are about to toggle)
  const nextIsDark = !isDarkState;
  
  // Update overlay content and colors BEFORE showing it
  if (nextIsDark) {
    // Going Light -> Dark
    transitionOverlay.classList.remove('light-transition');
    transitionOverlay.innerHTML = buildSuperposition('-') + 
      '<p class="transition-text">Going into a symmetry protected state of the system...</p>';
  } else {
    // Going Dark -> Light
    transitionOverlay.classList.add('light-transition');
    transitionOverlay.innerHTML = buildSuperposition('+') + 
      '<p class="transition-text">Moving out of the dark states, decoherence times are faster...</p>';
  }
  
  // 1. Show the transition overlay
  transitionOverlay.classList.add('active');
  
  // 2. Wait for overlay to fade in completely, then swap states
  setTimeout(() => {
    isDarkState = nextIsDark;
    
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
    
    // 3. After swapping states behind the overlay, let the atoms spin a bit longer
    // Then fade out the overlay
    setTimeout(() => {
      transitionOverlay.classList.remove('active');
    }, 1500); // Overlay stays solid for 1.5s after swapping
    
  }, 500); // Wait 0.5s for the CSS fade-in
});
