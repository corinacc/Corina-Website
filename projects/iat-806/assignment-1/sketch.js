// Riddle of the Sphinx
// Click the start screen to begin.
// Click the letters H, U, M, A, N to solve the riddle (any order is fine).
// Press R to start again.

let letters = []; // which letter each box shows
let lit = []; // true if the box has been clicked on
let litColors = []; // the color each box turns when it's clicked on
let posX = []; // where each box is drawn right now (x)
let posY = []; // where each box is drawn right now (y)
let solved = false; // true once H, U, M, A, N are all lit and nothing else is
let bgImg; // the background image
let startImg; // the start screen picture
let started = false; // becomes true after the start screen is clicked

// 30 letters are arranged in a grid
let numCols = 10; // 10 boxes in each row
let numRows = 3; // 3 rows
let GRID_START_X = 113; // x of the first column
let colWidth = 75; // horizontal gap between columns
let GRID_START_Y = 300; // y of the first row
let rowHeight = 62; // vertical gap between rows, close together

// H U M A N slide down when clicked
let ANSWER = "HUMAN";
let slotX = [310, 380, 450, 520, 590]; // answer letters slide to these
let slotY = 515; // y of the answer row

let song; // the riddle sound: plays when the start screen is clicked
let bgMusic; // background music, loops forever
let winSound; // plays once when the riddle is solved
let keySound; // plays when the letter A is clicked

async function setup() {
  let canvas = createCanvas(900, 600);
  canvas.parent("sketch-holder"); // put the canvas inside the page

  rectMode(CENTER); // treats x, y as the center, not a corner
  textAlign(CENTER, CENTER); // text(str, x, y) centers the text on x, y
  bgImg = await loadImage("background.jpg");
  startImg = await loadImage("start.png");

  //font loading
  await document.fonts.load("20px Cinzel");
  await document.fonts.load("20px 'Cinzel Decorative'");
  textFont("Cinzel"); // every text uses Cinzel
  makeBoxes(); // build the first round of letter boxes

  song = new Audio("music.mp3");

  bgMusic = new Audio("background.mp3");
  bgMusic.loop = true; // keep repeating
  bgMusic.volume = 0.2; // lower the volume

  winSound = new Audio("congratulation.mp3");
  keySound = new Audio("h.mp3");
}

function draw() {
  // before the game starts, only show the start screen
  if (started === false) {
    // start screen in canvas width and height, so it fills the canvas
    image(startImg, 0, 0, width, height);
  } else {
    // after the start screen is clicked, draw the game
    image(bgImg, 0, 0, width, height);

    // riddle text sits inside the background image's upper blank panel
    noStroke();
    fill(0);
    textFont("Cinzel Decorative"); // a fancier font for the title
    textSize(30);
    text("Riddle of the Sphinx", width / 2, 90); // centered
    textFont("Cinzel"); // back to normal Cinzel for the rest

    stroke(0); // black line
    strokeWeight(3); // more thickness
    line(300, 115, 600, 115); // a line under the title
    noStroke();

    textSize(18);

    if (solved) {
      // only show this text after the riddle is solved
      text(
        "Congratulations, wise human! I will drink you dry of your blood.",
        width / 2,
        160,
      );
      textSize(22);
      text("Press R to play again.", width / 2, 210);
    } else {
      fill(20);

      // the riddle's question, two lines, only shown before it's solved
      text(
        "What goes on four legs in the morning, two legs in the afternoon,\nand three legs in the evening? ",
        width / 2,
        180,
      );
    }

    // go through every column i and every row j to make the boxes slide and draw them
    for (let i = 0; i < numCols; i++) {
      for (let j = 0; j < numRows; j++) {
        //check if the box is lit and if it's one of the answer letters, then move it to the answer row
        moveBox(i, j); // slide the box to answer row

        // before it's solved, draw every box
        // after it's solved, only draw the HUMAN in the answer row
        if (solved === false) {
          drawBox(i, j);
        } else if (lit[i][j] && ANSWER.includes(letters[i][j])) {
          // only draw the HUMAN letters in the answer row
          drawBox(i, j);
        }
      }
    }
  }
}

// make 30 boxes, 10 columns and 3 rows
function makeBoxes() {
  solved = false;

  // 30 letters split into a list of letters, so we can shuffle them
  let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZOXRS".split("");
  let shuffled = shuffle(alphabet);

  let n = 0; // sets counts boxes 0 to 29 [0, 1, 2, ..., 29] is 30 boxes.
  // 10 columns, 3 rows, so 30 boxes in total
  for (let i = 0; i < numCols; i++) {
    // for each column, make a list of letters and a list of lit states and a list of lit colors
    letters[i] = []; // an empty list for column i
    lit[i] = []; // an empty list for column i
    litColors[i] = []; // an empty list for column i
    posX[i] = []; // an empty list for column i
    posY[i] = [];
    for (let j = 0; j < numRows; j++) {
      letters[i][j] = shuffled[n]; // pick the letter from the shuffled list
      lit[i][j] = false; // not clicked at the start, so not lit
      litColors[i][j] = null; // random color until clicked, so no color at the start
      // every box starts at its own spot in the grid
      posX[i][j] = GRID_START_X + i * colWidth;
      posY[i][j] = GRID_START_Y + j * rowHeight;
      n++;
    }
  }
}

