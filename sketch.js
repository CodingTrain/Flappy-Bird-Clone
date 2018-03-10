// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/cXgA1d_E-jY

var bird;
var pipes = [];
var parallax = 0.8;
var score = 0;
var maxScore = 0;
var birdIcon;
var pipeBodySprite;
var pipePeakSprite;
var bgImg;
var bgX = 0;
var gameoverFrame=0;

function preload() {
  pipeBodySprite = loadImage("./graphics/pipe_body.png");
  pipePeakSprite = loadImage("./graphics/pipe_body.png");
  birdSprite = loadImage("graphics/train.png");
  bgImg = loadImage("graphics/background.png");
}

function setup() {
  createCanvas(600, 600);
  bird = new Bird();
  pipes.push(new Pipe());
}

function draw() {
  background(0);
  // Draw our background image, then move it at the same speed as the pipes
  image(bgImg, bgX, 0, bgImg.width, height);
  bgX -= pipes[0].speed * parallax;

  // this handles the "infinite loop" by checking if the right
  // edge of the image would be on the screen, if it is draw a
  // second copy of the image right next to it
  // once the second image gets to the 0 point, we can reset bgX to
  // 0 and go back to drawing just one image.
  if(bgX <= -bgImg.width + width){
    image(bgImg, bgX + bgImg.width, 0, bgImg.width, height);
    if(bgX <= -bgImg.width){
      bgX = 0;
    }
  }

  for (var i = pipes.length - 1; i >= 0; i--) {
    pipes[i].show();
    pipes[i].update();

    if (pipes[i].pass(bird)) {
      console.log("YAY");
      score++;
    }

    if (pipes[i].offscreen()) {
      pipes.splice(i, 1);
    }
      
    //keep this the last check for pipes, as if you change its place, code is gonna break. It's made that way to avoid rewriting a lot of stuff
    if (pipes[i].hits(bird)) {
      gameover();
    }
  }

  bird.update();
  bird.show();

  if ((frameCount-gameoverFrame) % 150 == 0) {
    pipes.push(new Pipe());
  }

  showScores();
}

function showScores() {
  textSize(32);
  text("score: " + score, 1, 32);
  text("record: " + maxScore, 1, 64);
}

function restart() {
  score = 0;
  //we start new game. to let this happen, we need to drop pipes to nothing
  pipes=[];
  //no memory leak here. JS engine will clear memory as nothing is refered to old Bird object.
  bird = new Bird();
  //each time we loose we reset our pipe push timer
  gameoverFrame=frameCount-1;
  //we need to push pipe as it's done in setup
  pipes.push(new Pipe());
  //It works like restart because when you run setup, it's frame 0. Then frame 1 goes when it goes to draw, so it should be fine (right? frameCount increases at the end of update?)
}

function gameover() {
  console.log("HIT");
  textSize(64);
  text("HIT", width / 2, height / 2);
  maxScore = max(score, maxScore);
  restart();
}

function keyPressed() {
  if (key == " ") {
    bird.up();
  }
}
