// Wait till the browser is ready to render the game (avoids glitches)
window.requestAnimationFrame(function () {
  window.gameManagers = [
    new GameManager(4, KeyboardInputManager, HTMLActuator, LocalScoreManager, "wasd"),
    new GameManager(4, KeyboardInputManager, HTMLActuator, LocalScoreManager, "vim"),
    new GameManager(4, KeyboardInputManager, HTMLActuator, LocalScoreManager, "arrows")
  ];
});
