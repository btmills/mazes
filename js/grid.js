"use strict";
var __moduleName = "grid";
var Grid = function($el) {
  var SIZE = 20;
  var WEIGHT = 2;
  var ctx = $el.getContext('2d');
  function pixelHeight(val) {
    if (arguments.length > 0) {
      ctx.canvas.height = val;
    }
    return ctx.canvas.height;
  }
  function pixelWidth(val) {
    if (arguments.length > 0) {
      ctx.canvas.width = val;
    }
    return ctx.canvas.width;
  }
  function gridHeight(squares) {
    if (arguments.length > 0) {
      pixelHeight(squares * SIZE + (squares + 1) * WEIGHT);
    }
    return (pixelHeight() - WEIGHT) / (SIZE + WEIGHT);
  }
  function gridWidth(squares) {
    if (arguments.length > 0) {
      pixelWidth(squares * SIZE + (squares + 1) * WEIGHT);
    }
    return (pixelWidth() - WEIGHT) / (SIZE + WEIGHT);
  }
  function toPixels(sq) {
    return (WEIGHT / 2) + sq * (WEIGHT + SIZE);
  }
  function mod(a, b) {
    return ((a % b) + b) % b;
  }
  function toSquares(px) {
    if (mod(px - WEIGHT, SIZE + WEIGHT) >= (SIZE - WEIGHT)) {
      return null;
    }
    return Math.floor((px - WEIGHT) / (SIZE + WEIGHT));
  }
  function clear() {
    ctx.clearRect(0, 0, pixelWidth(), pixelHeight());
  }
  function fill(x, y, color) {
    var _fillStyle = ctx.fillStyle;
    ctx.fillStyle = color;
    ctx.fillRect(toPixels(x) + (WEIGHT / 2), toPixels(y) + (WEIGHT / 2), SIZE, SIZE);
    ctx.fillStyle = _fillStyle;
  }
  function bridge(x1, y1, x2, y2, color) {
    if (Math.abs(x2 - x1) + Math.abs(y2 - y1) !== 1) {
      throw new Error('Squares are not adjacent.');
    }
    var x = Math.max(x1, x2),
        y = Math.max(y1, y2);
    var _lineCap = ctx.lineCap;
    var _lineWidth = ctx.lineWidth;
    var _strokeStyle = ctx.strokeStyle;
    ctx.lineCap = 'square';
    ctx.lineWidth = WEIGHT;
    ctx.strokeStyle = color;
    ctx.beginPath();
    if (x1 === x2) {
      ctx.moveTo(toPixels(x1) + WEIGHT, toPixels(y));
      ctx.lineTo(toPixels(x1 + 1) - WEIGHT, toPixels(y));
    } else {
      ctx.moveTo(toPixels(x), toPixels(y1) + WEIGHT);
      ctx.lineTo(toPixels(x), toPixels(y1 + 1) - WEIGHT);
    }
    ctx.stroke();
    ctx.lineCap = _lineCap;
    ctx.lineWidth = _lineWidth;
    ctx.strokeStyle = _strokeStyle;
  }
  function line(x1, y1, x2, y2) {
    var _lineCap = ctx.lineCap;
    var _lineWidth = ctx.lineWidth;
    var _strokeStyle = ctx.strokeStyle;
    ctx.lineCap = 'round';
    ctx.lineWidth = WEIGHT;
    ctx.strokeStyle = '#16191d';
    ctx.beginPath();
    ctx.moveTo(toPixels(x1), toPixels(y1));
    ctx.lineTo(toPixels(x2), toPixels(y2));
    ctx.stroke();
    ctx.lineCap = _lineCap;
    ctx.lineWidth = _lineWidth;
    ctx.strokeStyle = _strokeStyle;
  }
  return {
    height: gridHeight,
    width: gridWidth,
    pixelHeight: pixelHeight,
    pixelWidth: pixelWidth,
    clear: clear,
    fill: fill,
    bridge: bridge,
    line: line,
    toPixels: toPixels,
    toSquares: toSquares
  };
};
