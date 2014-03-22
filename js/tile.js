function Tile(position, value, type) {
  this.x                = position.x;
  this.y                = position.y;
  this.value            = value || 2;
  this.type             = type || 2048;

  this.previousPosition = null;
  this.mergedFrom       = null; // Tracks tiles that merged together
}

Tile.prototype.canMerge = function (other) {
  if (this.type === 2048) {
    return this.value === other.value;
  }
  else if (this.type === 2584) {
    if (this.value === 1 && other.value === 1) return true;
    if (this.value === other.value) return false;
    if (this.value > 2 * other.value) return false;
    if (other.value > 2 * this.value) return false;
    return true;
  }
};

Tile.prototype.getClass = function () {
  if (this.type === 2048) {
    return "tile-" + this.value;
  }
  else if (this.type === 2584) {
    return "tile-fib-" + this.value;
  }
};

Tile.prototype.savePosition = function () {
  this.previousPosition = { x: this.x, y: this.y };
};

Tile.prototype.updatePosition = function (position) {
  this.x = position.x;
  this.y = position.y;
};
