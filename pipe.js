// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/cXgA1d_E-jY

class Pipe {
  constructor() {
    this.spacing = 110;
    this.top = random(height / 6, 3 / 4 * height);
    this.bottom = this.top + this.spacing;

    this.x = width;
    this.w = 80;
    this.speed = 2;

    this.passed = false;
    this.highlight = false;
  }

  hits(bird) {
    if (bird.y - (bird.height / 2) < this.top || bird.y + (bird.height / 2) > this.bottom) {
      //if this.w is huge, then we need different collision model
      if (bird.x + (bird.width / 2) > this.x  && bird.x - (bird.width / 2) < this.x + this.w) {
        this.highlight = true;
        this.passed = true;
        return true;
      }
    }
    this.highlight = false;
    return false;
  }

  //this function is used to calculate scores and checks if we've went through the pipes
  pass(bird) {
    if (bird.x > this.x && !this.passed) {
      this.passed = true;
      return true;
    }
    return false;
  }

  //These two functions allows us to draw image without stretching
  drawBottom() {
    let howManyNedeed = 0;

    // 5/4 - proportion of image
    //this way we calculate, how many tubes we can fit without stretching
    //+1 is just to be sure
    howManyNedeed = (this.bottom * (5 / 4) / this.w) + 1;
    for (let i = 1; i < howManyNedeed; ++i) {
        image(pipeBodySprite, this.x, this.bottom + i * this.w * 5 / 4, this.w, this.w * 5 / 4);
    }
    //and now peak
    image(pipePeakSprite, this.x, this.bottom, this.w, this.w * 5 / 4);
  }

  drawTop() {
    let howManyNedeed = 0;

    // 5/4 - proportion of image
    //this way we calculate, how many tubes we can fit without stretching
    howManyNedeed = Math.round(this.top * (5 / 4) / this.w);
    //this <= and start from 1 is just my HACK xD But it's working
    for (let i = 2; i <= howManyNedeed; ++i) {
        image(pipeBodySprite, this.x, this.top - i * this.w * 5 / 4, this.w, this.w * 5 / 4);
    }
    //i dont want to mess with translations and rotations, so I've made another peak
    image(pipePeakFlippedSprite, this.x, this.top - this.w * 5 / 4, this.w, this.w * 5 / 4);
  }

  show() {
    this.drawTop();
    this.drawBottom();
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
