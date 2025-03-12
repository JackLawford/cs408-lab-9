// set up canvas
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

// function to generate random number
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function to generate random RGB color value
function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

// Base Shape class
class Shape {
  constructor(x, y, velX, velY) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
  }
}

// Ball class extending Shape
class Ball extends Shape {
  constructor(x, y, velX, velY, color, size) {
    super(x, y, velX, velY);
    this.color = color;
    this.size = size;
    this.exists = true;
  }

  draw() {
    if (!this.exists) return;
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  update() {
    if (!this.exists) return;
    if (this.x + this.size >= width || this.x - this.size <= 0) {
      this.velX = -this.velX;
    }
    if (this.y + this.size >= height || this.y - this.size <= 0) {
      this.velY = -this.velY;
    }
    this.x += this.velX;
    this.y += this.velY;
  }

  collisionDetect() {
    if (!this.exists) return;
    for (const ball of balls) {
      if (ball.exists && this !== ball) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < this.size + ball.size) {
          ball.color = this.color = randomRGB();
        }
      }
    }
  }
}

// EvilCircle class
class EvilCircle extends Shape {
  constructor(x, y) {
    super(x, y, 20, 20);
    this.color = "white";
    this.size = 10;

    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "a":
          this.x -= this.velX;
          break;
        case "d":
          this.x += this.velX;
          break;
        case "w":
          this.y -= this.velY;
          break;
        case "s":
          this.y += this.velY;
          break;
      }
    });
  }

  draw() {
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
  }

  checkBounds() {
    if (this.x + this.size > width) this.x = width - this.size;
    if (this.x - this.size < 0) this.x = this.size;
    if (this.y + this.size > height) this.y = height - this.size;
    if (this.y - this.size < 0) this.y = this.size;
  }

  collisionDetect() {
    for (const ball of balls) {
      if (ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < this.size + ball.size) {
          ball.exists = false;
          ballCount--;
          if(endlessMode){
            score++;
          }
          updateBallCount();
        }
      }
    }
  }
}

// Ball counter display
const ballCountPara = document.createElement("p");
document.body.appendChild(ballCountPara);
ballCountPara.style.position = "absolute";
ballCountPara.style.margin = "0";
ballCountPara.style.top = "35px";
ballCountPara.style.right = "5px";
ballCountPara.style.color = "#aaa";

//Endless mode score display
const endlessScore = document.createElement("p");
document.body.appendChild(endlessScore);
endlessScore.style.position = "absolute";
endlessScore.style.top = "45px";
endlessScore.style.left = "5px";
endlessScore.style.color = "#aaa";
endlessScore.style.margin = "0";

// Endless mode button
const endlessButton = document.createElement("button");
document.body.appendChild(endlessButton);
endlessButton.textContent = "Enable Endless Mode";
endlessButton.addEventListener("click", () => {
endlessMode = !endlessMode;
endlessButton.textContent = endlessMode ? "Disable Endless Mode" : "Enable Endless Mode";
endlessButton.style.backgroundColor = endlessMode ? "#78ff8e" : "White";
endlessButton.style.top = "5px";
});

let balls = [];
let ballCount = 25;
let score = 0;
let endlessMode = false;

function updateBallCount() {
  ballCountPara.textContent = `Ball count: ${ballCount}`;
  endlessScore.textContent = endlessMode ? `Score: ${score}` : "";
}

while (balls.length < 25) {
  const size = random(10, 20);
  const ball = new Ball(
    random(size, width - size),
    random(size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomRGB(),
    size
  );
  balls.push(ball);
}
updateBallCount();

const evilCircle = new EvilCircle(random(10, width - 10), random(10, height - 10));

function loop() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, width, height);

  for (const ball of balls) {
    if (ball.exists) {
      ball.draw();
      ball.update();
      ball.collisionDetect();
    }
  }
  
  evilCircle.draw();
  evilCircle.checkBounds();
  evilCircle.collisionDetect();

  // Spawn new balls in endless mode
  if (endlessMode) {
    while (ballCount < 25) {
      const size = random(10, 20);
      const ball = new Ball(
        random(size, width - size),
        random(size, height - size),
        random(-7, 7),
        random(-7, 7),
        randomRGB(),
        size
      );
      balls.push(ball);
      ballCount++;
      updateBallCount();
    }
  }

  requestAnimationFrame(loop);
}

loop();