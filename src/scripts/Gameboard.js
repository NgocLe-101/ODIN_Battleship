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
    const isNotOutOfBoard =
      coor.x >= 0 &&
      coor.x < this.#_boardSize &&
      coor.y >= 0 &&
      coor.y < this.#_boardSize;
    return isNotOutOfBoard;
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
  #__hasShipOnCoor(coordinates) {
    const shipOnCoor = this.#_shipsOnBoard.filter((ship) =>
      this.#__isCoordinateOnShip(coordinates, ship)
    );
    if (shipOnCoor.length === 0) return false;
    return true;
  }
  #__isPlaceable(ship, coor, isVerticalPlaced) {
    const validCoor = this.#__isValidCoor(coor);
    const noShipOnCoor = !this.#__hasShipOnCoor(coor);
    let shipNotOverflowBoard = false;
    if (!isVerticalPlaced) {
      shipNotOverflowBoard =
        coor.x + ship.length < this.#_boardSize &&
        coor.y + ship.width < this.#_boardSize;
    } else {
      shipNotOverflowBoard =
        coor.y + ship.length < this.#_boardSize &&
        coor.x + ship.width < this.#_boardSize;
    }
    return validCoor && noShipOnCoor && shipNotOverflowBoard;
  }
  placeShip(ship, coor, isVerticalPlaced = false) {
    if (this.#__isPlaceable(ship, coor, isVerticalPlaced)) {
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
        coordinate.y >= ship.coor.y &&
        coordinate.y <= ship.coor.y + ship.ship.width - 1 &&
        coordinate.x >= ship.coor.x &&
        coordinate.x <= ship.coor.x + ship.ship.length - 1
      );
    }
    return (
      coordinate.x >= ship.coor.x &&
      coordinate.x <= ship.coor.x + ship.ship.width - 1 &&
      coordinate.y >= ship.coor.y &&
      coordinate.y <= ship.coor.y + ship.ship.length - 1
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
