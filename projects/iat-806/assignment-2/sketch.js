// bubbles inside the shape, and bubbles around it
let bubbles = [];
let bgBubbles = [];
let numAllBubbles = 1000;

// every bubble has this radius
let bubbleR = 4;

let bodySegmentation;
let segmentation;
let video;
let bombImg;

let options = {
  maskType: "person",
};

// bodyPose: finds my nose
let bodyPose;
let poses = []; // the people bodyPose found

let startImg;
let instructionImg;

// one level per picture: the painting, my own cut-out of the person in it,
// the time, the match % needed to win, and how many bombs drop
let levels = [
  {
    name: "van Gogh",
    file: "level1.png",
    maskFile: "level1Mask.png",
    time: 25,
    win: 88,
    bombs: 1,
  },
  {
    name: "Mona Lisa",
    file: "level2.png",
    maskFile: "level2Mask.png",
    time: 25,
    win: 92,
    bombs: 2,
  },
  {
    name: "Ali",
    file: "level3.png",
    maskFile: "level3Mask.png",
    time: 25,
    win: 90,
    bombs: 3,
  },
];
let level = 0;

// the painting's size
let targetW = 450;
let targetH = 600;

// the video is wider than the canvas, so it starts left of the canvas
let videoX;

// evil balls fall from the top;
let evilBalls = [];
let evilDropTime = 6000; // a bomb drops every 6 seconds
let bombsDropped = 0; // bomb counter
let evilGap = 80; // bombs only drop within 80px left or right of the middle
let bombPenalty = 5000; // a bomb that hits my nose takes 5 seconds off the timer
let noseR = 24;
let bombSound;
let bgMusic;

// game states
let gameState = "start";
let ready = false;

// the match is calculated from the bubbles
let match = 0;
let levelStart;
let won = false;

async function setup() {
  // Load the pictures first
  startImg = await loadImage("start.png");
  instructionImg = await loadImage("instruction.png");
  bombImg = await loadImage("bomb.png");
  // Load the level pictures and their masks
  for (let lv of levels) {
    lv.img = await loadImage(lv.file);
  }
  const canvas = createCanvas(targetW, targetH);

  canvas.parent("sketch-holder");

  bombSound = createAudio("bomb.mp3");
  bgMusic = createAudio("bg.mp3");
  bgMusic.volume(0.2); // background music is quiet

  // ask the webcam for a 4:3 picture
  // flipped the video
  video = createCapture(
    { audio: false, video: { aspectRatio: 4 / 3 } },
    { flipped: true },
  );
  video.size(800, 600); // 4:3 tall as the canvas
  video.hide();
  videoX = (width - video.width) / 2;

  // Wait until BodyPix is loaded. It only cuts me out of the webcam picture now
  bodySegmentation = await ml5.bodySegmentation("BodyPix", options);

  // Load each painting and my own cut-out of the person in it
  // (person = see-through, background = black, like BodyPix's mask)
  for (let lv of levels) {
    lv.img.resize(targetW, targetH);
    lv.mask = await loadImage(lv.maskFile);
    lv.mask.resize(targetW, targetH); // same size as the painting
    lv.mask.loadPixels(); // makeShape reads mask.pixels
    lv.shape = makeShape(lv.mask);
  }

  bodySegmentation.detectStart(video, gotResults);
  // cut out the person from the webacam picture.
  // the segmentation is used by the bubbles to see if they are on my body.

  // bodypose for nose, flipped
  bodyPose = await ml5.bodyPose("MoveNet", { flipped: true });
  bodyPose.detectStart(video, gotPoses);

  ready = true;
}

function draw() {
  if (gameState === "start") {
    drawStart();
  } else if (gameState === "rules") {
    drawRules();
  } else if (gameState === "playing") {
    drawPlaying();
  } else if (gameState === "levelClear") {
    drawLevelClear();
  } else if (gameState === "gameOver") {
    drawGameOver();
  }
}

