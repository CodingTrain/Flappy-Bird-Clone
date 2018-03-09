class Background{

  constructor()
  {
    this.x1 = 0;
    this.x2 = width;
    this.speed=2;
  }

  update() {
      this.x1+=-this.speed;
      this.x2+=-this.speed;
      image(bgSprite,this.x1,0,width,height);
      image(bgSprite,this.x2,0,width,height);
      
      if (this.x1<=-width)     this.x1=width;
      if (this.x2<=-width)     this.x2=width;
  }

}