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

// Random joke on the quantum intro card.
// Edit this list to tune the tone; one entry is picked whenever the card is observed.
const quantumJokes = [
  {
    main: '"Eigenvalue found: chronically debugging."',
    sub: 'The uncertainty is mostly in my inbox.'
  },
  {
    main: '"Wavefunction collapsed into coffee and boundary conditions."',
    sub: 'Normalization pending after the next espresso.'
  },
  {
    main: '"Measured spin: up. Measured motivation: basis-dependent."',
    sub: 'Please rotate the lab frame and try again.'
  },
  {
    main: '"This profile is Hermitian: all awkwardness is observable."',
    sub: 'The eigenstates, unfortunately, are not sorted by confidence.'
  },
  {
    main: '"I tried to diagonalize my life. The off-diagonal terms filed a complaint."',
    sub: 'Perturbation theory has been notified.'
  },
  {
    main: '"Quantum control update: still optimizing the sleep Hamiltonian."',
    sub: 'Gradient descent keeps finding local naps.'
  },
  {
    main: '"Bra detected. Ket detected. Inner product: professionally acceptable."',
    sub: 'Overlap may improve after peer review.'
  },
  {
    main: '"Schrödinger\'s code: it works and doesn\'t work until you compile it."',
    sub: 'Don\'t look at the terminal, you\'ll collapse the build.'
  },
  {
    main: '"Tunneling through deadlines since 2018."',
    sub: 'Classically forbidden, but probabilistically inevitable.'
  },
  {
    main: '"Currently entangled with a messy codebase."',
    sub: 'Spooky action at a distance is just bad global variables.'
  },
  {
    main: '"My research is a superposition of brilliant and confused."',
    sub: 'Observation usually collapses it into "confused".'
  },
  {
    main: '"Experiencing a non-adiabatic transition into the weekend."',
    sub: 'Please allow ample time for thermalization.'
  },
  {
    main: '"Fermionic lifestyle: I refuse to occupy the same state as anyone else."',
    sub: 'Pauli exclusion principle in action at academic conferences.'
  },
  {
    main: '"This portfolio strongly violates Bell\'s inequality."',
    sub: 'Because it\'s demonstrably non-local and genuinely weird.'
  }
];

const introFlipContainer = document.querySelector('.intro-flip-container');
const quantumJoke = document.querySelector('#quantum-joke');
const quantumJokeSub = document.querySelector('#quantum-joke-sub');
let lastQuantumJokeIndex = -1;

function setRandomQuantumJoke() {
  if (!quantumJoke || !quantumJokeSub) return;

  let nextIndex = Math.floor(Math.random() * quantumJokes.length);
  if (quantumJokes.length > 1) {
    while (nextIndex === lastQuantumJokeIndex) {
      nextIndex = Math.floor(Math.random() * quantumJokes.length);
    }
  }

  lastQuantumJokeIndex = nextIndex;
  quantumJoke.textContent = quantumJokes[nextIndex].main;
  quantumJokeSub.textContent = quantumJokes[nextIndex].sub;
}

if (introFlipContainer) {
  introFlipContainer.addEventListener('mouseenter', setRandomQuantumJoke);
  introFlipContainer.addEventListener('focusin', setRandomQuantumJoke);
  introFlipContainer.addEventListener('touchstart', setRandomQuantumJoke, { passive: true });
}
