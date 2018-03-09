class Bird{

  constructor()
  {
    this.y = height / 2;
    this.x = 64;
      
    this.width=64;
    this.height=64;

    this.gravity = 0.6;
    this.lift = -15;
    this.velocity = 0;
  }

  show()
  {
    image(trainSprite,this.x,this.y,this.width,this.height);    
  }

  up()
  {
      this.velocity += this.lift;
  }

  update()
  {
    this.velocity += this.gravity;
    this.velocity *= 0.9;
    this.y += this.velocity;

    if (this.y+this.height > height) {
      this.y = height-this.height;
      this.velocity = 0;
    }

    if (this.y < 0) {
      this.y = 0;
      this.velocity = 0;
    }
  }

}
