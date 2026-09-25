function setup() {
  const canvas = createCanvas(800, 600);
  canvas.parent("sketch-holder");
}

function draw() {
  drawBackground();
  drawPerson();
  drawTable();
  drawPlateAndFood();
  drawWineGlass();
  // drawBottle() isn't defined anywhere in this sketch, so it's left out here.
}

function drawBackground() {
  background(40, 60, 58);
  fill(176, 141, 87);
  triangle(800, 0, 800, 600, 450, 380);
}

function drawTable() {
  stroke(20);
  strokeWeight(4);
  fill(120, 74, 45);
  triangle(-100, 600, 800, 600, 200, 400);
  fill(150, 96, 58);
  triangle(810, 600, 210, 400, 700, 420);
}

function drawPerson() {
  push();
  translate(200, 260);
  stroke(20);
  strokeWeight(2);

  fill(58, 84, 130);
  rect(-70, 40, 140, 150, 10);

  fill(222, 178, 130);
  circle(0, -20, 140);

  fill(20);
  circle(-30, -30, 18);
  circle(40, -20, 22);

  fill(200, 150, 110);
  triangle(-8, -12, 6, -15, 4, 10);

  fill(178, 46, 46);
  circle(0, 30, 30);

  pop();
}

function drawPlateAndFood() {
  push();
  translate(340, 470);

  stroke(20);
  strokeWeight(3);
  fill(235, 222, 190);
  ellipse(0, 0, 220, 90);
  noFill();
  ellipse(0, 0, 160, 62);

  noStroke();
  fill(150, 100, 70);
  triangle(-70, 0, 30, -18, 30, 18);
  fill(110, 66, 40);
  triangle(30, -18, 30, 18, 65, 0);
  stroke(20);
  strokeWeight(2);

  stroke(20);
  strokeWeight(3);
  fill(178, 46, 46);
  circle(120, -10, 46);
  fill(216, 140, 40);
  circle(150, 12, 36);
  noStroke();
  fill(60, 130, 70);
  triangle(110, -30, 118, -60, 124, -34);

  pop();
}

function drawWineGlass() {
  push();
  translate(600, 380);

  stroke(20);
  strokeWeight(3);
  fill(120, 30, 70, 210);
  triangle(-26, -60, 26, -60, 0, 10);

  noFill();
  line(-26, -60, 0, 10);
  line(26, -60, 0, 10);

  line(0, 10, 0, 60);
  fill(235, 222, 190);
  ellipse(0, 66, 46, 12);

  pop();
}
