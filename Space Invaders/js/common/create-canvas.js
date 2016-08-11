function createCanvas(canvasId, canvasWidth, canvasHeight) {

  'use strict';

  var newCanvas = document.getElementById(canvasId);

  newCanvas.width = canvasWidth;
  newCanvas.height = canvasHeight;

  return newCanvas;
}