// the start screen
function drawStart() {
  image(startImg, 0, 0, width, height);

  // dark band so the words are easy to read
  noStroke();
  fill(0, 180);
  rect(0, height - 130, width, 130);

  fill(255);
  textAlign(CENTER);
  textSize(30);
  text("Be the Painting", width / 2, height - 85);
  textSize(18);
  if (ready) {
    text("Press SPACE to start", width / 2, height - 50);
  } else {
    text("Loading...", width / 2, height - 40);
  }
  textAlign(LEFT);
}

// The page:how to play
function drawRules() {
  image(instructionImg, 0, 0, width, height);
  fill(40);
  noStroke();
  textAlign(CENTER);

  textSize(28);
  text("How to play", width / 2, 140);

  textSize(16);
  text("Match your body to the dark grey shape", width / 2, 195);
  text("Don't let the bombs hit your nose!", width / 2, 225);
  text("Reach the match % in 25 seconds:", width / 2, 255);

  text("Level 1: 88%", width / 2, 290);
  text("Level 2: 92%", width / 2, 318);
  text("Level 3: 90%", width / 2, 346);

  textSize(16);
  text("Press SPACE to play", width / 2, 460);
  textAlign(LEFT);
}

function drawPlaying() {
  background(220);
  let lv = levels[level];

  // my webcam picture, centered like the mask
  image(video, videoX, 0, video.width, video.height);

  // the shape to match, drawn behind the bubbles
  image(lv.shape, 0, 0);

  // check every bubble：color it, and count it for the score
  let good = 0; // bubbles inside the shape that I cover
  let bad = 0; // bubbles outside the shape that I cover

  // check outside bubble first
  for (let b of bgBubbles) {
    let onBody = segmentation && b.isOnBody(segmentation.mask, videoX);
    b.respond(onBody); // pink if on my body
    b.show();
    if (onBody) bad++;
  }

  // check inside bubble second
  for (let b of bubbles) {
    let onBody = segmentation && b.isOnBody(segmentation.mask, videoX); // on my body
    b.respond(onBody); // pink if on my body
    b.show();
    if (onBody) good++;
  }

  let nose = getNose();
  if (nose) {
    fill(random(200, 255), random(0, 100), random(0, 100));
    noStroke();
    circle(nose.x, nose.y, noseR * 2);
  }

  // drop the next bomb every 6 seconds
  if (
    bombsDropped < lv.bombs &&
    millis() - levelStart >= (bombsDropped + 1) * evilDropTime
  ) {
    // random x in the middle: up to 100px left or right of the center
    let x = random(width / 2 - evilGap, width / 2 + evilGap);
    evilBalls.push(new EvilBall(x, -20));
    bombsDropped++;
  }

  for (let i = evilBalls.length - 1; i >= 0; i--) {
    let e = evilBalls[i];
    e.update();

    // if touched my nose lose 5 seconds, and remove bomb
    if (e.hitsNose(nose, noseR)) {
      bombSound.time(0);
      bombSound.play();
      levelStart -= bombPenalty;
      evilBalls.splice(i, 1);
      continue;
    }

    // it fell off the screen： remove it
    if (e.isOffScreen()) {
      evilBalls.splice(i, 1);
    }
  }

  // how well my body matches the shape, from 0 to 100
  // going outside the shape (bad) counts 1.5 times as much
  let score = round((good / (bubbles.length + bad * 1.5)) * 100);
  match = lerp(match, score, 0.1);

  // seconds left in this level
  let timeLeft = max(0, lv.time - floor((millis() - levelStart) / 1000));

  noStroke();
  // black band behind the words
  fill(0, 150);
  rect(0, 0, width, 50);

  fill(255);
  textSize(24);
  textStyle(BOLD); // bold for match and time
  text("Match: " + round(match) + "% / " + lv.win + "%", 15, 35);
  textAlign(RIGHT);
  text("Time: " + timeLeft, width - 15, 35);
  textAlign(LEFT);
  textStyle(NORMAL);

  if (match >= lv.win) {
    // matched well enough: show the real painting
    if (level < levels.length - 1) {
      gameState = "levelClear";
    } else {
      won = true;
      bgMusic.stop(); // stop the music
      gameState = "gameOver";
    }
  } else if (timeLeft <= 0) {
    won = false;
    bgMusic.stop(); // times up: stop the music too
    gameState = "gameOver";
  }
}

