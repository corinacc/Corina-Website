class Bubble {
  // Store the bubble's position, size, and its two colors.
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;

    this.offColor = color(170, 200, 255, 180); // light blue off my body
    this.onColor = color(255, 140, 200, 230); // pink on my body
    this.fillColor = this.offColor;
  }

  // check if the bubble on the canvas is covered by my body
  // move it to the mask's size, then check if the pixel in the mask is part of my body or not
  // the mask is smaller ( 640x480) than the video on the canvas (800x600),
  isOnBody(mask, offsetX) {
    // add back the part of the video cut off on the left, then scale down to the mask's size
    let maskX = ((this.x - offsetX) * mask.width) / video.width;
    let maskY = (this.y * mask.height) / video.height;
    // read the mask from the right side
    let mirrorX = mask.width - 1 - maskX;
    return isPersonPixel(mask, mirrorX, maskY);
  }

  // Pink if on my body, grey if not.
  respond(onBody) {
    if (onBody) this.fillColor = this.onColor;
    else this.fillColor = this.offColor;
  }

  // Draw the bubble
  show() {
    stroke(255, 120);
    strokeWeight(1);
    fill(this.fillColor);
    circle(this.x, this.y, this.r * 2);
  }
}

// An evil bomb that falls from the top
class EvilBall {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 13;
    this.speed = 6; // pixels it falls each frame at the start
    this.gravity = 0.8; // how much faster it falls every frame
  }

  move() {
    this.speed += this.gravity; // increase speed every frame
    this.y += this.speed;
  }

  // Fall, then draw.
  update() {
    this.move();
    this.show();
  }

  // check the bomb hit my nose
  hitsNose(nose, noseR) {
    return nose && dist(this.x, this.y, nose.x, nose.y) < this.r + noseR;
  }

  isOffScreen() {
    return this.y - this.r > height;
  }

  show() {
    // move it left and up
    image(bombImg, this.x - 15, this.y - 30, 30, 45);
  }
}

// pixel lookup: work for masks(the painting and camera)
// check if the pixel in the mask is part of a person or not
// 1) check how mamy bubble inside painting's person mask.(good or bad)
// 2) check if the bubble is coverred by my camera body (from isonbody)
function isPersonPixel(mask, x, y) {
  // outside the mask is not a person
  if (x < 0 || y < 0 || x >= mask.width || y >= mask.height) {
    return false;
  }
  // get the pixel at (x, y) in the mask
  let px = mask.get(floor(x), floor(y)); // [r, g, b, a]
  // only read the alpha value [3] to see if it is part of a person or not
  return px[3] < 128;
  // if the alpha<128, that pixel is part of a person.
}
