"use strict";

function handleMouseMove(evt) {
    Game.mousePosition = { x : evt.pageX, y : evt.pageY };
}

var Game = {
    canvas : undefined,
    canvasContext : undefined,
    bgSprite: undefined,
    asteroidSprite : undefined,
    shipSprite: undefined,
    asteroidPosition : { x : 0, y : 50 },
    asteroidOrigin : { x : 0, y : 0 },
    mousePosition : { x : 0, y : 0 },
    shipPosition : { x : 500, y : 500 },
    shipOrigin : { x : 34, y : 34 },
    shipRotation : 0,
    backgroundMusic : undefined
};
var firstCanvas = document.getElementsById("gameCanvas");
Game.start = function () {
    Game.canvas = document.getElementById("gameCanvas");
    Game.canvasContext = Game.canvas.getContext("2d");

    document.onmousemove = handleMouseMove;

    Game.bgSprite = new Image();
    Game.bgSprite.src = "./imgs/stars.jpg";
    Game.asteroidSprite = new Image();
    Game.asteroidSprite.src = "./imgs/asteroid.png";
    Game.shipSprite = new Image();
<<<<<<< HEAD
    Game.shipSprite.src = "./imgs/ship1.png";
    Game.backgroundMusic = new Audio();
    Game.backgroundMusic.src = "snd_music.mp3";
    Game.backgroundMusic.volume = 0.4;
    Game.backgroundMusic.play();
=======
    Game.shipSprite.src = "ship1.png";
>>>>>>> b9a911539a04c2b638d305457e73781700395254
    window.setTimeout(Game.mainLoop, 500);
};

document.addEventListener( 'DOMContentLoaded', Game.start);


//clearCanvas - shoud take parameters - context and coordinates
Game.clearCanvas = function () {
    Game.canvasContext.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
};

Game.drawImage = function (sprite, position, rotation, origin) {
    Game.canvasContext.save();
    Game.canvasContext.translate(position.x, position.y);
    Game.canvasContext.rotate(rotation);
    Game.canvasContext.drawImage(sprite, 0, 0, sprite.width, sprite.height,
        -origin.x, -origin.y, sprite.width, sprite.height);
    Game.canvasContext.restore();
};

Game.mainLoop = function() {
    Game.update();
    Game.draw();
    window.setTimeout(Game.mainLoop, 1000 / 60);
};

Game.update = function () {
  var d = new Date();
  Game.asteroidOrigin = { x : -d.getTime() * 0.3 % Game.canvas.width, y : 0 };

  var opposite = Game.mousePosition.y - Game.shipPosition.y;
  var adjacent = Game.mousePosition.x - Game.shipPosition.x;
  Game.shipRotation = Math.atan2(opposite, adjacent);
};

 //var bulletImg = document.getElementById('asteroid-img');
function createBullet(offsetY) {
       // var bulletSprite = createSprite({
       //     spritesheet: bulletImg,
       //     context: firstCanvas,
       //     width: bulletImg.width / 18,
       //     height: bulletImg.height,
       //     numberOfFrames: 1,
       //     loopTicksPerFrame: 5
       // });

        var bulletBody = createPhysicalBody({
           x:10,
           y: 10,
            speed: 1,
            width: bulletImg.width,
            height: bulletImg.height
        });

        return {
        //    sprite: bulletSprite,
            body: bulletBody
        };
}

Game.draw = function () {
  Game.clearCanvas();
  Game.drawImage(Game.bgSprite, { x : 0, y : 0 }, 0, { x : 0, y : 0 });
  Game.drawImage(Game.asteroidSprite, Game.asteroidPosition, 0, Game.asteroidOrigin);

  Game.drawImage(Game.shipSprite, Game.shipPosition, Game.shipRotation, Game.shipOrigin);
};
