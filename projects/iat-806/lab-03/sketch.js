let frames = [];
let myAge = 10;
let myName = "Robot";
let myStudentsAges = [];
let numFrames = 6;

let sounds = [];
let numSounds = 3;
let soundIndex = 0; // which sound plays on the next click

let bgColor = 0; //  black background in the beginning

let numDancers = 1; // how many dancers are on screen right now
let speeds = [10];
let boosted = false; // true while the speed boost is on
let boostSpeed = 5; // the boosted speed

let paused = [false]; //  the arrary to check the first dancer is parused or not
let frameIndexes = [0]; // each dancer's current frame, held while paused

let dancerW = 150;
let dancerH = 200;

async function setup() {
  const canvas = createCanvas(800, 600);
  canvas.parent("sketch-holder");

  for (let i = 0; i < numFrames; i++) {
    let fileName = "dance_frames/dance" + i + ".png";
    frames.push(await loadImage(fileName));
  }

  for (let i = 0; i < numSounds; i++) {
    sounds.push(await loadSound("sound" + i + ".mp3"));
  }

  console.log(frames);
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
    if (numDancers < 5) {
      speeds.push(10); // the new dancer's speed
      paused.push(false); // the new dancer is not paused
      frameIndexes.push(0); // the new dancer starts at frame 0
      numDancers++;
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

function draw() {
  background(bgColor);
  fill(140);

  for (let i = 0; i < frames.length; i++) {
    let xPosition = i * 100;
    image(frames[i], xPosition, 20, 100, 125);
  }

  for (let i = 0; i < numDancers; i++) {
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

    image(frames[frameIndexes[i]], i * dancerW, 200, dancerW, dancerH);
    // draw the dancer based on its current frame index and image width, at its x position
  }
}
