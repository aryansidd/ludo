const COLORS = ["red", "blue", "green", "yellow"];
const COLOR_NAMES = { red: "Red", blue: "Blue", green: "Green", yellow: "Yellow" };
const COLOR_HEX = { red: "#ed4b58", blue: "#4285f4", green: "#20a875", yellow: "#f5b82e" };
const state = { turn: 0, dice: null, tokens: {}, testMode: false, selectedWinner: "red", gameOver: false };

const trackEl = document.getElementById("track");
const tokenLayer = document.getElementById("tokenLayer");
const boardEl = document.getElementById("board");
const rollBtn = document.getElementById("rollDice");
const messageEl = document.getElementById("gameMessage");

function buildTrack() {
  trackEl.innerHTML = "";
  for (let i = 0; i < 15; i++) {
    const cell = document.createElement("div");
    cell.className = "track-cell";
    if ([1, 5, 9, 13].includes(i)) cell.classList.add("safe");
    if (i === 2) cell.classList.add("home-red");
    if (i === 6) cell.classList.add("home-green");
    if (i === 10) cell.classList.add("home-blue");
    if (i === 14) cell.classList.add("home-yellow");
    cell.textContent = [1,5,9,13].includes(i) ? "✦" : "";
    trackEl.appendChild(cell);
  }
  // A visible grid around the center to evoke a classic board.
  trackEl.style.background = "transparent";
}
function resetGame() {
  state.turn = 0; state.dice = null; state.gameOver = false;
  state.tokens = {};
  COLORS.forEach(c => state.tokens[c] = [{pos:-1},{pos:-1},{pos:-1},{pos:-1}]);
  document.getElementById("winnerToast").classList.add("hidden");
  document.getElementById("diceFace").textContent = "⚄";
  messageEl.textContent = "Roll a 6 to bring a token out, then click an active token to move it.";
  rollBtn.disabled = false;
  render();
}
function positionFor(color, token) {
  if (token.pos < 0) {
    const homes = {
      red: [[12,12],[28,12],[12,28],[28,28]],
      green: [[72,12],[88,12],[72,28],[88,28]],
      blue: [[12,72],[28,72],[12,88],[28,88]],
      yellow: [[72,72],[88,72],[72,88],[88,88]]
    };
    return homes[color][token.index];
  }
  // A simplified visual loop for this starter. The full 52-cell route can be implemented next.
  const angle = ((token.pos % 52) / 52) * Math.PI * 2 - Math.PI / 2;
  const radius = 30;
  return [50 + Math.cos(angle) * radius, 50 + Math.sin(angle) * radius];
}
function render() {
  tokenLayer.innerHTML = "";
  COLORS.forEach(color => state.tokens[color].forEach((token, index) => {
    token.index = index;
    const [x,y] = positionFor(color, token);
    const el = document.createElement("button");
    el.className = `token ${color} ${token.pos < 0 ? "in-home" : ""}`;
    el.style.left = `${x}%`; el.style.top = `${y}%`;
    el.textContent = index + 1;
    el.title = `${COLOR_NAMES[color]} token ${index + 1}`;
    el.setAttribute("aria-label", `${COLOR_NAMES[color]} token ${index + 1}`);
    el.addEventListener("click", () => moveToken(color, index));
    tokenLayer.appendChild(el);
  }));
  const color = COLORS[state.turn];
  document.getElementById("turnLabel").textContent = state.gameOver ? "Match complete" : `${COLOR_NAMES[color]}'s turn`;
  document.getElementById("turnDot").style.background = COLOR_HEX[color];
  document.getElementById("playerList").innerHTML = COLORS.map((c, i) => {
    const active = i === state.turn && !state.gameOver;
    const onBoard = state.tokens[c].filter(t => t.pos >= 0).length;
    return `<div class="player-row"><div class="player-color ${c}">${c[0].toUpperCase()}</div><div class="player-meta"><strong>${COLOR_NAMES[c]} Player</strong><small>${onBoard}/4 tokens active</small></div><span class="player-state ${active ? "active" : ""}">${active ? "YOUR TURN" : "READY"}</span></div>`;
  }).join("");
}
function rollDice() {
  if (state.gameOver) return;
  if (state.dice !== null) { messageEl.textContent = "Choose one of your tokens to move."; return; }
  state.dice = Math.floor(Math.random() * 6) + 1;
  document.getElementById("diceFace").textContent = ["","⚀","⚁","⚂","⚃","⚄","⚅"][state.dice];
  const color = COLORS[state.turn];
  const movable = state.tokens[color].some(t => t.pos >= 0 || state.dice === 6);
  if (!movable) {
    messageEl.textContent = `${COLOR_NAMES[color]} rolled ${state.dice}. No token can move — turn passed.`;
    const rolled = state.dice; state.dice = null;
    setTimeout(() => { if (!state.gameOver) { if (rolled !== 6) state.turn = (state.turn + 1) % 4; render(); } }, 650);
  } else {
    messageEl.textContent = `${COLOR_NAMES[color]} rolled ${state.dice}. Click one of your tokens to move it.`;
  }
}
function moveToken(color, index) {
  if (state.gameOver) return;
  if (color !== COLORS[state.turn]) { messageEl.textContent = `It's ${COLOR_NAMES[COLORS[state.turn]]}'s turn.`; return; }
  if (state.dice === null) { messageEl.textContent = "Roll the dice first."; return; }
  const token = state.tokens[color][index];
  if (token.pos < 0 && state.dice !== 6) { messageEl.textContent = "You need a 6 to bring this token out."; return; }
  if (token.pos < 0) token.pos = 0;
  else token.pos = (token.pos + state.dice) % 52;
  const rolled = state.dice; state.dice = null;
  document.getElementById("diceFace").textContent = "⚄";
  if (rolled !== 6) state.turn = (state.turn + 1) % 4;
  messageEl.textContent = rolled === 6 ? `${COLOR_NAMES[color]} rolled a 6 — take another turn.` : `${COLOR_NAMES[color]} moved. Next player's turn.`;
  render();
}
function finishTestMatch() {
  if (!state.testMode) return;
  const winner = state.selectedWinner;
  state.gameOver = true;
  rollBtn.disabled = true;
  messageEl.textContent = `Test match completed. ${COLOR_NAMES[winner]} was selected as the test winner.`;
  document.getElementById("winnerText").textContent = `${COLOR_NAMES[winner]} wins!`;
  document.getElementById("winnerToast").classList.remove("hidden");
  document.getElementById("adminModal").classList.add("hidden");
  render();
}
document.getElementById("adminOpen").addEventListener("click", () => document.getElementById("adminModal").classList.remove("hidden"));
document.getElementById("adminClose").addEventListener("click", () => document.getElementById("adminModal").classList.add("hidden"));
document.getElementById("adminDone").addEventListener("click", () => document.getElementById("adminModal").classList.add("hidden"));
document.getElementById("newGame").addEventListener("click", resetGame);
document.getElementById("dismissWinner").addEventListener("click", () => document.getElementById("winnerToast").classList.add("hidden"));
rollBtn.addEventListener("click", rollDice);
document.getElementById("testMode").addEventListener("change", e => {
  state.testMode = e.target.checked;
  document.getElementById("adminControls").classList.toggle("disabled", !state.testMode);
  document.getElementById("applyWinner").disabled = !state.testMode;
  document.getElementById("modePill").textContent = state.testMode ? "TEST MODE" : "LOCAL GAME";
  document.getElementById("modePill").style.background = state.testMode ? "#fff0d8" : "#f0efff";
  document.getElementById("modePill").style.color = state.testMode ? "#9a5a00" : "#5b61a8";
});
document.querySelectorAll(".color-choice").forEach(button => button.addEventListener("click", () => {
  state.selectedWinner = button.dataset.color;
  document.querySelectorAll(".color-choice").forEach(b => b.classList.toggle("selected", b === button));
}));
document.getElementById("applyWinner").addEventListener("click", finishTestMatch);
document.getElementById("adminModal").addEventListener("click", e => { if (e.target.id === "adminModal") e.currentTarget.classList.add("hidden"); });
buildTrack();
resetGame();
