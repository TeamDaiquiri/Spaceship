function createEnemy(ctx, image, xCoord, yCoord) {

  'use strict';

  var enemyObject = createGameObject({
    spritesheet: image,
    context: ctx,
    width: image.width,
    height: image.height,
    colsCount: 3,
    rowsCount: 2,
    colIndex: 0,
    rowIndex: 0,
    loopTicksCount: 0,
    loopTicksPerFrame: 25,
  });

  var singleEnemyWidth = enemyObject.width/enemyObject.colsCount,
      singleEnemyHeight = enemyObject.height/enemyObject.rowsCount;

  var enemyBody = createPhysicalBody({
    x: xCoord,
    y: yCoord,
    speed: 1,
    width: singleEnemyWidth,
    height: singleEnemyHeight
  });

  return {
    enemyObject: enemyObject,
    enemyBody: enemyBody
  };
}
