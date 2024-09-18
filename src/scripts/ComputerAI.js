import Player from "./Player";
import Random from "./Random";

export default class ComputerAI extends Player {
  #_opponentBoardSize;
  #_hitMap;
  #_lastMove;
  #_moveQueue;
  #_traveled;
  constructor(opponentBoardSize) {
    super("Computer");
    this.#_opponentBoardSize = opponentBoardSize;
    this.#_hitMap = this.#__createBoolArr();
    this.#_traveled = this.#__createBoolArr();
    this.#_moveQueue = [];
  }
  #__createBoolArr() {
    const boolArr = new Array(this.#_opponentBoardSize);
    for (let i = 0; i < this.#_opponentBoardSize; i++) {
      boolArr[i] = new Array(this.#_opponentBoardSize);
      for (let j = 0; j < this.#_opponentBoardSize; j++) {
        boolArr[i][j] = false;
      }
    }
    return boolArr;
  }
  get opponentBoardSize() {
    return this.#_opponentBoardSize;
  }
  getRandomMove() {
    let move = null;
    do {
      move = {
        x: Random.getRandomIntInRange(0, this.#_opponentBoardSize - 1),
        y: Random.getRandomIntInRange(0, this.#_opponentBoardSize - 1),
      };
    } while (this.#_traveled[move.x][move.y]);
    return move;
  }
  #__lastMoveHit() {
    if (this.#_lastMove === undefined) return false;
    return this.#_hitMap[this.#_lastMove.x][this.#_lastMove.y];
  }
  getNextMove() {
    let newMoveCoor = null;
    if (this.#_moveQueue.length !== 0) {
      newMoveCoor = this.#_moveQueue.shift();
    } else if (this.#__lastMoveHit()) {
      const movePairs = [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
      ];
      let moveList = [];
      movePairs.forEach((move) => {
        const nextMoveCoor = {
          x: this.#_lastMove.x + move[0],
          y: this.#_lastMove.y + move[1],
        };
        moveList.push(nextMoveCoor);
      });
      moveList = moveList.filter(
        (move) => this.#__isValidMove(move) && !this.#_traveled[move.x][move.y]
      );
      this.#_moveQueue = this.#_moveQueue.concat(moveList);

      if (moveList.length === 0) {
        newMoveCoor = this.getRandomMove();
      } else {
        newMoveCoor = this.#_moveQueue.shift();
      }
    } else {
      newMoveCoor = this.getRandomMove();
    }
    this.#_lastMove = newMoveCoor;
    this.#_traveled[newMoveCoor.x][newMoveCoor.y] = true;
    return newMoveCoor;
  }
  get hitMap() {
    return this.#_hitMap;
  }
  #__isValidMove(coor) {
    return (
      coor.x >= 0 &&
      coor.x < this.#_opponentBoardSize &&
      coor.y >= 0 &&
      coor.y < this.#_opponentBoardSize
    );
  }
  moveHitOnCoor(coor) {
    if (this.#__isValidMove(coor)) {
      this.#_hitMap[coor.x][coor.y] = true;
    }
  }
}
