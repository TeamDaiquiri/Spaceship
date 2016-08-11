function createEnemy(ctx, image, WIDTH, HEIGHT) {

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

  var singleEnemyWidth = enemy.width/enemy.colsCount,
      singleEnemyHeight = enemy.height/enemy.rowsCount,
      enemyStartX = WIDTH/2,
      enemyStartY = 10;

  var enemyBody = createPhysicalBody({
    x: enemyStartX,
    y: enemyStartY,
    speed: 1,
    width: singleEnemyWidth,
    height: singleEnemyHeight
  });

  return {
    enemyObject: enemyObject,
    enemyBody: enemyBody
  };
}
