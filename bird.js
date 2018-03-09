// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/cXgA1d_E-jY&

class Bird {
  constructor() {
    this.y = height/2;
    this.x = 64;
    this.gravity = 0.6;
    this.lift = -15;
    this.velocity = 0;
    this.size = 32;
  }

  show() {
    fill(255);
    ellipse(this.x, this.y, this.size, this.size);
  }
  
  up() {
    this.velocity += this.lift;
  }

  update() {
    this.velocity += this.gravity;
    this.velocity *= 0.9;
    this.y += this.velocity;
    
    if (this.y >= height - this.size/2) {
      this.y = height - this.size/2;
      this.velocity = 0;
    }

    if (this.y <= this.size/2) {
      this.y = this.size/2;
      this.velocity = 0;
    }
  }
}