// slide the box in column i, row j toward bottom row
function moveBox(i, j) {
  // box starts in the grid, so its target is its spot in the grid
  let targetX = GRID_START_X + i * colWidth;
  let targetY = GRID_START_Y + j * rowHeight;

  // but if it's a lit letter of HUMAN, it goes to its spot in the answer row
  if (lit[i][j] && ANSWER.includes(letters[i][j])) {
    let slot = ANSWER.indexOf(letters[i][j]); // H is 0, U is 1, M is 2, A is 3, N is 4
    targetX = slotX[slot]; // take this letter's x from the list
    targetY = slotY;
  }

  // move the box toward answer row, lerp() makes it slide smoothly instead of jumping
  posX[i][j] = lerp(posX[i][j], targetX, 0.1);
  // move 10% of the way there every frame so it slows down as it gets closer to the target
  posY[i][j] = lerp(posY[i][j], targetY, 0.1);
}

// draw the box in column i, row j
function drawBox(i, j) {
  // draw it where it is right now
  let x = posX[i][j];
  let y = posY[i][j];

  noStroke(); // no outline on the box

  // brown until clicked, then the color picked in mousePressed()
  if (lit[i][j]) {
    fill(litColors[i][j][0], litColors[i][j][1], litColors[i][j][2]);
  } else {
    fill("saddlebrown");
  }

  // the row decides the shape: row 0 squares, row 1 circles, row 2 triangles
  let letterY = y;
  if (j === 0) {
    //j is the the row, so the first row is squares
    rect(x, y, 50, 50, 8); // 50x50 box, 8px rounded corners
  } else if (j === 1) {
    // draw a circle in the second row
    circle(x, y, 54); // 54 wide circle
  } else {
    // triangle pointing up, about 56 wide and 54 tall
    triangle(x, y - 30, x - 28, y + 24, x + 28, y + 24);
    letterY = y + 6; // nudge the letter down into the wide part
  }

  fill(0); // black letter
  textSize(24);
  text(letters[i][j], x, letterY); // draw the letter centered on the shape
}

function mousePressed() {
  // clicking the start screen starts the game and the music
  // checking mouseX and mouseY to make sure the click is inside the canvas
  let onCanvas = mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height;
  if (started === false) {
    // the game hasn't started yet
    if (onCanvas) {
      // the first click on the start screen starts the game
      started = true;
      song.play(); // the riddle sound
      bgMusic.play(); // the quiet background music
    }
    return; // on the start screen, DONT check the boxes, just start the game and music
  }

  if (solved) {
    return; // dont check the mouspressed() for boxes if the riddle is already solved
  }

  // check every box, column i and row j
  for (let i = 0; i < numCols; i++) {
    for (let j = 0; j < numRows; j++) {
      // where the box is right now, so a letter in the answer row can be clicked too
      let x = posX[i][j];
      let y = posY[i][j];

      // box is 50x50, so 25px each way from center,check if the mouse is inside that box
      //x and y is already put in the posX and posY in drawbox()
      if (abs(mouseX - x) < 25 && abs(mouseY - y) < 25) {
        // clicking A, the 4th letter of HUMAN, plays h.mp3
        if (letters[i][j] === "A") {
          keySound.play(); // play the sound of the letter A
        }
        lit[i][j] = !lit[i][j]; // on becomes off, off becomes on
        if (lit[i][j]) {
          // H, U, M, A, N turn yellow
          // every other letter gets a fresh random color
          if (ANSWER.includes(letters[i][j])) {
            litColors[i][j] = [255, 215, 0]; // yellow
          } else {
            litColors[i][j] = [random(255), random(255), random(255)];
          }
        }
        checkAnswer(); // see if that click just solved the riddle
      }
    }
  }
}

function checkAnswer() {
  let litCount = 0; // how many of the letters H, U, M, A, N are lit
  let wrongCount = 0; // how many other letters are lit
  for (let i = 0; i < numCols; i++) {
    for (let j = 0; j < numRows; j++) {
      if (lit[i][j]) {
        if (ANSWER.includes(letters[i][j])) {
          litCount = litCount + 1;
          // if the letter is in HUMAN, count it
        } else {
          wrongCount = wrongCount + 1;
        }
      }
    }
  }

  // all 5 are lit and no wrong letters are lit: the riddle is solved
  if (litCount === 5 && wrongCount === 0) {
    solved = true;
    winSound.play(); // play the congratulation sound
  }
}

function keyPressed() {
  if (key === "r" || key === "R") {
    makeBoxes(); // make a new set of boxes
  }
}
