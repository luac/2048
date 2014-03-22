function KeyboardInputManager(parent) {
  this.parent = parent;
  if (parent.label) {
    this.keyStyle = parent.label;
  }
  else {
    this.keyStyle = "all";
  }

  this.events = {};

  if (window.navigator.msPointerEnabled) {
    //Internet Explorer 10 style
    this.eventTouchstart    = "MSPointerDown";
    this.eventTouchmove     = "MSPointerMove";
    this.eventTouchend      = "MSPointerUp";
  } else {
    this.eventTouchstart    = "touchstart";
    this.eventTouchmove     = "touchmove";
    this.eventTouchend      = "touchend";
  }

  this.listen();
}

KeyboardInputManager.prototype.on = function (event, callback) {
  if (!this.events[event]) {
    this.events[event] = [];
  }
  this.events[event].push(callback);
};

KeyboardInputManager.prototype.emit = function (event, data) {
  var callbacks = this.events[event];
  if (callbacks) {
    callbacks.forEach(function (callback) {
      callback(data);
    });
  }
};

KeyboardInputManager.prototype.listen = function () {
  var self = this;

  var map = {};
  var restart = {};
  if (this.keyStyle == "arrows" || this.keyStyle == "all") {
    map[38] = 0; // Up
    map[39] = 1; // Right
    map[40] = 2; // Down
    map[37] = 3; // Left
    restart[51] = true; // 3
  }
  if (this.keyStyle == "vim" || this.keyStyle == "all") {
    map[75] = 0; // vim keybindings
    map[76] = 1;
    map[74] = 2;
    map[72] = 3;
    restart[50] = true; // 2
  }
  if (this.keyStyle == "wasd" || this.keyStyle == "all") {
    map[87] = 0; // W
    map[68] = 1; // D
    map[83] = 2; // S
    map[65] = 3; // A
    restart[49] = true; // 1
  }
  if (true) {
    map[67] = 0; // C
    map[86] = 1; // V
    map[88] = 2; // X
    map[90] = 3; // Z
    restart[32] = true; // space
  }

  document.addEventListener("keydown", function (event) {
    var modifiers = event.altKey || event.ctrlKey || event.metaKey ||
                    event.shiftKey;
    var mapped    = map[event.which];

    if (!modifiers) {
      if (mapped !== undefined) {
        event.preventDefault();
        self.emit("move", mapped);
      }

      if (restart[event.which]) self.restart.bind(self)(event, 2048);
    }
    else if (event.shiftKey && !(event.altKey || event.ctrlKey || event.metaKey)) {
      if (restart[event.which]) self.restart.bind(self)(event, 2584);
    }
  });

  if (this.parent.label) {
    var selector = "." + this.parent.label;
  }
  else {
    var selector = "";
  }

  var retry = document.querySelector(".retry-button" + selector);
  retry.addEventListener("click", this.restart.bind(this));
  retry.addEventListener(this.eventTouchend, this.restart.bind(this));

  var keepPlaying = document.querySelector(".keep-playing-button" + selector);
  keepPlaying.addEventListener("click", this.keepPlaying.bind(this));
  keepPlaying.addEventListener("touchend", this.keepPlaying.bind(this));

  // Listen to swipe events
  var touchStartClientX, touchStartClientY;
  var gameContainer = document.getElementsByClassName("game-container")[0];

  gameContainer.addEventListener(this.eventTouchstart, function (event) {
    if (( !window.navigator.msPointerEnabled && event.touches.length > 1) || event.targetTouches > 1) return;
    
    if(window.navigator.msPointerEnabled){
        touchStartClientX = event.pageX;
        touchStartClientY = event.pageY;
    } else {
        touchStartClientX = event.touches[0].clientX;
        touchStartClientY = event.touches[0].clientY;
    }
    
    event.preventDefault();
  });

  gameContainer.addEventListener(this.eventTouchmove, function (event) {
    event.preventDefault();
  });

  gameContainer.addEventListener(this.eventTouchend, function (event) {
    if (( !window.navigator.msPointerEnabled && event.touches.length > 0) || event.targetTouches > 0) return;

    var touchEndClientX, touchEndClientY;
    if(window.navigator.msPointerEnabled){
        touchEndClientX = event.pageX;
        touchEndClientY = event.pageY;
    } else {
        touchEndClientX = event.changedTouches[0].clientX;
        touchEndClientY = event.changedTouches[0].clientY;
    }

    var dx = touchEndClientX - touchStartClientX;
    var absDx = Math.abs(dx);

    var dy = touchEndClientY - touchStartClientY;
    var absDy = Math.abs(dy);

    if (Math.max(absDx, absDy) > 10) {
      // (right : left) : (down : up)
      self.emit("move", absDx > absDy ? (dx > 0 ? 1 : 3) : (dy > 0 ? 2 : 0));
    }
  });
};

KeyboardInputManager.prototype.restart = function (event, mode) {
  event.preventDefault();
  this.emit("restart", mode);
};

KeyboardInputManager.prototype.keepPlaying = function (event) {
  event.preventDefault();
  this.emit("keepPlaying");
};
