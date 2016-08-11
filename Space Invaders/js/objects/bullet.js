function createBullet(ctx, bulletImg, xCoord, yCoord) {

  'use strict';

  var bulletObject = createGameObject({
        spritesheet: bulletImg,
        context: ctx,
        width: bulletImg.width,
        height: bulletImg.height,
        colsCount: 1,
        rowsCount: 3,
        colIndex: 0,
        rowIndex: 0,
        loopTicksCount: 0,
        loopTicksPerFrame: 12
    });

    var bulletBody = createPhysicalBody({
        x: xCoord,
        y: yCoord,
        speed: 2,
        width: bulletImg.width,
        height: bulletImg.height / 3
    });

    return {
        bulletObject: bulletObject,
        bulletBody: bulletBody
    };
}
