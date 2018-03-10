// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/cXgA1d_E-jY

/* global Bird, Pipe */

var bird;
var pipes = [];
var parallax = 0.8;
var score = 0;
var maxScore = 0;
/* eslint-disable no-unused-vars */
var birdSprite;
var pipeBodySprite;
var pipePeakSprite;
/* eslint-enable no-unused-vars */
var bgImg;
var bgX = 0;

// eslint-disable-next-line no-unused-vars
function preload() {
  pipeBodySprite = loadImage('./graphics/pipe_body.png');
  pipePeakSprite = loadImage('./graphics/pipe_body.png');
  birdSprite = loadImage('graphics/train.png');
  bgImg = loadImage('graphics/background.png');
}

// eslint-disable-next-line no-unused-vars
function setup() {
  createCanvas(600, 600);
  bird = new Bird();
  pipes.push(new Pipe());
}

// eslint-disable-next-line no-unused-vars
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
  if (bgX <= -bgImg.width + width) {
    image(bgImg, bgX + bgImg.width, 0, bgImg.width, height);
    if (bgX <= -bgImg.width) {
      bgX = 0;
    }
  }

  for (var i = pipes.length - 1; i >= 0; i--) {
    pipes[i].show();
    pipes[i].update();

    if (pipes[i].pass(bird)) {
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

  if (frameCount % 150 === 0) {
    pipes.push(new Pipe());
  }

  showScores();
}

// eslint-disable-next-line no-unused-vars
function showScores() {
  textSize(32);
  text('score: ' + score, 1, 32);
  text('record: ' + maxScore, 1, 64);
}

function gameover() {
  textSize(64);
  text('HIT', width / 2, height / 2);
  maxScore = max(score, maxScore);
  score = 0;
}

// eslint-disable-next-line no-unused-vars
function keyPressed() {
  if (key === ' ') {
    bird.up();
  }
}
