// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/cXgA1d_E-jY&

function Bird() {
  this.y = height / 2;
  this.x = 64;

  this.gravity = 0.6;
  this.lift = -15;
  this.velocity = 0;

  this.icon = loadImage("graphics/train.png");
  this.width = 64;
  this.height = 64;

  this.show = function() {
    // draw the icon CENTERED around the X and Y coords of the bird object
    // TODO: Refactor code so Bird is called Train
    image(this.icon, this.x - (this.width / 2), this.y - (this.height / 2), this.width, this.height);
  }

  this.up = function() {
    this.velocity += this.lift;
  }

  this.update = function() {
    this.velocity += this.gravity;
    this.velocity *= 0.9;
    this.y += this.velocity;

    if (this.y > height) {
      this.y = height;
      this.velocity = 0;
    }

    if (this.y < 0) {
      this.y = 0;
      this.velocity = 0;
    }

  }

}