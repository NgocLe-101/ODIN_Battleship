import env from "./env";
import Storage from "./Storage";

function createGameboardCell(coordinates) {
  const div = document.createElement("div");
  div.classList.add("board-cell", `${coordinates.x}-${coordinates.y}`);
  div.innerHTML = `
        <div class="mark-wrapper">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 384 512"
            >
                <path
                d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"
                />
            </svg>
    `;
  return div;
}

function createGameboardDOM(board) {
  const size = env.config.boardSize;
  if (board !== undefined) {
    size = board.size;
  }
  const div = document.createElement("div");
  div.classList.add("board");
  div.setAttribute(
    "style",
    `display: grid; grid-template-columns: repeat(${size},1fr); grid-auto-rows: 1fr;`
  );
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const cell = createGameboardCell({ x: i, y: j });
      div.appendChild(cell);
    }
  }
  return div;
}

function renderError(message) {
  // TODO: show toast messages
}

async function renderPlayerInfo() {
  const playerInfoContainer = document.querySelector(
    ".container > .body > .left .player-info-container"
  );
  const score = playerInfoContainer.querySelector(".score");
  const name = playerInfoContainer.querySelector(".name");
  try {
    const fetchPlayerInfo = await Storage.get("playerInfo");
    name.textContent = fetchPlayerInfo.name;
    score.textContent = fetchPlayerInfo.score;
  } catch (err) {
    renderError(err.message);
  }
}

async function renderBotInfo() {
  const playerInfoContainer = document.querySelector(
    ".container > .body > .right .player-info-container"
  );
  const score = playerInfoContainer.querySelector(".score");
  const name = playerInfoContainer.querySelector(".name");
  try {
    const fetchBotInfo = await Storage.get("botInfo");
    console.log(fetchBotInfo);
    name.textContent = fetchBotInfo.name;
    score.textContent = fetchBotInfo.score;
  } catch (err) {
    console.error(err.message);
  }
}

function renderInfos() {
  renderPlayerInfo();
  renderBotInfo();
}

function renderGameboards(leftGameBoard, rightGameBoard) {
  const leftGB = document.querySelector(".body .left .gameboard-wrapper");
  const rightGB = document.querySelector(".body .right .gameboard-wrapper");
  leftGB.appendChild(createGameboardDOM(leftGameBoard));
  rightGB.appendChild(createGameboardDOM(rightGameBoard));
}

function renderBlankGameboards() {
  const leftGB = document.querySelector(".body .left .gameboard-wrapper");
  const rightGB = document.querySelector(".body .right .gameboard-wrapper");
  leftGB.appendChild(createGameboardDOM());
  rightGB.appendChild(createGameboardDOM());
}

function renderHompage() {
  renderInfos();
  renderBlankGameboards();
}

function renderShotOnCoor(board, coordinates) {
  const boardGotShot = document.querySelector(`.${board} .board`);
  const shotOnCell = Array.from(
    boardGotShot.querySelectorAll(".board-cell")
  ).filter(
    (cell) => cell.classList[1] == `${coordinates.x}-${coordinates.y}`
  )[0];
  shotOnCell.classList.add("active");
}

function renderScreen(message, screenToDisplay) {
  return;
  const displayScreen = document.querySelector(`.${screenToDisplay}`);
  if (displayScreen !== undefined) {
    const screens = document.querySelectorAll(".screen");
    screens.forEach((screen) => {
      screen.classList.remove("active");
    });
    displayScreen.classList.add("active");
  }
}

function switchActiveBoard(boardToSwitch) {
  const switchBoard = document.querySelector(
    `.body > .${boardToSwitch} .board`
  );
  const otherBoard = document.querySelector(
    `.body > *:not(.${boardToSwitch}) .board`
  );
  switchBoard.classList.add("active");
  otherBoard.classList.remove("active");
}

export {
  renderHompage,
  renderScreen,
  renderShotOnCoor,
  renderGameboards,
  switchActiveBoard,
};
