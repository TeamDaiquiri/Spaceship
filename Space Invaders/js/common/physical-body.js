function createPhysicalBody(options) {

  'use strict';

  function move(delta) {
      var self = this,
      lastCoordinates = {x: self.x, y: self.y};

      self.x += (self.speed * delta.x);
      self.y += (self.speed * delta.y);

      return lastCoordinates;
  }

  function isBetweenBoundaries(value, min, max) {
    return (min <= value && value <= max);
  }

  function collisionWith(otherBody, offset = 0) {
    var self = this;
    var hasCollision =
      (isBetweenBoundaries(otherBody.x + offset, self.x, self.x + self.width) ||
      isBetweenBoundaries(otherBody.x + otherBody.width + offset, self.x, self.x + self.width)) &&
      (isBetweenBoundaries(otherBody.y + offset, self.y, self.y + self.height) ||
      isBetweenBoundaries(otherBody.y + otherBody.height + offset, self.y, self.y + self.height));

    return hasCollision;
  }

  var physicalBody = {
    x: options.x,
    y: options.y,
    speed: options.speed,
    width: options.width,
    height: options.height,
    move: move,
    collisionWith: collisionWith,
    health: 1500
  };

  return physicalBody;
}
