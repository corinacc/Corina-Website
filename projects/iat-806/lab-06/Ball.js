class Ball {
  // Store the ball's position, color, size, and its two colors.
  constructor(x, y, c, r) {
    this.x = x;
    this.y = y;
    this.r = r;

    // Step 2: the color it shows now, its normal color, and the color it turns when active.
    this.fillColor = c;
    this.origColor = c;
    this.highlightColor = color(255, 220, 100, 200);
    this.strokeColor = color(255, 255, 255, 40);

    // Bonus: save if this ball was clicked, so click and body both work.
    this.clicked = false;
  }

  // Shake the ball by up to byHowMuch in each direction.
  move(byHowMuch) {
    this.x += random(-byHowMuch, byHowMuch);
    this.y += random(-byHowMuch, byHowMuch);
  }

  // Let the size change a little, but keep it between 2 and 30.
  changeSize(byHowMuch) {
    this.r = constrain(this.r + random(-byHowMuch, byHowMuch), 2, 8);
  }

  // Draw the ball.
  show() {
    fill(this.fillColor);
    stroke(this.strokeColor);
    circle(this.x, this.y, this.r * 2);
  }

  // Do one frame: move, change size, then draw.
  update(byHowMuch) {
    this.move(byHowMuch);
    this.changeSize(byHowMuch);
    this.show();
  }

  // Switch to the highlight color.
  highlight() {
    this.fillColor = this.highlightColor;
  }

  // Go back to the original color.
  deHighlight() {
    this.fillColor = this.origColor;
  }

  // Highlight colour if active, otherwise go back to normal.
  respond(active) {
    if (active) this.highlight();
    else this.deHighlight();
  }

  // Return true if the point (px, py) is inside the ball.
  contains(px, py) {
    if (dist(this.x, this.y, px, py) < this.r) {
      return true;
    } else {
      return false;
    }
  }

  isOnBody(mask) {
    if (
      this.x < 0 ||
      this.y < 0 ||
      this.x >= mask.width ||
      this.y >= mask.height
    ) {
      return false;
    }
    let px = mask.get(floor(this.x), floor(this.y)); // [r, g, b, a]
    // With maskType "person", the body is transparent (alpha 0), so low alpha = body.
    return px[3] < 128;
  }
}

// A  ball become flashes random colors and shakes extra when it is active.
// extend from main class Ball
class FlickerBall extends Ball {
  constructor(x, y, c, r) {
    super(x, y, c, r);
    // start pink
    this.origColor = color(200, 10, 120, 200);
    this.fillColor = this.origColor;
  }

  respond(active) {
    super.respond(active);
    if (active) {
      this.fillColor = color(random(255), random(255), random(255), 220);
      this.move(6);
    }
  }
}

// Make one ball at a random spot with a random purple color.
function createRandomBall() {
  let ballX = random(0, width);
  let ballY = random(0, height);
  // random position
  let ballC = color(140, 0, 140 + random(-100, 100), 50);
  // random colour and transparency 50%: light purple random.
  let ballR = 5;
  // ball radius intial

  // 5% flickerball
  if (random() < 0.95) {
    return new Ball(ballX, ballY, ballC, ballR);
  } else {
    return new FlickerBall(ballX, ballY, ballC, ballR);
  }
}