// Show the painting
function drawLevelClear() {
  drawPainting(levels[level].img);

  fill(255);
  textAlign(CENTER);
  textSize(28);
  text("Level " + (level + 1) + " success 😊", width / 2, 45);
  textSize(16);
  let next = levels[level + 1];
  text("Next level: match " + next.win + "%", width / 2, 75);
  text("Press SPACE for the next painting", width / 2, height - 35);
  textAlign(LEFT);
}

// The end: every painting matched, or time ran out.
function drawGameOver() {
  if (won) {
    drawPainting(levels[level].img);
  } else {
    image(instructionImg, 0, 0, width, height);
  }

  textAlign(CENTER);
  textSize(30);
  if (won) {
    fill(255);
    text("You matched them all!", width / 2, 70);
  } else {
    fill(40);
    text("Time's up!", width / 2, height / 2 - 20);
  }
  textSize(16);
  text("Press SPACE to play again", width / 2, won ? height - 35 : 470);
  textAlign(LEFT);
}

// A painting with dark bands for the words.
function drawPainting(img) {
  background(220);
  image(img, 0, 0);
  noStroke();
  fill(0, 160);
  // a band at the top and one at the bottom
  rect(0, 0, width, 90);
  rect(0, height - 75, width, 75);
}

function keyPressed() {
  if (key !== " ") return;

  if (gameState === "start" && ready) {
    bgMusic.loop();
    gameState = "rules";
  } else if (gameState === "rules") {
    level = 0;
    startLevel();
  } else if (gameState === "levelClear") {
    level++;
    startLevel();
  } else if (gameState === "gameOver") {
    gameState = "start";
  }
}

// Start the timer and play the current level.
function startLevel() {
  // bubble random scatter in canvas and create bubble objects for the level
  bubbles = [];
  bgBubbles = [];
  let lv = levels[level];
  for (let i = 0; i < numAllBubbles; i++) {
    let x = random(width);
    let y = random(height);
    // the painting mask is the same size as the canvas, so can be checked directly
    if (isPersonPixel(lv.mask, x, y)) {
      bubbles.push(new Bubble(x, y, bubbleR)); // in the shape
    } else {
      bgBubbles.push(new Bubble(x, y, bubbleR)); // outside the shape
    }
  }

  // evil ball array
  evilBalls = [];

  levelStart = millis();
  bombsDropped = 0;
  match = 0;
  gameState = "playing";
}

// Turn a mask that body need to fit in into a dark grey
function makeShape(mask) {
  let shape = createImage(mask.width, mask.height);
  shape.loadPixels();
  for (let i = 0; i < mask.pixels.length; i += 4) {
    let isBody = mask.pixels[i + 3] < 128; // body is see-through in the mask
    if (isBody) {
      shape.pixels[i] = 40; // red
      shape.pixels[i + 1] = 40; // green
      shape.pixels[i + 2] = 40; // blue
      shape.pixels[i + 3] = 190; // transparency
    }
  }
  shape.updatePixels();
  return shape;
}

function gotResults(result) {
  segmentation = result;
}

function gotPoses(results) {
  poses = results;
}

// Where my nose is on the canvas
function getNose() {
  if (poses.length === 0) return null;
  let n = poses[0].nose; // same as poses[0].keypoints[0]
  if (!n || n.confidence < 0.1) return null;
  return { x: videoX + n.x, y: n.y };
}
