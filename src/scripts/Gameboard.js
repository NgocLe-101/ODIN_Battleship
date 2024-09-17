import env from "./env";
export default class Gameboard {
  #_boardSize; // The game board size. Board is a square grid with the size of each edge is _boardSize
  #_shipsOnBoard; // This is an array contains ship that are currently standing on board (active or sunk). Each array item is an
  //object that contain a ship and its coordinate in the board
  #_missedShots;
  constructor(boardSize) {
    if (boardSize === undefined) {
      this.#_boardSize = env.config.boardSize;
    } else {
      this.#_boardSize = boardSize;
    }
    this.#_shipsOnBoard = [];
    this.#_missedShots = [];
    this.#__initMissedShots();
  }
  #__initMissedShots() {
    for (let i = 0; i < this.#_boardSize; i++) {
      let row = [];
      for (let j = 0; j < this.#_boardSize; j++) {
        row.push(false);
      }
      this.#_missedShots.push(row);
    }
  }
  #__isValidCoor(coor) {
    return (
      coor.x >= 0 &&
      coor.x < this.#_boardSize &&
      coor.y >= 0 &&
      coor.y < this.#_boardSize
    );
  }
  #__addShip(ship, coor, isVerticalPlaced) {
    this.#_shipsOnBoard.push({
      ship,
      coor,
      isVerticalPlaced,
    });
  }
  #__hitShipAtCoor(coordinates) {
    const shipToReturn = this.#_shipsOnBoard.filter((ship) =>
      this.#__isCoordinateOnShip(coordinates, ship)
    );
    if (shipToReturn.length === 0) {
      return null;
    }
    shipToReturn[0].ship.hit();
    return shipToReturn[0];
  }
  #__missedAShotAt(coordinate) {
    this.#_missedShots[coordinate.x][coordinate.y] = true;
  }
  placeShip(ship, coor, isVerticalPlaced = false) {
    if (this.#__isValidCoor(coor)) {
      this.#__addShip(ship, coor, isVerticalPlaced);
    }
  }
  get size() {
    return this.#_boardSize;
  }
  receiveAttack(coordinates) {
    if (this.#__isValidCoor(coordinates)) {
      const shipHit = this.#__hitShipAtCoor(coordinates);
      if (shipHit === null) {
        this.#__missedAShotAt(coordinates);
      }
    }
  }
  hasAllShipsSunk() {
    return (
      this.#_shipsOnBoard.filter((ship) => !ship.ship.isSunk()).length === 0
    );
  }
  #__isCoordinateOnShip(coordinate, ship) {
    if (ship.isVerticalPlaced) {
      return (
        coordinate.y === ship.coor.y &&
        coordinate.x >= ship.coor.x &&
        coordinate.x <= ship.coor.x + ship.ship.length
      );
    }
    return (
      coordinate.x === ship.coor.x &&
      coordinate.y >= ship.coor.y &&
      coordinate.y <= ship.coor.y + ship.ship.length
    );
  }
  getShipOnCoordinates(coordinate) {
    if (this.#__isValidCoor(coordinate)) {
      const shipOnCoor = this.#_shipsOnBoard.filter((ship) =>
        this.#__isCoordinateOnShip(coordinate, ship)
      );
      if (shipOnCoor.length === 0) return null;
      return shipOnCoor[0].ship;
    }
    return null;
  }
  hasShotMissedOnCoordinate(coordinate) {
    if (this.#__isValidCoor(coordinate)) {
      return this.#_missedShots[coordinate.x][coordinate.y];
    }
    return false;
  }
}
