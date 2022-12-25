// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/cXgA1d_E-jY

// Pipe is exported (eslint flags)
/* exported Pipe */

class Pipe {
  constructor() {
    this.spacing = 125;
    this.top = random(height / 6, 3 / 4 * height);
    this.bottom = this.top + this.spacing;

    this.x = width;
    this.w = 80;
    this.speed = 3;

    this.passed = false;
    this.highlight = false;
  }

  hits(bird) {
    let halfBirdHeight = bird.height / 2;
    let halfBirdWidth = bird.width / 2;
    if (bird.y - halfBirdHeight < this.top || bird.y + halfBirdHeight > this.bottom) {
      //if this.w is huge, then we need different collision model
      if (bird.x + halfBirdWidth > this.x && bird.x - halfBirdWidth < this.x + this.w) {
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

  drawHalf() {
    let howManyNedeed = 0;
    let peakRatio = pipePeakSprite.height / pipePeakSprite.width;
    let bodyRatio = pipeBodySprite.height / pipeBodySprite.width;
    //this way we calculate, how many tubes we can fit without stretching
    howManyNedeed = Math.round(height / (this.w * bodyRatio));
    //this <= and start from 1 is just my HACK xD But it's working
    for (let i = 0; i < howManyNedeed; ++i) {
      let offset = this.w * (i * bodyRatio + peakRatio);
      image(pipeBodySprite, -this.w / 2, offset, this.w, this.w * bodyRatio);
    }
    image(pipePeakSprite, -this.w / 2, 0, this.w, this.w * peakRatio);
  }

  show() {
    push();
    translate(this.x + this.w / 2, this.bottom);
    this.drawHalf();
    translate(0, -this.spacing);
    rotate(PI);
    this.drawHalf();
    pop();
  }

  update() {
    this.x -= this.speed;
  }

  offscreen() {
    return (this.x < -this.w);
  }
}
