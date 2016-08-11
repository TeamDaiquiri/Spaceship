window.addEventListener('load', function () {

    'use strict';

    var WIDTH = 1200,
        HEIGHT = 650;

    var playerCanvas = document.getElementById('player-canvas'),
        playerContext = playerCanvas.getContext('2d'),
        backgroundCanvas = document.getElementById('background-canvas'),
        backgroundContext = backgroundCanvas.getContext('2d'),
        playerImg = document.getElementById('pikachu-sprite'),
        bulletImg = document.getElementById('bullet'),
        backgr = document.getElementById('sky');

    backgroundContext.drawImage(backgr, 0, 0, 1200, 650);

    playerCanvas.width = WIDTH;
    playerCanvas.height = HEIGHT;

    var pikachuRunningSprite = createSprite({
        spritesheet: playerImg,
        width: playerImg.width,
        height: playerImg.height,
        context: playerContext,
        numberOfFrames: 1,
        loopTicksPerFrame: 1
    });


    var boomImg = document.getElementById('dead-player');

    var boomSprite = createSprite({
        spritesheet: boomImg,
        context: playerContext,
        width: boomImg.width / 8,
        height: boomImg.height,
        numberOfFrames: 8,
        loopTicksPerFrame: 8
    });

    var pikachuBody = createPhysicalBody({
        defaultAcceleration: { x: 10, y: 10 },
        coordinates: { x: 550, y: HEIGHT - pikachuRunningSprite.height },
        speed: { x: 0, y: 0 },
        height: pikachuRunningSprite.height,
        width: pikachuRunningSprite.width
    });

    window.addEventListener('keydown', function (event) {

        switch (event.keyCode) {
            case 37:

                if (pikachuBody.speed.x < 0) {
                    return;
                }
                if (pikachuBody.speed.x > 0) {
                    pikachuBody.accelerate('x', -2);
                    return;
                }
                pikachuBody.accelerate('x', -1);
                break;

            case 38:

                if (pikachuBody.speed.y < 0) {
                    return;
                }
                if (pikachuBody.speed.y > 0) {
                    pikachuBody.accelerate('y', -2);
                    return;
                }
                pikachuBody.accelerate('y', -1);
                break;

            case 40:

                if (pikachuBody.speed.y > 0) {
                    return;
                }
                if (pikachuBody.speed.y < 0) {
                    pikachuBody.accelerate('y', 2);
                    return;
                }
                pikachuBody.accelerate('y', 1);
                break;

            case 39:

                if (pikachuBody.speed.x > 0) {
                    return;
                }
                if (pikachuBody.speed.x < 0) {
                    pikachuBody.accelerate('x', 2);
                    return;
                }
                pikachuBody.accelerate('x', 1);
                break;

            default:
                break;
        }
    });

    var bullets = [];

    window.addEventListener('keyup', function () {

        if (event.keyCode === 32) {
            var newbullet = createBullet(pikachuBody.coordinates.x, pikachuBody.coordinates.y - 20);
            bullets.push(newbullet);
        }

        if ((event.keyCode !== 37) && (event.keyCode !== 39) && (event.keyCode !== 38) && (event.keyCode !== 40)) {
            return;
        }

        pikachuBody.speed.x = 0;
        pikachuBody.speed.y = 0;
    });

    var pokeballCanvas = document.getElementById('pokeball-canvas'),
        pokeballContext = pokeballCanvas.getContext('2d'),
        pokeballImg = document.getElementById('pokeball-sprite');

    pokeballCanvas.width = WIDTH;
    pokeballCanvas.height = HEIGHT;

    function createPokeball(offsetX) {
        var pokeballSprite = createSprite({
            spritesheet: pokeballImg,
            context: pokeballContext,
            width: pokeballImg.width,
            height: pokeballImg.height,
            numberOfFrames: 1,
            loopTicksPerFrame: 1
        });

        var pokeballBody = createBody({
            defaultAcceleration: { x: 5, y: 0 },
            coordinates: { x: offsetX, y: 50 + pokeballSprite.height },
            speed: { x: -5, y: 0 },
            width: pokeballSprite.width,
            height: pokeballSprite.height
        });

        return {
            sprite: pokeballSprite,
            body: pokeballBody
        };
    }

    function createBullet(bulx, buly) {
        var bulletSprite = createSprite({
            spritesheet: bulletImg,
            context: playerContext,
            width: bulletImg.width,
            height: bulletImg.height,
            numberOfFrames: 1,
            loopTicksPerFrame: 1
        });

        var bulletBody = createBody({
            defaultAcceleration: { x: 0, y: -5 },
            coordinates: { x: bulx + 20, y: buly },
            speed: { x: 0, y: -12 },
            width: bulletImg.width,
            height: bulletImg.height
        });

        return {
            sprite: bulletSprite,
            body: bulletBody
        };
    }

    var pokeballs = [];

    function spawnPokeball() {
        var spawnChance = 0.02,
            spawnOffsetX = 100;

        if (Math.random() < spawnChance) {
            if (pokeballs.length) {
                var lastPokeball = pokeballs[pokeballs.length - 1];
                var starting = Math.max(lastPokeball.body.coordinates.x + lastPokeball.body.width + spawnOffsetX, WIDTH);
                var newPokeball = createPokeball(starting);
                pokeballs.push(newPokeball);

            } else {
                pokeballs.push(createPokeball(WIDTH));
            }
        }
    }
    
    
    var currentPikachuSprite = pikachuRunningSprite;
    var counter = 0;

    function gameLoop() {

        var pokeball,
            bullet,
            lastbulletcoordinates,
            lastPikachuCoordinates,
            i, j,
            lastPokeballCoordinates;

        lastPikachuCoordinates = pikachuBody.move();

        currentPikachuSprite
            .render(pikachuBody.coordinates, lastPikachuCoordinates)
            .update();

        // update, draw, move all pokeballs
        for (i = 0; i < pokeballs.length; i += 1) {

            pokeball = pokeballs[i];

            // if out of game field, remove pokeball
            if (pokeball.body.coordinates.x < -pokeball.body.width) {
                pokeballs.splice(i, 1);
                i -= 1;
                continue;
            }

            lastPokeballCoordinates = pokeball.body.move();

            pokeball.sprite
                .render(pokeball.body.coordinates, lastPokeballCoordinates)
                .update();

            // endgame logic
            if (pikachuBody.collidesWith(pokeball.body)) {
                currentPikachuSprite = boomSprite;
                boomSprite
                    .render(pikachuBody.coordinates, lastPikachuCoordinates)
                    .update();
                counter += 1;
                if(counter > 25){
                    return;
                }
                // document.getElementById('game-over-song').play();
            }
        }

        for (i = 0; i < bullets.length; i += 1) {

            bullet = bullets[i];

            // if out of game field, remove bullet
            if (bullet.body.coordinates.y < -bullet.body.height) {
                bullets.splice(i, 1);
                i -= 1;
                continue;
            }


            lastbulletcoordinates = bullet.body.move();

            bullet.sprite
                .render(bullet.body.coordinates, lastbulletcoordinates)
                .update();

            for (j = 0; j < pokeballs.length; j += 1) {
                if (pokeballs.length > 0) {
                    pokeball = pokeballs[j];
                    if (bullet.body.collidesWith(pokeball.body)) {
                        pokeball.speedX = -1;
                        pokeballs.splice(j, 1);
                        bullets.splice(i, 1);
                    }
                }
            }
        }


        spawnPokeball();

        window.requestAnimationFrame(gameLoop);
    }

    gameLoop();
});