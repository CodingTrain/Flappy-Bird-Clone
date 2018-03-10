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
var numbers;
var numberw;
var numberh;

function preload() {
  pipeBodySprite = loadImage("./graphics/pipe_body.png");
  pipePeakSprite = loadImage("./graphics/pipe_body.png");
  birdSprite = loadImage("graphics/train.png");
  bgImg = loadImage("graphics/background.png");
  numbers = loadImage("graphics/numbers.png");
}

function setup() {
  createCanvas(600, 600);
  bird = new Bird();
  pipes.push(new Pipe());
  numberw = numbers.width/10;
  numberh = numbers.height;
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

    if (pipes[i].hits(bird)) {
      gameover();
    }

    if (pipes[i].offscreen()) {
      pipes.splice(i, 1);
    }
  }

  bird.update();
  bird.show();

  if (frameCount % 150 == 0) {
    pipes.push(new Pipe());
  }

  showScores();
  showNumber(score,width/2,10);
}

function showScores() {
  textSize(32);
  text("score: " + score, 1, 32);
  text("record: " + maxScore, 1, 64);
}

function showNumber(n,x,y){
  var nString = n.toString();
  var finalX = x-((numberw*nString.length)/2);
  for (let i = 0; i < nString.length; i++){
    let offset = int(nString.charAt(i))*numberw;
    image(numbers,finalX+(i*numberw),y,numberw,numberh,offset,0,numberw,numberh);
  }
}

function gameover() {
  console.log("HIT");
  textSize(64);
  text("HIT", width / 2, height / 2);
  maxScore = max(score, maxScore);
  score = 0;
}
function keyPressed() {
  if (key == " ") {
    bird.up();
  }
}
