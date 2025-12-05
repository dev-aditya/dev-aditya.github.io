class TextRotator {
  constructor(el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.el.innerHTML = this.toRotate[0];
    this.el.classList.add('visible');
    this.cycle();
  }

  cycle() {
    // Time to wait while text is fully visible
    setTimeout(() => {
      this.fadeOut();
    }, this.period);
  }

  fadeOut() {
    this.el.classList.remove('visible');
    // Wait for the CSS transition (0.5s) to finish before changing text
    setTimeout(() => {
      this.loopNum++;
      const i = this.loopNum % this.toRotate.length;
      this.el.innerHTML = this.toRotate[i];
      this.fadeIn();
    }, 500); 
  }

  fadeIn() {
    this.el.classList.add('visible');
    this.cycle();
  }
}

window.onload = function() {
  const elements = document.getElementsByClassName('txt-rotate');
  for (let i = 0; i < elements.length; i++) {
    const toRotate = elements[i].getAttribute('data-rotate');
    const period = elements[i].getAttribute('data-period');
    if (toRotate) {
      new TextRotator(elements[i], JSON.parse(toRotate), period);
    }
  }
};