// IAT 806 · Lab 04 starter: the dancer grid from Week 4, ready for your website.
// Run with Live Server. Uses p5 2.x (async setup, await loadImage).

let frames = []; // the 8 dance poses
let frames2 = []; // the 4 jump poses
let numFrames = 8;
// add: how many jump poses there are
let numFrames2 = 4;
// bonus: the 6 bread poses, a third dance
let breadFrames = [];
let numBreadFrames = 6;

let numCols = 20;
let numRows = 10;
let colWidth;
let rowHeight;

// 2D arrays: one color and one speed for every cell in the grid
let colors = [];
let speeds = [];

async function setup() {
  const canvas = createCanvas(800, 420);

  // puts the canvas inside <div id="sketch-holder"> in index.html
  canvas.parent("sketch-holder");

  // bonus: image(x, y) now means the CENTER of the picture, not the top-left corner
  // so when a dancer gets bigger, it grows out from the middle of its cell
  imageMode(CENTER);

  for (let i = 0; i < numCols; i++) {
    colors[i] = [];
    speeds[i] = [];
    for (let j = 0; j < numRows; j++) {
      colors[i][j] = [random(1, 255), random(1, 255), random(1, 255)];
      speeds[i][j] = random(1, 10);
    }
  }

  rowHeight = height / numRows;

  for (let i = 0; i < numFrames; i++) {
    let fileName = "dance_frames/dance" + i + ".png";
    frames.push(await loadImage(fileName));
  }

  // add: load the 4 jump poses into frames2, the same way as the dance poses
  for (let i = 0; i < numFrames2; i++) {
    let fileName = "jump_frames/jump" + i + ".png";
    frames2.push(await loadImage(fileName));
  }

  // bonus: load the 6 bread poses into breadFrames
  for (let i = 0; i < numBreadFrames; i++) {
    let fileName = "bread_frames/bread" + i + ".png";
    breadFrames.push(await loadImage(fileName));
  }
}

function draw() {
  background(120);
  if (mouseX < width) {
    numCols = Math.floor(map(mouseX, 0, width, 2, 20));
    // dist the mouse position and the position of the dancing profs
    // in the grid, and then use that number to map to the speed.
    colWidth = width / numCols;
  }

  // add: the biggest distance possible is from one corner to the other corner
  let maxDist = dist(0, 0, width, height);

  for (let i = 0; i < numCols; i++) {
    for (let j = 0; j < numRows; j++) {
      fill(colors[i][j][0], colors[i][j][1], colors[i][j][2], 120);
      rect(i * colWidth, j * rowHeight, colWidth, rowHeight);

      // add: find the middle of this cell, where the dancer is
      let x = i * colWidth + colWidth / 2;
      let y = j * rowHeight + rowHeight / 2;

      // add: how far this dancer is from the mouse
      let d = dist(x, y, mouseX, mouseY);

      // add: turn the distance into a number from 0.5 to 3
      // close to the mouse = 0.5 (small number = fast)
      // far from the mouse = 3 (big number = slow)
      let distanceScale = map(d, 0, maxDist, 0.5, 3);

      // add: keep each dancer's own random speed, and change it with the distance
      // so the dancers don't all move together
      let speed = speeds[i][j] * distanceScale;

      // add: checkerboard pattern
      // if (i + j) is even, this cell does the dance
      // if (i + j) is odd, this cell does the jump
      // bonus: if the dancer is close to the mouse (less than 150 away), it turns into the bread
      // everyone farther away keeps the checkerboard
      let danceFrames;
      if (d < 150) {
        danceFrames = breadFrames;
      } else if ((i + j) % 2 === 0) {
        danceFrames = frames;
      } else {
        danceFrames = frames2;
      }

      // bonus: turn the distance into a size
      // close to the mouse = 1.5 (one and a half times as tall as the row)
      // far from the mouse = 0.5 (half as tall as the row)
      let sizeScale = map(d, 0, maxDist, 1.5, 0.5);
      // bonus: the bread has its own size, because it only shows up within 150 of the mouse
      // right on the mouse = 1.6
      // at the edge, 150 away = 1
      if (danceFrames === breadFrames) {
        sizeScale = map(d, 0, 150, 1.6, 0.6);
      }

      let dancerHeight = rowHeight * sizeScale;

      // add: use the new speed and the chosen dance instead of frames and speeds[i][j]
      // bonus: draw at the middle of the cell (x, y), and only give the height
      // the width is null (no width), so animate() works it out to keep the right shape
      // bonus: turn the distance into how see-through the dancer is
      // close to the mouse = 255 (not see-through at all)
      // far from the mouse = 128 (half see-through)
      let dancerAlpha = map(d, 0, maxDist, 255, 10);
      tint(255, dancerAlpha);

      animate(danceFrames, speed, x, y, null, dancerHeight);

      // bonus: turn tint off again, so it only changes this one dancer
      noTint();
    }
  }
}

// draws one dancer: which poses, how fast, where, and how big
function animate(frames, speed, xPosition, yPosition, imageWidth, imageHeight) {
  // add: also pass in the frames, so getFrameIndex knows if it has 8 or 4 poses
  let index = getFrameIndex(frames, speed);
  let currentFrame = frames[index];
  let origWidth = currentFrame.width;
  let origHeight = currentFrame.height;
  if (imageWidth && !imageHeight) {
    let scale = imageWidth / origWidth;
    imageHeight = scale * origHeight;
  }

  // bonus: the TODO. if only the height is given, work out the width
  // with the same scale, so the dancer doesn't get squished or stretched
  if (imageHeight && !imageWidth) {
    let scale = imageHeight / origHeight;
    imageWidth = scale * origWidth;
  }

  image(currentFrame, xPosition, yPosition, imageWidth, imageHeight);
}

// which pose to show right now. speed = draw-frames per pose: smaller = faster
// add: frames is now a parameter, so it uses the dance that was passed in
// (before, it always used the global frames with 8 poses, and the jump with 4 poses froze)
function getFrameIndex(frames, speed) {
  let slowFrame = Math.floor(frameCount / speed);
  let index = slowFrame % frames.length;

  return index;
}
