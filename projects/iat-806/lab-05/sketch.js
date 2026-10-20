// IAT 806 · Lab 05 starter: the Ball class from Week 5, ready for your website.
// Run with Live Server. Uses p5 2.x.

// an array to put all the balls in.
let balls = [];
// numBalls is written in camelCase.
// you could also write in camel_case
// this is the number of balls that you want to create.
// if your computer is struggling, lower this.
let numBalls = 5000;
// add: the color the balls turn near the mouse. a new random one every 10 seconds
let glowColor;
// add: the cat picture. every click leaves one on the canvas, under the balls
let catImg;
let catX = []; // x of every cat that was clicked down
let catY = []; // y of every cat that was clicked down
// no color variables, no position variables, they are all defined within the class.
async function setup() {
  const canvas = createCanvas(600, 600);

  // puts the canvas inside <div id="sketch-holder"> in index.html
  canvas.parent("sketch-holder");

  // add: load the cat picture
  catImg = await loadImage("cat.png");

  // we are creating a new instance of a Ball
  //   noStroke();
  // here with this four loop, we create numBalls of balls. and we put them in the array balls.
  for (let i = 0; i < numBalls; i++) {
    let ballX = random(0, 600);
    let ballY = 300;
    // add: each ball starts pink or yellow, picked at random
    let pink = color(255, 150, 200, 180);
    let yellow = color(255, 225, 80, 180);
    let ballC = random([pink, yellow]);
    let ballR = 10;
    let ball = new Ball(ballX, ballY, ballC, ballR);
    balls.push(ball);
    // balls.push(new Ball(ballX, ballY, ballC, ballR));
  }
}

function draw() {
  background(247); // add: the same off-white as around the cat

  // add: draw every cat that was clicked down
  // drawn before the balls, so the balls go over the cat
  imageMode(CENTER); // the click is the middle of the picture
  for (let i = 0; i < catX.length; i++) {
    image(catImg, catX[i], catY[i], 100, 100);
  }

  // add: every 600 frames (60 frames a second x 10 seconds), pick a new random glow color
  // frameCount starts at 1, so it also picks one on the first frame
  if (frameCount % 600 === 1) {
    glowColor = color(random(255), random(255), random(255));
  }

  // they are the same, written in different ways.
  //   for (let i=0; i<numBalls; i++) {
  //     balls[i].move();
  //     balls[i].show();
  //   }

  //   balls.forEach((ball) => {
  //     ball.move();
  //     ball.show();
  //   });
  // we iterate over the array, we move them, and we show them. for ALLLLL of the BALLS.
  for (let ball of balls) {
    // ball.move(random(0, 5));
    // // better to create a method for this.
    // ball.changeSize();
    // ball.show();
    ball.change(2);
  }
}

// add: every click remembers where it was, so a cat stays there
function mousePressed() {
  // only inside the canvas
  if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) {
    catX.push(mouseX);
    catY.push(mouseY);
  }
}

// this is how we define a class
// attributes
// methods
// this is a blueprint for creating stuff.
// We can create new balls using this.
class Ball {
  // this function is called when an instance of Ball is created.
  // x ix x position
  // y is y position
  // c is color
  // r is radius
  // this is the function that is called when you create a new ball or a new instance of this Class.
  constructor(x, y, c, r) {
    // it's like the instance saying, MY X is 400. In Python the keyword is self.x.
    this.x = x;
    this.y = y;
    this.color = c;
    // ALSO this is a diameter, not radius.
    // This is our mistake... we should have looked at the documentation.
    this.r = r;

    // add: remember the starting color, so the ball can go back to it
    // after it turns yellow near the mouse
    this.startColor = c;
  }

  change(byHowMuch) {
    this.changeSize(byHowMuch);
    this.move(byHowMuch);

    // add: call my two new methods, before show()
    // the ball runs away if the mouse is closer than 80 pixels, 3 pixels a frame
    this.runFromMouse(3);
    // the ball turns yellow if the mouse is closer than 100 pixels
    this.glowNearMouse(100);

    this.show();
  }

  // if this method is called, the ball would move. Every time it is called, it's x and y are changed a little bit.
  move(byHowMuch) {
    // this.x = this.x + random(-5,5)
    this.x += random(-byHowMuch, byHowMuch);
    this.y += random(-byHowMuch, byHowMuch);
  }

  changeSize(byHowMuch) {
    // we fix the size like this:
    // the constrain is saying that it shouldn't grow larger than a certain amount.
    this.r = constrain(this.r + random(-byHowMuch, byHowMuch), 2, 50);
  }

  // add: my first new method. the ball runs away from the mouse.
  // byHowMuch = how many pixels it jumps away each frame
  runFromMouse(byHowMuch) {
    let d = dist(this.x, this.y, mouseX, mouseY);
    // calculate the distance between ball and mouse x and y.
    if (d < 80 && d > 0) {
      // the direction from the mouse to the ball,
      // if the ball is on the right it will be positive, then move toward right.

      let dx = this.x - mouseX;
      let dy = this.y - mouseY;

      // push the ball that way, 3 pixels
      this.x += dx * byHowMuch;
      this.y += dy * byHowMuch;
    }
  }

  // add: my second new method. the ball turns the glow color near the mouse.
  // range = how close the mouse has to be, in pixels
  glowNearMouse(range) {
    let d = dist(this.x, this.y, mouseX, mouseY);
    if (d < range) {
      this.color = glowColor; // the color picked in draw()
    } else {
      this.color = this.startColor; // back to its own color
    }
  }

  // ????
  // What does ab all need to do?
  // Exist ...
  // You NEED TO SHOW THE BALL
  show() {
    // Here ...
    // Here show is not setting and attributing. It's setting the color of the ball to something.

    fill(this.color);
    circle(this.x, this.y, this.r);
  }
}
