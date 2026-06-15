// Matrix Digital Rain effect for the background
const matrixCanvas = document.getElementById('matrix-canvas');
const ctx = matrixCanvas.getContext('2d');

matrixCanvas.width = window.innerWidth;
matrixCanvas.height = window.innerHeight;

// Matrix characters - mixing katakana, latin, and numerals
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ';
const charArray = chars.split('');

const fontSize = 16;
const columns = matrixCanvas.width / fontSize;

// Array of drops - one per column
const drops = [];
for (let x = 0; x < columns; x++) {
  drops[x] = Math.random() * -100; // Start at random negative heights so they fall naturally
}

let matrixInterval = null;

function drawMatrix() {
  // Semi-transparent black background to create the trail effect
  ctx.fillStyle = 'rgba(11, 15, 25, 0.05)';
  ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

  ctx.fillStyle = '#0F0'; // Green text
  ctx.font = fontSize + 'px monospace';

  // Loop over drops
  for (let i = 0; i < drops.length; i++) {
    // Random character
    const text = charArray[Math.floor(Math.random() * charArray.length)];
    
    // x = i*fontSize, y = value of drops[i]*fontSize
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
    
    // Sending the drop back to the top randomly after it has crossed the screen
    // Adding a randomness to the reset to make the drops scattered on the Y axis
    if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    
    // Increment Y coordinate
    drops[i]++;
  }
}

// Window resize handling
window.addEventListener('resize', () => {
  matrixCanvas.width = window.innerWidth;
  matrixCanvas.height = window.innerHeight;
});

// Control functions
window.startMatrix = function() {
  if (!matrixInterval) {
    matrixCanvas.style.opacity = '1';
    matrixInterval = setInterval(drawMatrix, 33); // ~30 FPS
  }
};

window.stopMatrix = function() {
  if (matrixInterval) {
    clearInterval(matrixInterval);
    matrixInterval = null;
    matrixCanvas.style.opacity = '0';
    // Clear canvas
    ctx.clearRect(0, 0, matrixCanvas.width, matrixCanvas.height);
  }
};
