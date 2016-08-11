window.addEventListener('load', function() {

    'use strict';

    const WIDTH = 1200,
          HEIGHT = 700;

    var bgCanvas = createCanvas('background-canvas', WIDTH, HEIGHT),
        bgContext = bgCanvas.getContext('2d');

    var shipCanvas = createCanvas('ship-canvas', WIDTH, HEIGHT),
        shipContext = shipCanvas.getContext('2d'),
        shipImg = document.getElementById('ship');

    var enemyCanvas = createCanvas('enemy-canvas', WIDTH, HEIGHT),
        enemyContext = enemyCanvas.getContext('2d'),
        enemyImg = document.getElementById('enemy');

    var ship = createShip(shipContext, shipImg, WIDTH, HEIGHT);
    var enemy = createEnemy(enemyContext, enemyImg, WIDTH, HEIGHT);


    var lastShipLocation = {x: ship.shipBody.x, y: ship.shipBody.y};
    var lastEnemyLocation = {x: enemy.enemyBody.x, y: enemy.enemyBody.y};

    function gameLoop() {

      ship.shipObject
        .render(
          {x: ship.shipBody.x, y: ship.shipBody.y},
          lastShipLocation, 2)
        .update(true);

      enemy.enemyObject
        .render(
          {x: enemy.enemyBody.x, y: enemy.enemyBody.y},
          lastEnemyLocation, 2)
        .update(false);

        window.requestAnimationFrame(gameLoop);
    }

    gameLoop();
});
