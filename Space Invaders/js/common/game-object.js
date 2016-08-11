function createGameObject(options) {

  'use strict';

  function render(drawCoordinates, clearCoordinates, offset) {
    var self = this;

    self.context.clearRect(
      clearCoordinates.x - offset,
      clearCoordinates.y - offset,
      self.width/self.colsCount + offset*2,
      self.height/self.rowsCount + offset*2
    );

    self.context.drawImage(
      self.spritesheet, // image to draw
      self.colIndex*self.width/self.colsCount, // source x
      self.rowIndex*self.height/self.rowsCount, // source y
      self.width/self.colsCount, // source width
      self.height/self.rowsCount, // source height
      drawCoordinates.x, // destination x
      drawCoordinates.y, // destination y
      self.width/self.colsCount, // destination width
      self.height/self.rowsCount // destination y
    );

    return self;
  }

  function update(isVerticalSprite) {
    var self = this;

    // update frame
    self.loopTicksCount += 1;
    if (self.loopTicksCount > self.loopTicksPerFrame) {
      if (!isVerticalSprite) {
        self.colIndex += 1;
        self.colIndex = self.colIndex % self.colsCount;
      } else {
        self.rowIndex += 1;
        self.rowIndex = self.rowIndex % self.rowsCount;
      }

      self.loopTicksCount = 0;
    }

    return self;
  }

  function restart () {
        var self = this;

        self.colIndex = 0;
        self.rowIndex = 0;

        return self;
    }

  var gameObject = {
    spritesheet: options.spritesheet,
    context: options.context,
    width: options.width, // all width
    height: options.height, // all height
    colsCount: options.colsCount,
    rowsCount: options.rowsCount,
    colIndex: options.colIndex,
    rowIndex: options.rowIndex,
    loopTicksCount: options.loopTicksCount,
    loopTicksPerFrame: options.loopTicksPerFrame,
    render: render,
    update: update,
    restart: restart
  };

  return gameObject;
}
