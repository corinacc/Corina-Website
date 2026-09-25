/* Twinkling, glowing starfield. Stars near the cursor drift together
   toward it, then ease back to their original spot once the mouse
   moves away. Draws on a full-page canvas placed behind everything. */

(function () {
  const canvas = document.createElement("canvas");
  canvas.id = "stars-canvas";
  Object.assign(canvas.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100vw",
    height: "100vh",
    zIndex: "-1",
    pointerEvents: "none",
    display: "block",
  });
  document.body.prepend(canvas);
  const ctx = canvas.getContext("2d");

  const INFLUENCE_RADIUS = 160; // how close the mouse needs to be to pull a star in
  const ATTRACT_STRENGTH = 0.55;
  const RETURN_STRENGTH = 0.02;
  const DAMPING = 0.9;

  let stars = [];

  function makeStars() {
    const count = Math.round((window.innerWidth * window.innerHeight) / 12000);
    stars = Array.from({ length: count }, () => {
      const homeX = Math.random() * window.innerWidth;
      const homeY = Math.random() * window.innerHeight;
      return {
        homeX,
        homeY,
        x: homeX,
        y: homeY,
        vx: 0,
        vy: 0,
        r: Math.random() * 1.8 + 0.6,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.03 + 0.01,
      };
    });
  }

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    makeStars();
  }
  window.addEventListener("resize", resize);
  resize();

  const mouse = { x: -9999, y: -9999 };
  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener("mouseleave", () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  let t = 0;
  function tick() {
    t += 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const s of stars) {
      const dx = mouse.x - s.x;
      const dy = mouse.y - s.y;
      const dist = Math.hypot(dx, dy);

      if (dist < INFLUENCE_RADIUS && dist > 0.01) {
        const pull = (1 - dist / INFLUENCE_RADIUS) * ATTRACT_STRENGTH;
        s.vx += (dx / dist) * pull;
        s.vy += (dy / dist) * pull;
      } else {
        s.vx += (s.homeX - s.x) * RETURN_STRENGTH;
        s.vy += (s.homeY - s.y) * RETURN_STRENGTH;
      }
      s.vx *= DAMPING;
      s.vy *= DAMPING;
      s.x += s.vx;
      s.y += s.vy;

      const twinkle = 0.5 + 0.5 * Math.sin(t * s.speed + s.phase);
      const alpha = 0.15 + twinkle * 0.6;
      ctx.shadowColor = `rgba(255, 240, 150, ${alpha})`;
      ctx.shadowBlur = 6 + twinkle * 16;
      ctx.fillStyle = `rgba(255, 240, 150, ${alpha})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r + twinkle * 1.4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    requestAnimationFrame(tick);
  }
  tick();
})();
