// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/cXgA1d_E-jY&

class Pipe {
  constructor() {
    this.spacing = 100;
    this.top = random(height/6, 3/4*height);
    this.bottom = this.top + this.spacing;

    this.x = width;
    this.w = 20;
    this.speed = 2;

    this.passed=false;
    this.highlight = false;
  }

  hits(bird) {
    if (bird.y < this.top || bird.y > height - this.bottom) {
      if (bird.x > this.x && bird.x < this.x + this.w) {
        this.highlight = true;
        this.passed=true;
        return true;
      }
    }
    this.highlight = false;
    return false;
  }

  pass(bird) {
        if (bird.x > this.x && !this.passed) {
            this.passed=true;
            return true;
        }
        return false;
  }
    
  show() {
    image(pipeBodySprite,this.x,0,this.w,this.top);
    image(pipeBodySprite,this.x,this.bottom,this.w,height);
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
