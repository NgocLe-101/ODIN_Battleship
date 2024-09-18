import {
  renderHompage,
  renderScreen,
  renderShotOnCoor,
  switchActiveBoard,
} from "./UI";
import Storage from "./Storage";
import Player from "./Player";
import Ship from "./Ship";
import env from "./env";
import ComputerAI from "./ComputerAI";
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
export default class GameManager {
  #_players;
  #_playerTurn; // Player1's turn: true; Player2's turn: false
  constructor() {
    this.#_players = [
      new Player("Player"),
      new ComputerAI(env.config.boardSize),
    ];
    this.#_playerTurn = true;
    // Init the game objects
    Storage.initDB();
    renderHompage();
    this.#__initPlayers();
    this.#__initDOMStates();
    this.#__initEventListeners();
  }
  #__initPlayers() {
    this.#_players.forEach((player) => {
      for (let i = 0; i < 3; i++) {
        player.gameboard.placeShip(
          new Ship(1 + getRandomInt(3)),
          {
            x: getRandomInt(env.config.boardSize),
            y: getRandomInt(env.config.boardSize),
          },
          getRandomInt(1) === 1 ? true : false
        );
      }
    });
  }
  #__initEventListeners() {
    const playerBoards = document.querySelectorAll(".board");
    playerBoards.forEach((board) => {
      Array.from(board.children).forEach((child) => {
        child.addEventListener("click", () => {
          this.#__handleBoardCellClick(child);
        });
      });
    });
  }
  #__initDOMStates() {
    // Set active board
    switchActiveBoard(this.#_playerTurn ? "left" : "right");
  }
  #__switchTurn() {
    this.#_playerTurn = !this.#_playerTurn;
  }
  #__gameHasEnded() {
    for (const player of this.#_players) {
      if (player.gameboard.hasAllShipsSunk()) {
        return true;
      }
    }
    return false;
  }
  #__isCorrectBoardClick(elem) {
    if (this.#_playerTurn) {
      return elem.closest(".left") !== null;
    }
    return elem.closest(".right") !== null;
  }
  #__playerAttackOnCoor(coor) {
    const activeBoard = this.#__getActivePlayer().gameboard;
    activeBoard.receiveAttack(coor);
    const isMissedShot = activeBoard.hasShotMissedOnCoordinate(coor);
    return {
      isMissedShot,
    };
  }
  #__handleUIOnPlayerMove(moveCoor) {
    // Populate that move into the screen
    renderShotOnCoor(this.#_playerTurn ? "left" : "right", moveCoor);
    if (!this.#__gameHasEnded()) {
      switchActiveBoard(this.#_playerTurn ? "right" : "left");
    }
  }
  #__getActivePlayer() {
    return this.#_playerTurn ? this.#_players[0] : this.#_players[1];
  }
  #__handlePlayerMove(moveCoor) {
    const isMissedShot = this.#__playerAttackOnCoor(moveCoor).isMissedShot;
    if (isMissedShot) {
      console.log(
        `${this.#__getActivePlayer().name} missed a shot on ${moveCoor.x}:${moveCoor.y}`
      );
    } else {
      console.log(
        `${this.#__getActivePlayer().name} hit on ${moveCoor.x}:${moveCoor.y}!`
      );
    }
    this.#__populateStateForBot({
      thisIsBotTurn: !this.#_playerTurn,
      isHit: !isMissedShot,
      coorMoved: moveCoor,
    });
    this.#__handleUIOnPlayerMove(moveCoor);
    if (this.#__gameHasEnded()) {
      const winner = this.#_playerTurn
        ? this.#_players[0].name
        : this.#_players[1].name;
      console.log(`${winner} WON!`);
      renderScreen(`${winner} WON!`, "end-screen");
    } else {
      this.#__switchTurn();
    }
  }
  #__handleBoardCellClick(elem) {
    if (this.#__gameHasEnded()) {
      return;
    } else {
      if (!this.#__isCorrectBoardClick(elem)) {
        return;
      } else {
        const coor = {
          x: parseInt(elem.classList[1].split("-")[0]),
          y: parseInt(elem.classList[1].split("-")[1]),
        };
        this.#__handlePlayerMove(coor);
        setTimeout(() => {
          this.#__listenToComputerMove();
        }, 2000);
      }
    }
  }
  #__populateStateForBot(state) {
    if (!this.#__gameHasEnded()) {
      if (state.thisIsBotTurn && state.isHit) {
        this.#_players[1].moveHitOnCoor(state.coorMoved);
      }
    }
  }
  #__listenToComputerMove() {
    if (!this.#_playerTurn) {
      const computerMove = this.#_players[1].getNextMove();
      this.#__handlePlayerMove(computerMove);
    }
  }
  async restart() {
    const player = await Storage.get("playerInfo");
    this.#_players = [new Player(player.name), new ComputerAI()];
    this.#_playerTurn = true;
    renderHompage();
    this.#__initPlayers();
    this.#__initDOMStates();
    this.#__initEventListeners();
  }
}
