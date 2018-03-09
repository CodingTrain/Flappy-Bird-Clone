// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/cXgA1d_E-jY&

function Pipe() {
  // Generate the spacing amount we want first, then we can
  // define the top and bottom from that. To begin with we
  // want it centered so top and bottom are based off of eachother
  this.spacing = random(100, height / 2);
  this.top = (height - this.spacing) / 2;
  this.bottom = height - this.top;

  // Then we can create an adjustment amount to shift the gap
  // either up or down the screen, but never off as we use 
  // spacing / 2 which we know will always leave us SOME pipe showing
  this.adjustment = random(-(this.spacing / 2), this.spacing / 2);
  this.top += this.adjustment;
  this.bottom += this.adjustment;
  
  this.x = width;
  this.w = 20;
  this.speed = 2;

  this.highlight = false;

  this.hits = function(bird) {
    // Because this.bottom is now exactly where the pipe starts
    // we use it directly not needing height - 
    if (bird.y < this.top || bird.y > this.bottom) {
      if (bird.x > this.x && bird.x < this.x + this.w) {
        this.highlight = true;
        return true;
      }
    }
    this.highlight = false;
    return false;
  }

  this.show = function() {
    fill(255);
    if (this.highlight) {
      fill(255, 0, 0);
    }
    rect(this.x, 0, this.w, this.top);
    rect(this.x, this.bottom, this.w, height);
  }

  this.update = function() {
    this.x -= this.speed;
  }

  this.offscreen = function() {
    if (this.x < -this.w) {
      return true;
    } else {
      return false;
    }
  }


}
