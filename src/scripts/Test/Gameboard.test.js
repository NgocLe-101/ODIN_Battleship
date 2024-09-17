import Gameboard from "../Gameboard";
import Ship from "../Ship";
import env from "../env";

let gameBoardInstance = null;
let shipInstance = null;

beforeEach(() => {
  gameBoardInstance = new Gameboard(100);
  shipInstance = new Ship(2);
  shipInstance.hit();
});

describe("Place ship", () => {
  beforeEach(() => {
    gameBoardInstance.placeShip(
      shipInstance,
      {
        x: 0,
        y: 0,
      },
      true
    );
  });
  test("Place ship works correctly", () => {
    expect(
      gameBoardInstance.getShipOnCoordinates({
        x: 0,
        y: 0,
      })
    ).toBeTruthy();
    expect(
      gameBoardInstance.getShipOnCoordinates({
        x: 1,
        y: 0,
      })
    ).toBeTruthy();
    expect(
      gameBoardInstance.getShipOnCoordinates({
        x: 1,
        y: 1,
      })
    ).toBeNull();
  });
});

describe("Receive attack", () => {
  beforeEach(() => {
    gameBoardInstance.placeShip(
      shipInstance,
      {
        x: 0,
        y: 0,
      },
      false
    );
  });
  test("Received attack on a ship", () => {
    gameBoardInstance.receiveAttack({
      x: 0,
      y: 0,
    });
    expect(
      gameBoardInstance.getShipOnCoordinates({
        x: 0,
        y: 0,
      }).timesHit
    ).toBe(2);
    gameBoardInstance.receiveAttack({
      x: 0,
      y: 0,
    });
    expect(
      gameBoardInstance
        .getShipOnCoordinates({
          x: 0,
          y: 0,
        })
        .isSunk()
    ).toBe(true);
    expect(
      gameBoardInstance.getShipOnCoordinates({
        x: 0,
        y: 0,
      }).timesHit
    ).toBe(2);
  });

  test("Missed a shot", () => {
    gameBoardInstance.receiveAttack({
      x: 1,
      y: 1,
    });
    expect(
      gameBoardInstance.hasShotMissedOnCoordinate({
        x: 1,
        y: 1,
      })
    ).toBe(true);
    gameBoardInstance.receiveAttack({
      x: 0,
      y: 0,
    });
    expect(
      gameBoardInstance.hasShotMissedOnCoordinate({
        x: 0,
        y: 0,
      })
    ).toBe(false);
  });
});

describe("All ship sunk", () => {
  beforeEach(() => {
    const ship2 = new Ship(1);
    gameBoardInstance.placeShip(shipInstance, {
      x: 0,
      y: 0,
    });
    gameBoardInstance.placeShip(
      ship2,
      {
        x: 5,
        y: 6,
      },
      true
    );
  });

  test("No ship sunk", () => {
    expect(gameBoardInstance.hasAllShipsSunk()).toBe(false);
  });

  test("One ship sunk", () => {
    gameBoardInstance.receiveAttack({
      x: 0,
      y: 0,
    });
    expect(gameBoardInstance.hasAllShipsSunk()).toBe(false);
  });
  test("All ship sunk", () => {
    gameBoardInstance.receiveAttack({
      x: 0,
      y: 0,
    });
    gameBoardInstance.receiveAttack({
      x: 5,
      y: 6,
    });
    expect(gameBoardInstance.hasAllShipsSunk()).toBe(true);
  });
});

describe("Gameboard validation", () => {
  test("has size", () => {
    expect(gameBoardInstance.size).toBeTruthy();
  });
  test("Gameboard has default size when no boardSize is defined when construct object", () => {
    const newGameboard = new Gameboard();
    expect(newGameboard.size).toBe(env.config.boardSize);
  });
});
