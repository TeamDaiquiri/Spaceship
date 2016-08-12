function createShip(ctx, image, WIDTH, HEIGHT, playerSpeed) {

  'use strict';

  //var self = this;

  var shipObject = createGameObject({
    spritesheet: image,
    context: ctx,
    width: image.width,
    height: image.height,
    colsCount: 1,
    rowsCount: 3,
    colIndex: 0,
    rowIndex: 0,
    loopTicksCount: 0,
    loopTicksPerFrame: 25,
  });

  var singleShipWidth = shipObject.width / shipObject.colsCount,
      singleShipHeight = shipObject.height / shipObject.rowsCount,
      shipStartX = WIDTH / 2 - singleShipWidth / 2,
      shipStartY = HEIGHT - singleShipHeight - 10;

  var shipBody = createPhysicalBody({
    x: shipStartX,
    y: shipStartY,
    speed: playerSpeed,
    width: singleShipWidth,
    height: singleShipHeight
  });

  return {
    shipObject: shipObject,
    shipBody: shipBody
  };
}
