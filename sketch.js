// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/cXgA1d_E-jY&


var bird;
var pipes = [];
var bg;
var score=0;

var trainSprite, pipeSprite,pipBodySprite,bgSprite;

function preload() {
    
trainSprite = loadImage("./img/train.png");
//pipeSprite = loadImage("./img/pipe.png");
pipeBodySprite = loadImage("./img/pipe_body.png");
bgSprite = loadImage("./img/background.png");
    
}


function setup() {
  createCanvas(600, 600);
  bird = new Bird();
  pipes.push(new Pipe());
  bg = new Background();
}

function draw() {
  background(0);
  bg.update();
    
  for (var i = pipes.length - 1; i >= 0; i--) {
    pipes[i].show();
    pipes[i].update();

    if (pipes[i].pass(bird)) {
      console.log("YAY");
      score++;
    }
      
    if (pipes[i].hits(bird)) {
      gameover();
    }


    if (pipes[i].offscreen()) {
      pipes.splice(i, 1);
    }


  }

  bird.update();
  bird.show();

  if (frameCount % 100 == 0) {
    pipes.push(new Pipe());
  }


  showScores();
}

function showScores() {
    textSize(32);
    text("score: "+score,1,32 );    
}

function gameover() {
      console.log("HIT");
      textSize(64);  
      text('HIT',width/2,height/2);
      score=0;
}
function keyPressed() {
  if (key == ' ') {
    bird.up();
    //console.log("SPACE");
  }
}