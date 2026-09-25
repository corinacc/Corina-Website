// KardunTurtle — give the turtle instructions and watch it draw.
//
// Everything you need to change is in this file.

let turtle;
let turtle2;

async function setup() {
  const canvas = createCanvas(800, 600);
  canvas.parent("sketch-holder");

  // The turtle's face. Drop any image into this folder and point at it here —
  // it gets scaled and cropped into a circle, so anything roughly square works.
  const face = await loadImage("GreenSlim.png");

  turtle = new KardunTurtle(50, 420, face);

  // A second one
  turtle2 = new KardunTurtle(200, 270, face);

  giveInstructions();
}

// ---------------------------------------------------------------
// YOUR INSTRUCTIONS GO HERE
// ---------------------------------------------------------------

function giveInstructions() {
  turtle.penColor("#ff7a7a");
  turtle.penWidth(4);

  // Press a face onto the canvas, so we can see where we started.
  turtle.stamp();

  turtle.forward(150);
  turtle.right(90);
  turtle.forward(150);

  turtle.right(90);
  turtle.forward(150);
  turtle.right(90);
  turtle.forward(150);

  // Jump to a fresh point on the right and mark it.
  turtle.penUp();
  turtle.goTo(330, 420);
  turtle.penDown();
  turtle.stamp();

  // From this new point for 0
  turtle.setHeading(0);
  turtle.forward(150);
  turtle.setHeading(-90);
  turtle.forward(300);
  turtle.setHeading(180);
  turtle.forward(150);
  turtle.setHeading(90);
  turtle.forward(300);

  // The second turtle
  turtle2.penColor("#3cd6ff");
  turtle2.penWidth(4);
  turtle2.stamp();
  turtle2.forward(150);
  turtle2.left(90);
  turtle2.forward(150);
  turtle2.left(90);
  turtle2.forward(300);

  // Jump to a new point for 6
  turtle2.penUp();
  turtle2.goTo(620, 120);
  turtle2.penDown();
  turtle2.stamp();

  turtle2.setHeading(90);
  turtle2.forward(300);

  turtle2.setHeading(0);
  turtle2.forward(150);

  turtle2.setHeading(-90);
  turtle2.forward(150);

  turtle2.setHeading(180);
  turtle2.forward(150);
}

function draw() {
  background("#14161a");
  turtle.update();
  turtle2.update();
}

// Press R to start over.
function keyPressed() {
  if (key === "r" || key === "R") {
    turtle.reset();
    turtle2.reset();
    giveInstructions();
  }
}
