let circleX = 50;
let circleY = 50;
let speedX = 5;
let speedY = 5;
let size = 100;
let sizeIncrement = 1;
let minSize = 40;
let maxSize = 160;
let radius = size / 2;
let rightColor = "blue";
let leftColor = "red";
let ballColor;
let clickColor = null;
let isPaused = false;

function setup() {
  const canvas = createCanvas(800, 600);
  canvas.parent("sketch-holder");
}

function draw() {
  background(20);

  // left half is one color, right half is the other —
  // unless a click has set a random color to override it
  if (clickColor) {
    ballColor = clickColor;
  } else if (circleX > width / 2) {
    ballColor = rightColor;
  } else {
    ballColor = leftColor;
  }
  fill(ballColor);

  if (!isPaused) {
    // move
    circleX = circleX + speedX;
    circleY = circleY + speedY;

    // grow or shrink, but never past minSize/maxSize
    size = constrain(size + sizeIncrement, minSize, maxSize);
    radius = size / 2;

    // bounce off the left and right walls, and flip growing/shrinking —
    // snap to the exact edge so it can't get trapped oscillating past the boundary
    if (circleX >= width - radius) {
      circleX = width - radius;
      speedX = speedX * -1;
      sizeIncrement = sizeIncrement * -1;
    } else if (circleX < radius) {
      circleX = radius;
      speedX = speedX * -1;
      sizeIncrement = sizeIncrement * -1;
    }

    // bounce off the top and bottom walls, same fix
    if (circleY >= height - radius) {
      circleY = height - radius;
      speedY = speedY * -1;
    } else if (circleY < radius) {
      circleY = radius;
      speedY = speedY * -1;
    }
  }

  circle(circleX, circleY, size);
}

function mousePressed() {
  // set a new random direction and speed between value -8 to 8.
  speedX = random(-8, 8);
  speedY = random(-8, 8);

  // and give it a random color
  clickColor = color(random(255), random(255), random(255));
}

function keyPressed() {
  // press r to send the ball back to the center of the canvas
  if (key === "r") {
    circleX = width / 2;
    circleY = height / 2;
  }

  // press space to stop and press again to resume
  if (key === " ") {
    isPaused = !isPaused;
  }
}
