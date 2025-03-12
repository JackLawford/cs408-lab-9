console.log("Running tests...");

function assert(condition, message) {
  if (!condition) {
    console.error("Test failed: " + message);
  } else {
    console.log("Test passed: " + message);
  }
}

// Test Ball Movement and Wall Collision
function testBallWallCollision() {
  let ball = new Ball(10, 10, 5, 5, "red", 10);
  ball.update();
  assert(ball.x !== 10 || ball.y !== 10, "Ball should move after update");

  ball.x = width - ball.size;
  ball.velX = 5;
  ball.update();
  assert(ball.velX < 0, "Ball should bounce off the right wall");

  ball.x = ball.size;
  ball.velX = -5;
  ball.update();
  assert(ball.velX > 0, "Ball should bounce off the left wall");
}

// Test EvilCircle Movement
function testEvilCircleMovement() {
  let evil = new EvilCircle(50, 50);
  
  window.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
  assert(evil.x < 50, "EvilCircle should move left when 'a' is pressed");

  window.dispatchEvent(new KeyboardEvent("keydown", { key: "d" }));
  assert(evil.x = 50, "EvilCircle should move right when 'd' is pressed");
}

// Test Ball Removal on EvilCircle Collision
function testEvilCircleCollision() {
  let ball = new Ball(100, 100, 2, 2, "red", 10);
  let evil = new EvilCircle(100, 100);
  balls = [ball];
  ballCount = 1;

  evil.collisionDetect();

  assert(!ball.exists, "Ball should be removed when EvilCircle collides");
  assert(ballCount === 0, "Ball count should decrease after collision");
}

// Test Endless Mode Toggle
function testEndlessModeToggle() {
  let button = endlessButton;
  button.click();
  assert(endlessMode === true, "Endless mode should be enabled after button click");
  button.click();
  assert(endlessMode === false, "Endless mode should be disabled after button click");
}

// Run Tests
function runTests() {
  testBallWallCollision();
  testEvilCircleMovement();
  testEvilCircleCollision();
  testEndlessModeToggle();
}

document.getElementById("runTests").addEventListener("click", () => {
    console.log("Running tests...");
    runTests();
});