// Jaynes-Cummings Model (JCM) Collapse and Revival Graph
// Replaces the static timeline line with a dynamic quantum coherence wave

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("jcm-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  
  const container = canvas.parentElement;
  
  let dots = [];
  let startTime = Date.now();
  let time = 0;
  
  function resize() {
    canvas.width = container.offsetWidth;
    canvas.height = 100; // Enough height for the wave amplitude
    
    // Get the horizontal positions of all dots to anchor the revivals
    const dotElements = document.querySelectorAll(".route-stop .dot");
    const canvasRect = canvas.getBoundingClientRect();
    
    dots = Array.from(dotElements).map(dot => {
      const rect = dot.getBoundingClientRect();
      // Center of the dot relative to the canvas
      const leftShift = 15; // Shift wave slightly to the left
      return (rect.left + rect.width / 2) - canvasRect.left - leftShift;
    });
    
    // Fallback if dots aren't loaded or positioned yet
    if (dots.length === 0 || dots[0] === 0) {
      dots = [
        canvas.width * 0.125,
        canvas.width * 0.375,
        canvas.width * 0.625,
        canvas.width * 0.875
      ];
    }
  }

  window.addEventListener("resize", resize);
  // Initial delay to ensure CSS has positioned the flex items
  setTimeout(resize, 100);

  function draw() {
    time = (Date.now() - startTime) / 1000;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Check theme to determine line color
    const isDark = document.body.classList.contains("dark-mode") || 
                  (typeof isDarkState !== 'undefined' && isDarkState);
    
    // Use secondary color for the wave
    ctx.strokeStyle = isDark ? "rgba(0, 173, 181, 0.8)" : "rgba(0, 173, 181, 0.8)";
    ctx.lineWidth = 2;
    ctx.lineJoin = "round";
    
    ctx.beginPath();
    
    const centerY = canvas.height / 2;
    const maxAmp = 40; // Maximum wave amplitude
    const sigma = canvas.width * 0.08; // Width of the revival envelope
    
    // Progress for the initial unfurling animation (5 seconds)
    const duration = 5.0;
    let progress = Math.min(time / duration, 1.0);
    // Easing function (ease-in-out)
    const easeProgress = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    
    // Make the length of the wave after Weizmann (the last dot) exactly 
    // the same as the length of the wave before IISER Mohali (the first dot)
    const headLength = dots.length > 0 ? dots[0] : 0;
    const maxDrawX = dots.length > 0 ? dots[dots.length - 1] + headLength : canvas.width;
    
    const drawLimitX = Math.min(canvas.width * easeProgress, maxDrawX);
    
    for (let x = 0; x <= drawLimitX; x += 1) {
      // Find distance to nearest dot for exact zero
      let minDistance = Infinity;
      for (const dotX of dots) {
        minDistance = Math.min(minDistance, Math.abs(x - dotX));
      }
      
      // Inverted Gaussian: 0 at dot (collapse), 1 far from dot (revival)
      let envelope = 1 - Math.exp(-Math.pow(minDistance, 2) / (2 * Math.pow(sigma, 2)));
      
      // Ensure it is exactly zero at the junction
      if (minDistance < 1.0) {
        envelope = 0;
      }
      
      // Fast oscillating wave inside the envelope
      const k = 0.2; // Spatial frequency
      const omega = 5.0; // Temporal angular frequency
      const wave = Math.cos(k * x - omega * time);
      
      const y = centerY + maxAmp * envelope * wave;
      
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.stroke();
    
    // Add a glowing head to the wave during the drawing phase
    if (progress < 1.0 && drawLimitX > 0) {
      ctx.fillStyle = "#fff";
      ctx.shadowColor = "rgba(0, 173, 181, 1)";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      // Calculate y at the leading edge
      let leadMinDistance = Infinity;
      for (const dotX of dots) {
        leadMinDistance = Math.min(leadMinDistance, Math.abs(drawLimitX - dotX));
      }
      let env = 1 - Math.exp(-Math.pow(leadMinDistance, 2) / (2 * Math.pow(sigma, 2)));
      if (leadMinDistance < 1.0) env = 0;
      
      const leadY = centerY + maxAmp * env * Math.cos(0.2 * drawLimitX - 5.0 * time);
      
      ctx.arc(drawLimitX, leadY, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0; // Reset
    }
    
    requestAnimationFrame(draw);
  }
  
  // Start animation loop
  draw();
});
