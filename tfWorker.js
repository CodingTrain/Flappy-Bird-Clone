importScripts("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest");
importScripts("sketch.js");

var seqLen = 100;
var model;


birdY 568.0 176.39999999999958
birdJump 0 0
birdVelocity 18.2 -9.4
pipeY 543.5794604336872 0.0

(async function main () {
    model = await tf.loadLayersModel('models/model.json');
}());


onmessage = function(e) {

    if(e.data == null) return;

    var pred = predict(e.data[0], e.data[1], e.data[2], e.data[3]);

    postMessage(pred);
}

function transferLearn(){

}

function predict(birdYVals, birdJumpVals, birdVeloctiyVals, pipeCenterYVals){
    if(model == null || birdYVals.length < seqLen) return;
  
    //grab the last seqLen points
    var len = birdYVals.length - 1;
  
    var lastBirdY = birdYVals.slice(len - seqLen, len);
    var lastBirdJump = birdJumpVals.slice(len - seqLen, len);
    var lastBirdVelocity = birdVeloctiyVals.slice(len - seqLen, len);
    var lastPipeY = pipeCenterYVals.slice(len - seqLen, len);
  
    var inputArr = [];
  
    for(var i = 0;i<seqLen;i++){
      inputArr.push([lastBirdY[i], lastBirdJump[i], lastBirdVelocity[i], lastPipeY[i]]);
    }
  
    var input = tf.tensor([inputArr]);
  
    var pred = model.predict(input);
    input.dispose();
  
    return pred;
}

function unScaleVals(){
    
}

function scaleVals(){

}