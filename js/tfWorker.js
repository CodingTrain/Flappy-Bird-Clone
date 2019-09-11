importScripts("sketch.js");
importScripts("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest");

var seqLen = 100;
var model;

maxVals = [600, 1, 18, 500];
minVals = [170, 0, -10, 0];

(async function main () {
    model = await tf.loadLayersModel('./models/lstm/model.json');
}());


onmessage = function(e) {

    if(e.data == null) return;

    //scale input arrays
    scaledBirdYVals = scaleVals(e.data[0], 0);
    scaledBirdJumpVals = scaleVals(e.data[1], 1);
    scaledBirdVeloctiyVals = scaleVals(e.data[2], 2);
    scaledPipeCenterYVals = scaleVals(e.data[3], 3);

    var pred = predict(scaledBirdYVals, scaledBirdJumpVals, scaledBirdVeloctiyVals, scaledPipeCenterYVals).dataSync();

    //unscale prediction arrays
    unScaledBirdYVals = unScaleVals(pred, 0);

    postMessage(unScaledBirdYVals);
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

function unScaleVals(valArr, valInd){

    for(var i = 0;i<valArr.length;i++){
        newVal = minVals[valInd] + (valArr[i] * (maxVals[valInd] - minVals[valInd]))
        
        valArr[i] = newVal;
    } 

    return valArr;
}

function scaleVals(valArr, valInd){

    for(var i = 0;i<valArr.length;i++){
        newVal = (valArr[i] - minVals[valInd]) / (maxVals[valInd] - minVals[valInd]);
        
        valArr[i] = newVal;
    } 

    return valArr;
}