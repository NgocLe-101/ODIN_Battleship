import Ship from "../Ship";

let instanceShip = null;

beforeEach(() => {
  instanceShip = new Ship();
});

test("Has length and times hit properties", () => {
  instanceShip.length = 2;
  expect(instanceShip.length).toBe(2);
  expect(instanceShip.timesHit).toBe(0);
});

test("Hit method works correctly", () => {
  instanceShip.hit();
  instanceShip.hit();
  expect(instanceShip.timesHit).toBe(2);
});

test("Is sunk method works", () => {
  instanceShip.length = 1;
  instanceShip.hit();
  expect(instanceShip.isSunk()).toBe(true);
});

test("Hit when ship is sunk", () => {
  instanceShip.length = 1;
  instanceShip.hit();
  instanceShip.hit();
  expect(instanceShip.timesHit).toBe(1);
});
