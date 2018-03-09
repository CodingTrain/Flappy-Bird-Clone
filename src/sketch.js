// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/cXgA1d_E-jY&


/* global createCanvas, background, frameCount, key */

import Bird from "bird";
import Pipe from "pipe";

var bird;
var pipes = [];

window.setup = function() {
  createCanvas(400, 600);
  bird = new Bird();
  pipes.push(new Pipe());
};

window.draw = function() {
  background(0);

  for (var i = pipes.length - 1; i >= 0; i--) {
    pipes[i].show();
    pipes[i].update();

    if (pipes[i].offscreen()) {
      pipes.splice(i, 1);
    }
  }

  bird.update();
  bird.show();

  if (frameCount % 100 == 0) {
    pipes.push(new Pipe());
  }
};

window.keyPressed = function() {
  if (key == " ") {
    bird.up();
  }
};
