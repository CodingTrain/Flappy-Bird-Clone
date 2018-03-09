// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/cXgA1d_E-jY

class Pipe {
  constructor(bird) {
    this.bird = bird;
    this.spacing = this.bird.size*2.5;
    this.top = random(height - this.spacing-16)+16;
    this.bottom = this.top + this.spacing;

    this.x = width;
    this.w = 20;
    this.speed = 2;
    this.highlight = false;
  }

  hits() {
    if (this.bird.y-this.bird.size/2 < this.top || this.bird.y+this.bird.size/2 > this.bottom) {
      if (this.bird.x > this.x && this.bird.x < this.x + this.w) {
        this.highlight = true;
        return true;
      }
    }
    this.highlight = false;
    return false;
  }

  show() {
    fill(255);
    if (this.highlight) {
      fill(255, 0, 0);
    }
    rect(this.x, 0, this.w, this.top);
    rect(this.x, this.bottom, this.w, height - this.bottom);
  }

  update() {
    this.x -= this.speed;
  }

  offscreen() {
    if (this.x < -this.w) {
      return true;
    } else {
      return false;
    }
  }
}
