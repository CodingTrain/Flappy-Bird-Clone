// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/cXgA1d_E-jY

class Pipe {
  constructor() {
    this.spacing = 110;
    this.top = random(height/6, 3/4*height);
    this.bottom = this.top + this.spacing;

    this.x = width;
    this.w = 20;
    this.speed = 2;

    this.passed=false;
    this.highlight = false;
  }

  hits(bird) {
    if (bird.y - (bird.height / 2) < this.top || bird.y+(bird.height / 2) > this.bottom) {
      if (bird.x +(bird.width / 2)> this.x + this.w && bird.x - (bird.width / 2) < this.x) {
        this.highlight = true;
        this.passed=true;
        return true;
      }
    }
    this.highlight = false;
    return false;
  }

  //this function is used to calculate scores and checks if we've went through the pipes
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
