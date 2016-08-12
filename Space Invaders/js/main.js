window.addEventListener('load', function() {

    'use strict';

    const WIDTH = 1200,
          HEIGHT = 700,
          dirDeltas = [{
              "x": -3,
              "y": 0
          }, {
              "x": 0,
              "y": -3
          }, {
              "x": +3,
              "y": 0
          }, {
              "x": 0,
              "y": +3
          }];

    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    var bgCanvas = createCanvas('background-canvas', WIDTH, HEIGHT),
        bgContext = bgCanvas.getContext('2d');

    var shipCanvas = createCanvas('ship-canvas', WIDTH, HEIGHT),
        shipContext = shipCanvas.getContext('2d'),
        shipImg = document.getElementById('ship');

    var enemyCanvas = createCanvas('enemy-canvas', WIDTH, HEIGHT),
        enemyContext = enemyCanvas.getContext('2d'),
        enemyImg = document.getElementById('enemy'),
        randomGeneratedNumber = 0,
        loopIterations = 0,
        enemyCount = 2;

    var bulletCanvas = createCanvas('bullet-canvas', WIDTH, HEIGHT),
        bulletContext = bulletCanvas.getContext('2d'),
        bulletImg = document.getElementById('bullet'),
        enemyBulletImg = document.getElementById('enemy-bullet');

    var shipSpeed = 7,
       ship = createShip(shipContext, shipImg, WIDTH, HEIGHT, shipSpeed);

    var shipBullets = [],
        enemies = [],
        enemyBullets = [];

    var playerHealth = document.getElementById('health'),
        hittedEnemies = document.getElementById('hits'),
        results = document.getElementById('results');

    function GenerateEnemy(enemies, count) {
        var offset = 1.5,
            boundOfRow = Math.floor((enemyCanvas.height / 2) / (offset * enemyImg.height)),
            boundCol = Math.floor(enemyCanvas.width / (offset * enemyImg.width)),
            generated = 0;

        for (var row = 0; row < boundOfRow; row += 1) {
            for (var col = 0; col < boundCol; col += 1) {
                if (getRandomNumber(0, 2)) {
                    enemies.push(
                      createEnemy(enemyContext,
                                  enemyImg,
                                  col * (offset * enemyImg.width),
                                  row * (offset * enemyImg.height)));

                    if ((generated += 1) > count) {
                        return;
                    }
                }
            }
        }
    }

    function CheckBounds(x, y, itemWidth, itemHeight) {
        if ((x <= 0) ||
            (x + itemWidth >= WIDTH) ||
            (y <= 0) ||
            (y + itemHeight >= HEIGHT)) {
            return true;
        }
        return false;
    }

    function getOpositeMovement(numb) {
        if (numb === 0) {
            return 2;
        }
        if (numb === 1) {
            return 3;
        }
        if (numb === 2) {
            return 0;
        }
        if (numb === 3) {
            return 1;
        }
    }

    function CheckFriendlyCollision(enemies, neighbour) {
        var areColliding = false;
        enemies.forEach(function(item, index) {
            if (neighbour !== item) {
                if (neighbour.enemyBody.collisionWith(item.enemyBody, 20)) {
                    areColliding = true;
                }
            }
        });
        return areColliding;
    }

    function BulletInteraction(bullets, enemies) {
        bullets.forEach(function(item, index) {
            var lastBullet = item.bulletBody.move(dirDeltas[1]),
                offsetX = 15,
                offsetY = 15,
                offsetWidth = 30,
                offsetHeight = 30;
            item.bulletObject.update();
            item.bulletObject.render({
                x: item.bulletBody.x,
                y: item.bulletBody.y - offsetY
            }, lastBullet, 2);

            for (var i = 0, len = enemies.length; i < len; i += 1) {
                var el = enemies[i].enemyBody;

                if (item.bulletBody.collisionWith(el)) {
                    //console.log(enemies.length);
                    enemies.splice(i, 1);
                    bullets.splice(index, 1);
                    enemyContext.clearRect(
                        el.x - offsetX,
                        el.y - offsetY,
                        el.width + offsetWidth,
                        el.height + offsetHeight
                    );
                    bulletContext.clearRect(
                        item.bulletBody.x - offsetX,
                        item.bulletBody.y - offsetY,
                        item.bulletBody.width + offsetWidth,
                        item.bulletBody.height + offsetHeight
                    );
                    break;
                }
            }

            if (item.bulletBody.y <= 0) {
                bullets.splice(index, 1);
                bulletContext.clearRect(
                    item.bulletBody.x,
                    item.bulletBody.y,
                    item.bulletBody.width,
                    item.bulletBody.height
                );
            }
        });
    }

    function EnemyBulletInteraction(enemyBullets) {
        enemyBullets.forEach(function(item, index) {
            var lastBullet = item.bulletBody.move(dirDeltas[3]);

            item.bulletObject.update();
            item.bulletObject.render({
                x: item.bulletBody.x,
                y: item.bulletBody.y
            }, lastBullet, 2);

            if (CheckBounds(item.bulletBody.x, item.bulletBody.y,
                            item.bulletBody.width, item.bulletBody.height) ||
                (item.bulletBody.collisionWith(ship.shipBody))) {

                bulletContext.clearRect(
                    item.bulletBody.x - 3,
                    item.bulletBody.y - 3,
                    item.bulletBody.width + 6,
                    item.bulletBody.height + 6
                );

                enemyBullets.splice(index, 1);
                ship.shipBody.health -= 10;
            }
        });
    }

    function EnemyInteraction(enemies) {
        enemies.forEach(function(item, index) {
            var offset = 5,
                prevEnemyPosition = item.enemyBody.move(dirDeltas[randomGeneratedNumber]);

            if (CheckBounds(item.enemyBody.x, item.enemyBody.y,
                            item.enemyBody.width, item.enemyBody.height) ||
                CheckFriendlyCollision(enemies, item) ||
                item.enemyBody.collisionWith(ship.shipBody)) {

                prevEnemyPosition = item.enemyBody.move(dirDeltas[getOpositeMovement(randomGeneratedNumber)]);
            }

            if (item.enemyBody.collisionWith(ship.shipBody)) {
                ship.shipBody.health -= 10;
            }

            item.enemyObject.update();
            item.enemyObject.render({
                x: item.enemyBody.x,
                y: item.enemyBody.y
            }, prevEnemyPosition, 2);

            if (getRandomNumber(0, 110) === 0) {
                enemyBullets.push(
                  createBullet(bulletContext,
                               enemyBulletImg,
                               item.enemyBody.x + offset,
                               item.enemyBody.y + offset));
            }
        });
    }

    function ChangeEnemyDirection(steps) {
        loopIterations += 1;
        if (loopIterations === steps) {
            loopIterations = 0;
            randomGeneratedNumber = getRandomNumber(0, 4);
        }
    }

    function checkIsAlive(player) {
        if (player.shipBody.health <= 0) {
            console.log("Loser");
            //results.innerHTML("You LOOSE!")
        }
    }

    var lastShipLocation = { x: ship.shipBody.x, y: ship.shipBody.y };

    function gameLoop() {

        ship.shipObject
            .render({ x: ship.shipBody.x, y: ship.shipBody.y },
                lastShipLocation, 10)
            .update(true);

        BulletInteraction(shipBullets, enemies);

        ChangeEnemyDirection(15);

        EnemyBulletInteraction(enemyBullets);

        EnemyInteraction(enemies);

        checkIsAlive(ship);

        if (enemies.length === 0) {
            enemyCount += 1;
            GenerateEnemy(enemies, enemyCount);
        }

        playerHealth.innerHTML = ship.shipBody.health;
        hits.innerHTML = enemies.length;

        window.requestAnimationFrame(gameLoop);
    }

    document.body.addEventListener('keydown', function(ev) {
        var offset = 5;

        if ((37 <= ev.keyCode) && (ev.keyCode <= 40)) {
            lastShipLocation = ship.shipBody.move(dirDeltas[ev.keyCode - 37]);
            ship.shipObject.update();
        } else if (ev.keyCode === 32) {
            var shipBullet = createBullet(bulletContext, bulletImg, ship.shipBody.x + 5 * offset, ship.shipBody.y + offset);

            shipBullets.push(shipBullet);
        }
    });

    document.body.addEventListener('keyup', function(ev) {
         ship.shipObject.restart();
    });

    gameLoop();
});
