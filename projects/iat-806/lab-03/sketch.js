// IAT 806 · Lab 03 starter: the dancers from Week 3, ready for your website.
// Run with Live Server. Uses p5 2.x (async setup, await loadImage).

const FRAME_COUNT = 6;
const SOUND_COUNT = 3;
const MAX_DANCERS = 5;

const DANCER_W = 150;
const DANCER_H = 200;

// one array holds all six frame
let frames = [];
let sounds = [];

let soundIndex = 0; // which sound plays on the next click

let bgColor = 0; //  black background in the beginning

// parallel arrays, one entry per animated dancer
let xs = [0, 150, 300];
let speeds = [4, 8, 16]; // draw-frames per pose: smaller = faster
let paused = [false, false, false]; //  the arrary to check the first dancer is parused or not
let frameIndexes = [0, 0, 0]; // each dancer's current frame

let boosted = false; // true while the speed boost is on
let boostSpeed = 5; // the boosted speed

async function setup() {
  const canvas = createCanvas(800, 600);

  // puts the canvas inside <div id="sketch-holder"> in index.html
  canvas.parent("sketch-holder");

  textFont("monospace");
  textSize(14);

  // load all six poses with a loop and string concatenation
  for (let i = 0; i < FRAME_COUNT; i++) {
    frames.push(await loadImage("dance_frames/dance" + i + ".png"));
  }

  for (let i = 0; i < SOUND_COUNT; i++) {
    sounds.push(await loadSound("sound" + i + ".mp3"));
  }
}

function draw() {
  background(bgColor);

  // contact sheet: every pose, side by side
  for (let i = 0; i < frames.length; i++) {
    image(frames[i], i * 100, 20, 100, 125);
  }
  // click-controlled dancer
  // image(frames[index], 20, 140, 160, 200);
  // fill(0);
  // text("click: frames[" + index + "]", 20, 370);

  // one loop draws every dancer, each at its own x and speed
  for (let i = 0; i < xs.length; i++) {
    if (paused[i] === false) {
      // check if the dancer is paused; if not, update its frame index
      let speed;
      if (boosted) {
        speed = boostSpeed;
      } else {
        speed = speeds[i]; // the robot's speed, index matches the dancer's index
      }
      let slowFrame = floor(frameCount / speed);
      frameIndexes[i] = slowFrame % frames.length; // cycle through all 6 frames
    }

    image(frames[frameIndexes[i]], xs[i], 200, DANCER_W, DANCER_H);
    // draw the dancer based on its current frame index
  }

  // white label: the sound index the next click will play
  fill(255);
  text("click: sounds[" + soundIndex + "]", 20, 440);
}

// each click plays the next sound in order and change the background colour to a random color.
function mousePressed() {
  userStartAudio(); // browsers block sound until the user clicks; this switches it on
  sounds[soundIndex].play();
  soundIndex = (soundIndex + 1) % sounds.length;

  bgColor = color(random(255), random(255), random(255));
}

function keyPressed() {
  if (key === " ") {
    // stop or resume the whole animation
    if (isLooping()) {
      noLoop();
    } else {
      loop();
    }
  } else if (key === "s" || key === "S") {
    // boost the dance speed between normal and fast, for every dancer
    if (boosted) {
      boosted = false; // go back to normal speed
    } else {
      boosted = true; // was normal, go fast
      boostSpeed = random(3, 10); // pick the random fast speed
    }
  } else if (key === "n" || key === "N") {
    // add another dancer to the right
    if (xs.length < MAX_DANCERS) {
      xs.push(xs.length * DANCER_W);
      speeds.push(10); // the new dancer's speed
      paused.push(false); // the new dancer is not paused
      frameIndexes.push(0); // the new dancer starts at frame 0
    }
  } else if (key === "1") {
    // bonus: pause only the first robot
    if (paused[0]) {
      paused[0] = false;
    } else {
      paused[0] = true;
    }
  }
}
