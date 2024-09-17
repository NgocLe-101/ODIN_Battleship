import Player from "../Player";
import Ship from "../Ship";

let playerInstance = null;

beforeEach(() => {
  playerInstance = new Player("John");
});

describe("Player should have a name and their own game board", () => {
  test("should have a name", () => {
    expect(playerInstance.name).toBeTruthy();
  });

  test("should have a gameboard", () => {
    expect(playerInstance.gameboard).toBeTruthy();
  });

  test("gameboard should be interactable", () => {
    playerInstance.gameboard.placeShip(
      new Ship(3),
      {
        x: 0,
        y: 0,
      },
      false
    );
    expect(
      playerInstance.gameboard.getShipOnCoordinates({
        x: 0,
        y: 1,
      }).length
    ).toBe(3);
  });

  test("name should be correspond with the one constructed", () => {
    let name = "David";
    const playerDavid = new Player(name);
    expect(playerDavid.name).toBe(name);
  });
});
