//ES6ified......

//The pipe bug fixed!!
//Buggy lines commented not erased
//Spacing can be random; that won't cause a bug
//I just hardcoded it to match with the real game
//Same thing goes for this.top

//Changes:
        // Initializing of this.bottom in other way
        // Drawing of the bottom pipe wrt new values of this.bottom
        // Checking collision wrt new values of this.bottom


class Pipe
{
  constructor()
  {
    // this.spacing = random(40, height/2);
    // this.top = random(height - this.spacing);
    this.spacing = 100;

    // Setting the min elongation of pipes to 100
    // With that said; max elongation becomes height - spacing - minElongation
    // That is 600 - 100 - 100 which is equal to 400
    this.top = random(height/6, 3/4*height);
    this.bottom = this.top + this.spacing;

    this.x = width;
    this.w = 20;
    this.speed = 2;
      
    this.passed=false;
    this.highlight = false;
  }

  hits(bird)
  {
    if (bird.y < this.top || bird.y+bird.height > /*height -*/ this.bottom) {
      if (bird.x<this.x && bird.x+bird.width>this.x+this.w) {
        this.highlight = true;
        this.passed=true;
        return true;
      }
    }
    this.highlight = false;
    return false;
  }
  
//this will check if we flew over the tube and will give us a score
  pass(bird) {
        if (bird.x > this.x && !this.passed) {
            this.passed=true;
            return true;
        }
        return false;
  }

  show()
  {
    image(pipeBodySprite,this.x,0,this.w,this.top);
    image(pipeBodySprite,this.x,this.bottom,this.w,height);
  }

  update()
  {
    this.x -= this.speed;
  }

  offscreen()
  {
    if (this.x < -this.w) {
      return true;
    } else {
      return false;
    }
  }

}
