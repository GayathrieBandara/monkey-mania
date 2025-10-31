// ---------------- Monkey Mania Game ----------------
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreBoard = document.getElementById("scoreBoard");
const startBtn = document.getElementById("startBtn");
const playerNameInput = document.getElementById("playerName");

let monkey = { x: 220, y: 450, width: 50, height: 40 };
let bananas = [];
let score = 0;
let level = 1;
let playing = false;
let gamePaused = false;
let playerName = "";

// ---------------- Event-driven: keyboard movement ----------------
document.addEventListener("keydown", (e) => {
  if (!playing || gamePaused) return;
  if (e.key === "ArrowLeft" && monkey.x > 0) monkey.x -= 20;
  if (e.key === "ArrowRight" && monkey.x < canvas.width - monkey.width) monkey.x += 20;
});

// ---------------- Start game button ----------------
startBtn.addEventListener("click", () => {
  playerName = playerNameInput.value || "Player";
  score = 0;
  level = 1;
  bananas = [];
  playing = true;
  startBtn.disabled = true;
  gameLoop();
});

// ---------------- Simulated Banana API for gameplay ----------------
function getBananaType() {
  const types = ["Normal", "Golden", "Frozen", "Rotten"];
  return types[Math.floor(Math.random() * types.length)];
}

function getBananaEffect(type) {
  const effects = { Normal: 1, Golden: 2, Frozen: 1, Rotten: -1 };
  return effects[type];
}

function generateRandomBananas() {
  const type = getBananaType();
  return {
    type,
    color: { Normal: "yellow", Golden: "gold", Frozen: "lightblue", Rotten: "brown" }[type],
    x: Math.random() * (canvas.width - 25),
    y: 0,
    speed: type === "Frozen" ? 1.5 : 3,
  };
}

// ---------------- Main Game Loop ----------------
function gameLoop() {
  if (!playing) return;
  if (gamePaused) {
    requestAnimationFrame(gameLoop);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw monkey
  ctx.fillStyle = "orange";
  ctx.fillRect(monkey.x, monkey.y, monkey.width, monkey.height);

  // Add bananas randomly
  if (Math.random() < 0.03) bananas.push(generateRandomBananas());

  // Draw/move bananas
  bananas.forEach((b, i) => {
    ctx.fillStyle = b.color;
    ctx.beginPath();
    ctx.arc(b.x + 15, b.y + 15, 15, 0, Math.PI * 2);
    ctx.fill();
    b.y += b.speed;

    // Collision
    if (b.y + 30 > monkey.y && b.x > monkey.x - 25 && b.x < monkey.x + monkey.width) {
      score += getBananaEffect(b.type);
      bananas.splice(i, 1);
      updateScore();
    }

    if (b.y > canvas.height) bananas.splice(i, 1);
  });

  // Trigger quiz after every 5 points
  if (score > 0 && score % 5 === 0 && !gamePaused) {
    level++;
    loadBananaQuiz();
  }

  requestAnimationFrame(gameLoop);
}

// ---------------- Update Score ----------------
function updateScore() {
  scoreBoard.textContent = `Score: ${score}`;
}

// ---------------- Banana Quiz with fallback ----------------
async function loadBananaQuiz() {
  const fallbackQuiz = [
    { question: "What is 2 + 3?", solution: 5 },
    { question: "What is 7 - 4?", solution: 3 },
    { question: "How many bananas are in a bunch?", solution: 6 }
  ];

  try {
    const response = await fetch("https://marcconrad.com/uob/banana/api.php");
    const data = await response.json();
    showQuiz(data.question, data.solution || data.answer);
  } catch (error) {
    console.warn("Banana API not available, using fallback quiz.");
    const q = fallbackQuiz[Math.floor(Math.random() * fallbackQuiz.length)];
    showQuiz(q.question, q.solution);
  }
}

function showQuiz(question, solution) {
  gamePaused = true;

  const quizContainer = document.createElement("div");
  quizContainer.style.position = "absolute";
  quizContainer.style.top = "0";
  quizContainer.style.left = "0";
  quizContainer.style.width = "100%";
  quizContainer.style.height = "100%";
  quizContainer.style.backgroundColor = "rgba(0,0,0,0.8)";
  quizContainer.style.display = "flex";
  quizContainer.style.flexDirection = "column";
  quizContainer.style.justifyContent = "center";
  quizContainer.style.alignItems = "center";
  quizContainer.style.zIndex = "1000";
  quizContainer.style.color = "white";

  const title = document.createElement("h2");
  title.innerText = "🍌 Banana Quiz!";
  quizContainer.appendChild(title);

  if (question.startsWith("http")) {
    const img = document.createElement("img");
    img.src = question;
    img.style.maxWidth = "300px";
    img.style.margin = "20px";
    quizContainer.appendChild(img);
  } else {
    const textQ = document.createElement("p");
    textQ.innerText = question;
    quizContainer.appendChild(textQ);
  }

  const input = document.createElement("input");
  input.type = "number";
  input.placeholder = "Enter your answer...";
  input.style.padding = "10px";
  input.style.margin = "10px";
  quizContainer.appendChild(input);

  const btn = document.createElement("button");
  btn.innerText = "Submit Answer";
  btn.style.padding = "10px 20px";
  btn.style.cursor = "pointer";
  quizContainer.appendChild(btn);

  document.body.appendChild(quizContainer);

  btn.addEventListener("click", () => {
    const userAnswer = parseInt(input.value);
    if (userAnswer === solution) {
      alert("✅ Correct! Bonus +10 points!");
      score += 10;
    } else {
      alert(`❌ Wrong! The correct answer was ${solution}.`);
      score -= 5;
    }
    updateScore();
    quizContainer.remove();
    gamePaused = false;
  });
}

// ---------------- Virtual Identity (save player) ----------------
window.addEventListener("beforeunload", () => {
  localStorage.setItem("playerName", playerName);
  localStorage.setItem("score", score);
});

window.addEventListener("load", () => {
  const savedName = localStorage.getItem("playerName");
  const savedScore = localStorage.getItem("score");
  if (savedName) playerNameInput.value = savedName;
  if (savedScore) {
    score = parseInt(savedScore);
    updateScore();
  }
});
