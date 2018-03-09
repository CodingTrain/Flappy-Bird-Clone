// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/cXgA1d_E-jY&

class Bird {
  constructor() {
    this.y = height/2;
    this.x = 64;

    this.size = 32;
    
    this.gravity = 0.6;
    this.lift = -15;
    this.velocity = 0;
    
    this.icon = loadImage("graphics/train.png");
    this.width = 64;
    this.height = 64;
  }

  show() {
    // draw the icon CENTERED around the X and Y coords of the bird object
    image(this.icon, this.x - (this.width / 2), this.y - (this.height / 2), this.width, this.height);
  }
  
  up() {
    this.velocity += this.lift;
  }

  update() {
    this.velocity += this.gravity;
    this.velocity *= 0.9;
    this.y += this.velocity;
    
   if (this.y > height) {
      this.y = height ;

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

