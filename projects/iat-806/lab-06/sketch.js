let balls = [];

let numBalls = 1500;
let bodySegmentation;
let segmentation;
let video;

let options = {
  maskType: "person",
  // person shape
};

async function setup() {
  const canvas = createCanvas(600, 480);

  // puts the canvas inside <div id="sketch-holder"> in index.html
  canvas.parent("sketch-holder");

  video = createCapture(VIDEO);
  video.size(600, 480);
  video.hide();

  // make the balls first, so they show up while the model is still loading
  for (let i = 0; i < numBalls; i++) {
    let ball = createRandomBall();
    // call in Ball.js
    balls.push(ball);
    // make it
  }

  // Wait until the BodySegmentation model is fully loaded.
  bodySegmentation = await ml5.bodySegmentation("BodyPix", options);
  bodySegmentation.detectStart(video, gotResults);
}

function draw() {
  background(120);

  //image(video, 0, 0);
  if (segmentation) {
    // image(segmentation.mask, 0, 0, width, height);
    // read the mask's pixels once per frame, so every ball can check them
    segmentation.mask.loadPixels();
  }
  for (let ball of balls) {
    // no mask yet while the model is still loading, so onBody stays false-ish
    let onBody = segmentation && ball.isOnBody(segmentation.mask);

    // active if the ball was clicked OR is on the body, so both work together
    let active = ball.clicked || onBody;

    ball.respond(active);

    // active balls shake and grow harder
    ball.update(active ? 4 : 1);
  }
}

function mousePressed() {
  balls.forEach((ball) => {
    // remember the click, so draw() doesn't undo it on the next frame
    ball.clicked = ball.contains(mouseX, mouseY);
    ball.respond(ball.clicked);

    // if (ball.contains(mouseX, mouseY)) {
    //   // ball.color = "red";
    //   ball.highlight();
    // } else {
    //   ball.deHighlight();
    // }
  });
}

function gotResults(result) {
  segmentation = result;
}
