import Ship from "../Ship";

let instanceShip = null;

beforeEach(() => {
  instanceShip = new Ship();
});

test("Has length, width and times hit properties", () => {
  instanceShip.width = 1;
  instanceShip.length = 2;
  expect(instanceShip.length).toBe(2);
  expect(instanceShip.width).toBe(1);
  expect(instanceShip.timesHit).toBe(0);
});

test("Hit method works correctly", () => {
  instanceShip.length = 2;
  instanceShip.hit();
  instanceShip.hit();
  expect(instanceShip.timesHit).toBe(2);
});

test("Is sunk method works", () => {
  instanceShip.length = 1;
  instanceShip.width = 1;
  instanceShip.hit();
  expect(instanceShip.isSunk()).toBe(true);
  const biggerShip = new Ship();
  biggerShip.length = 1;
  biggerShip.width = 2;
  biggerShip.hit();
  expect(biggerShip.isSunk()).toBe(false);
  biggerShip.hit();
  expect(biggerShip.isSunk()).toBe(true);
});

test("Hit when ship is sunk", () => {
  instanceShip.length = 1;
  instanceShip.hit();
  instanceShip.hit();
  expect(instanceShip.timesHit).toBe(1);
});
