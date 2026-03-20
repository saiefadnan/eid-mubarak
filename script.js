// Confetti animation
const confettiBtn = document.getElementById("confettiBtn");
const confettiCanvas = document.getElementById("confetti");
let ctx = null;
if (confettiCanvas)
  ctx = confettiCanvas.getContext && confettiCanvas.getContext("2d");
let confettiParticles = [];

function resizeCanvas() {
  if (!confettiCanvas) return;
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function randomColor() {
  const colors = [
    "#e65100",
    "#ad1457",
    "#43a047",
    "#f9d423",
    "#ff4e50",
    "#d81b60",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function createConfetti() {
  confettiParticles = [];
  for (let i = 0; i < 120; i++) {
    confettiParticles.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * -confettiCanvas.height,
      r: Math.random() * 8 + 4,
      d: Math.random() * 2 + 1,
      color: randomColor(),
      tilt: Math.random() * 10 - 5,
    });
  }
}

function drawConfetti() {
  if (!ctx) return;
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettiParticles.forEach((p) => {
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, p.r, p.r / 2, p.tilt, 0, 2 * Math.PI);
    ctx.fillStyle = p.color;
    ctx.fill();
  });
}

function updateConfetti() {
  confettiParticles.forEach((p) => {
    p.y += p.d * 3;
    p.x += Math.sin(p.y / 30) * 2;
    p.tilt += Math.random() * 0.2 - 0.1;
    if (p.y > confettiCanvas.height) {
      p.y = Math.random() * -20;
      p.x = Math.random() * confettiCanvas.width;
    }
  });
}

let confettiActive = false;
function animateConfetti() {
  if (!confettiActive) return;
  drawConfetti();
  updateConfetti();
  requestAnimationFrame(animateConfetti);
}

if (confettiBtn) {
  confettiBtn.addEventListener("click", () => {
    if (!confettiCanvas) return;
    confettiCanvas.style.display = "block";
    createConfetti();
    confettiActive = true;
    animateConfetti();
    setTimeout(() => {
      confettiActive = false;
      confettiCanvas.style.display = "none";
    }, 3500);
  });
}

// Visitor counter using CountAPI (no backend)
// Namespace and key can be changed; this uses a public key per site.
const visitorSpan = document.getElementById("visitorCount");
const countKey = "eid-mubarak-saiefadnan";
const countNamespace = "visitor-counter";

function updateVisitorCount() {
  if (!visitorSpan) return;
  const localKey = "eid-mubarak-visited";
  if (!localStorage.getItem(localKey)) {
    // First visit in this browser: increment and get
    fetch(`https://api.countapi.xyz/hit/${countNamespace}/${countKey}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.value !== undefined) {
          visitorSpan.textContent = data.value;
          localStorage.setItem(localKey, "1");
        }
      })
      .catch(() => {
        visitorSpan.textContent = "0";
      });
  } else {
    // Already visited: just get the count
    fetch(`https://api.countapi.xyz/get/${countNamespace}/${countKey}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.value !== undefined) {
          visitorSpan.textContent = data.value;
        }
      })
      .catch(() => {
        visitorSpan.textContent = "0";
      });
  }
}

updateVisitorCount();
