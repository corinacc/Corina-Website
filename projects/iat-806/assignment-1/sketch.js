// Riddle of the Sphinx
// Click the letters H, U, M, A, N to solve the riddle (any order is fine).
// Press R to start again.

let boxes = []; // array of 10 letter boxes, one row
let solved = false; // true once H, U, M, A, N are all lit
let bgImg; // the manuscript background image

// the letters are arranged in a single row
let GRID_COLS = 10; // 10 boxes
let GRID_START_X = 113; // x of the first column
let GRID_SPACING_X = 75; // horizontal gap between columns
let GRID_Y = 300; // every box sits at this y

let song; // background music

async function setup() {
  let canvas = createCanvas(900, 600);
  canvas.parent("sketch-holder"); // put the canvas inside the page
  rectMode(CENTER); // treats x, y as the center, not a corner
  textAlign(CENTER, CENTER); // text(str, x, y) centers the text on x, y
  bgImg = await loadImage("background.jpg");
  makeBoxes(); // build the first round of letter boxes

  song = new Audio("music.mp3");
  song.loop = false; // play once, don't repeat
  song.play(); // the browser blocks this until the first real click on the page
}

function draw() {
  image(bgImg, 0, 0, width, height); // repaint the background every frame

  // riddle text sits inside the background image's upper blank panel
  noStroke();
  fill(0);
  textSize(26);
  text("Riddle of the Sphinx", width / 2, 90); // centered

  stroke(0);
  line(300, 115, 600, 115); // a line under the title
  noStroke();

  fill("brown");
  circle(680, 200, 30); // a dot at the start of the line

  textSize(22);
  if (solved) {
    // the question's spot now shows the answer instead
    text("Congratulation Human, you are survive!", width / 2, 160);
  } else {
    fill(20);

    // the riddle's question, two lines, only shown before it's solved
    text(
      "What goes on four legs in the morning, two legs in the afternoon,\nand three legs in the evening? \nPress the circle to hear the riddle",
      width / 2,
      180,
    );

    // the letter boxes only show up before it's solved
    for (let b of boxes) {
      drawBox(b);
    }
  }

  if (solved) {
    fill(0);
    textSize(20);
    text("Press R to play again.", width / 2, 200);
  }
}

// make 10 boxes, one row
function makeBoxes() {
  boxes = []; // clear out any boxes from a previous round
  solved = false;

  // 10 letters each used once,
  let alphabet = "HUMANDORXC".split("");
  let letters = shuffle(alphabet);

  for (let i = 0; i < GRID_COLS; i++) {
    boxes.push({
      letter: letters[i],
      x: GRID_START_X + i * GRID_SPACING_X, // box's x position on the canvas
      y: GRID_Y, // every box sits on the same row
      litColor: null, // picked fresh, at random, the moment it's clicked
      lit: false, // not clicked yet
    });
  }
}

// my own function: draw one box
function drawBox(b) {
  noStroke(); // no outline on the box

  // same colour until clicked, then a random color
  if (b.lit) {
    fill(b.litColor[0], b.litColor[1], b.litColor[2]);
  } else {
    fill("saddlebrown");
  }
  rect(b.x, b.y, 50, 50, 8); // 50x50 box, 8px rounded corners

  fill(0); // black letter
  textSize(24);
  text(b.letter, b.x, b.y); // draw the letter centered on the box
}

function mousePressed() {
  // click the brown circle (at 680, 200, radius 15) to play the sound
  if (dist(mouseX, mouseY, 680, 200) < 15) {
    song.play();
  }

  if (solved) {
    return; // ignore clicks once the riddle is already solved
  }
  for (let b of boxes) {
    // is the mouse inside this box? (box is 50x50, so 25px each way from center)
    if (abs(mouseX - b.x) < 25 && abs(mouseY - b.y) < 25) {
      b.lit = !b.lit; // on becomes off, off becomes on
      if (b.lit) {
        // just turned on: give it a fresh random color
        b.litColor = [random(255), random(255), random(255)];
      }
      checkAnswer(); // see if that click just solved the riddle
    }
  }
}

// my own function: are H, U, M, A, N all lit right now? (order doesn't matter)
function checkAnswer() {
  // "HUMAN".split("") -> ["H","U","M","A","N"]
  // .every(...) is true only if EVERY letter in that list passes the test
  if (
    "HUMAN"
      .split("")
      .every((letter) => boxes.find((b) => b.letter === letter).lit)
  ) {
    solved = true;
  }
}

function keyPressed() {
  if (key === "r" || key === "R") {
    makeBoxes(); // make a new set of boxes
  }
}
