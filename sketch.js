// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/cXgA1d_E-jY

// P5 exported functions (eslint flags)
/* exported preload, setup, draw, keyPressed */

// Exported sprites (eslint flags)
/* exported birdSprite, pipeBodySprite, pipePeakSprite */

var bird;
var pipes;
var parallax = 0.8;
var score = 0;
var maxScore = 0;
var birdSprite;
var pipeBodySprite;
var pipePeakSprite;
var bgImg;
var bgX;
var gameoverFrame = 0;
var isOver = false;

var touched = false;
var prevTouched = touched;

var birdYVals = [];
var birdJumpVals = [];
var birdVeloctiyVals = [];
var pipeCenterYVals = [];
var nextPipe = null;

function preload() {
  pipeBodySprite = loadImage('graphics/pipe_marshmallow_fix.png');
  pipePeakSprite = loadImage('graphics/pipe_marshmallow_fix.png');
  birdSprite = loadImage('graphics/train.png');
  bgImg = loadImage('graphics/background.png');
}

function setup() {
  createCanvas(800, 600);
  reset();
}

function draw() {
  if(isOver) return;

  background(0);
  // Draw our background image, then move it at the same speed as the pipes
  image(bgImg, bgX, 0, bgImg.width, height);
  bgX -= pipes[0].speed * parallax;

  // this handles the "infinite loop" by checking if the right
  // edge of the image would be on the screen, if it is draw a
  // second copy of the image right next to it
  // once the second image gets to the 0 point, we can reset bgX to
  // 0 and go back to drawing just one image.
  if (bgX <= -bgImg.width + width) {
    image(bgImg, bgX + bgImg.width, 0, bgImg.width, height);
    if (bgX <= -bgImg.width) {
      bgX = 0;
    }
  }

  for (var i = pipes.length - 1; i >= 0; i--) {
    pipes[i].update();
    pipes[i].show();

    if (pipes[i].pass(bird)) {
      score++;
      nextPipe = pipes[i+1];
    }

    if (pipes[i].hits(bird)) {
      gameover();
      isOver = true;
      noLoop();
    }

    if (pipes[i].offscreen()) {
      pipes.splice(i, 1);
    }
  }

  bird.update();
  bird.show();

  if ((frameCount - gameoverFrame) % 150 == 0) {
    pipes.push(new Pipe());
    if(nextPipe == null) nextPipe = pipes[pipes.length-1];
  }

  showScores();

  // touches is an list that contains the positions of all
  // current touch points positions and IDs
  // here we check if touches' length is bigger than one
  // and set it to the touched var
  touched = (touches.length > 0);

  // if user has touched then make bird jump
  // also checks if not touched before
  if (touched && !prevTouched) {
    bird.up();
    birdJumpVals.push(1);
  }
  else{
    birdJumpVals.push(0);
  }

  birdYVals.push(bird.y);
  birdVeloctiyVals.push(bird.velocity);

  if(nextPipe != null){
    pipeCenterYVals.push(nextPipe.centerY());
  }
  else{
    pipeCenterYVals.push(0);
  }

  drawBirdLine();

  // updates prevTouched
  prevTouched = touched;
}

function drawBirdLine(){
  console.log(frameCount)

}

function showScores() {
  textSize(32);
  text('score: ' + score, 1, 32);
  text('record: ' + maxScore, 1, 64);
}

function gameover() {
  textSize(64);
  textAlign(CENTER, CENTER);
  text('GAMEOVER', width / 2, height / 2);
  textAlign(LEFT, BASELINE);
  maxScore = max(score, maxScore);
  
  console.log("game over");

  //save the data to a csv
  var csvOutput = "data:text/csv;charset=utf-8," + "birdY,birdJump,birdVelocity,pipeY\r\n";

  for(var i = 0;i<birdYVals.length;i++){
    csvOutput += birdYVals[i]+",";
    csvOutput += birdJumpVals[i]+",";
    csvOutput += birdVeloctiyVals[i]+",";
    csvOutput += pipeCenterYVals[i];

    csvOutput += "\r\n";
  }

  var encodedUri = encodeURI(csvOutput);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "flappyBird.csv");
  document.body.appendChild(link); // Required for FF
  
  link.click();
}

function reset() {
  isOver = false;
  score = 0;
  bgX = 0;
  pipes = [];
  bird = new Bird();
  pipes.push(new Pipe());
  gameoverFrame = frameCount - 1;
  loop();
}

function keyPressed() {
  if (key === ' ') {
    bird.up();
    if (isOver) reset(); //you can just call reset() in Machinelearning if you die, because you cant simulate keyPress with code.
  }
}

function touchStarted() {
  if (isOver) reset();
}