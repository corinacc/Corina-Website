/* ===========================================================
   Starry night background for every page.
   Draws twinkling stars in random colors on a canvas behind the
   page. Stars near the mouse scatter away, then drift back home.
   Plain JavaScript (not p5), so it never clashes with a sketch.
   =========================================================== */

(function () {
  const STAR_DENSITY = 0.0001; // stars per square pixel of window
  const SCATTER_RADIUS = 140; // how close the mouse has to be
  const SCATTER_STRENGTH = 60; // how far stars get pushed, in pixels

  const canvas = document.createElement("canvas");
  canvas.id = "starfield";
  document.body.prepend(canvas);
  const ctx = canvas.getContext("2d");

  let stars = [];
  let mouse = { x: -9999, y: -9999 };

  function makeStars() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.round(innerWidth * innerHeight * STAR_DENSITY);
    stars = [];
    for (let i = 0; i < count; i++) {
      const x = Math.random() * innerWidth;
      const y = Math.random() * innerHeight;
      stars.push({
        homeX: x,
        homeY: y,
        x: x,
        y: y,
        size: 2 + Math.random() * 4, // length of each point
        hue: Math.random() * 360,
        twinkleSpeed: 0.001 + Math.random() * 0.003,
        twinkleOffset: Math.random() * Math.PI * 2,
      });
    }
  }

  // a sparkle shape: four long points (up, right, down, left)
  // joined by short inner corners in between
  function drawFourPointStar(x, y, outer) {
    const inner = outer * 0.25;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const r = i % 2 === 0 ? outer : inner;
      const angle = (i * Math.PI) / 4 - Math.PI / 2;
      const px = x + Math.cos(angle) * r;
      const py = y + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  }

  function draw(time) {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, innerWidth, innerHeight);

    for (const s of stars) {
      // push away from the mouse, harder the closer it is
      let targetX = s.homeX;
      let targetY = s.homeY;
      const dx = s.homeX - mouse.x;
      const dy = s.homeY - mouse.y;
      const d = Math.hypot(dx, dy);
      if (d < SCATTER_RADIUS && d > 0) {
        const push = (1 - d / SCATTER_RADIUS) * SCATTER_STRENGTH;
        targetX += (dx / d) * push;
        targetY += (dy / d) * push;
      }
      s.x += (targetX - s.x) * 0.1;
      s.y += (targetY - s.y) * 0.1;

      // twinkle: each star brightens and dims on its own rhythm
      const alpha =
        0.3 + 0.7 * (0.5 + 0.5 * Math.sin(time * s.twinkleSpeed + s.twinkleOffset));

      // soft glow, then the star itself
      ctx.fillStyle = `hsla(${s.hue}, 90%, 75%, ${alpha * 0.2})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size * 1.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `hsla(${s.hue}, 90%, 85%, ${alpha})`;
      drawFourPointStar(s.x, s.y, s.size);
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  document.addEventListener("mouseleave", () => {
    mouse.x = mouse.y = -9999;
  });
  window.addEventListener("resize", makeStars);

  makeStars();
  requestAnimationFrame(draw);
})();
