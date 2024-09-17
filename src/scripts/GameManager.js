import { renderHompage, renderScreen } from "./UI";
import Storage from "./Storage";
import Player from "./Player";
import Ship from "./Ship";
import env from "./env";
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
export default class GameManager {
  #_players;
  #_playerTurn; // Player1's turn: true; Player2's turn: false
  constructor() {
    this.#_players = [new Player("Player"), new Player("Computer")];
    this.#_playerTurn = true;
    // Init the game objects
    Storage.initDB();
    renderHompage();
    this.#__initPlayers();
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
          this.handleBoardCellClick(child);
        });
      });
    });
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
  handleBoardCellClick(elem) {
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
        let isMissedShot = false;
        if (this.#_playerTurn === true) {
          this.#_players[0].gameboard.receiveAttack(coor);
          isMissedShot =
            this.#_players[0].gameboard.hasShotMissedOnCoordinate(coor);
          console.log(coor);
          console.log(this.#_players[0].gameboard);
        } else {
          this.#_players[1].gameboard.receiveAttack(coor);
          isMissedShot =
            this.#_players[1].gameboard.hasShotMissedOnCoordinate(coor);
        }
        if (isMissedShot) {
          elem.querySelector("svg").classList.add("active");
        }
        this.#__switchTurn();
        if (this.#__gameHasEnded()) {
          const winner = this.#_playerTurn
            ? this.#_players[0].name
            : this.#_players[1].name;
          renderScreen(`${winner} WON!`, "end-screen");
        }
      }
    }
  }
}
