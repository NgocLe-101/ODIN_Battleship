import ComputerAI from "../ComputerAI";
import Gameboard from "../Gameboard";

let instance = null;
describe("ComputerAI", () => {
  beforeEach(() => {
    instance = new ComputerAI(10);
  });
  test("Computer should have its own gameboard, name and know its opponent boardsize", () => {
    expect(instance.gameboard).toBeTruthy();
    expect(instance.name).toBe("Computer");
    expect(instance.opponentBoardSize).toBe(10);
    const newComputer = new ComputerAI(15);
    expect(newComputer.opponentBoardSize).toBe(15);
  });
  test("Computer should be able to choose a valid coor to attack", () => {
    const moveCoor = instance.getRandomMove();
    expect(moveCoor.x).toBeGreaterThan(-1);
    expect(moveCoor.y).toBeGreaterThan(-1);
    expect(moveCoor.x).toBeLessThan(10);
    expect(moveCoor.y).toBeLessThan(10);
    const anotherMove = instance.getRandomMove();
    expect(moveCoor).not.toEqual(anotherMove);
  });
  test("Computer should track moves that they hit", () => {
    instance.moveHitOnCoor({
      x: 2,
      y: 5,
    });
    expect(instance.hitMap[2][5]).toBe(true);
    expect(instance.hitMap[2][4]).toBe(false);
  });
  test("Computer should know about their opponent state", () => {
    const currentMove = instance.getNextMove();
    instance.moveHitOnCoor(currentMove);
    const nextMove = instance.getNextMove();
    const diffMoveX = nextMove.x - currentMove.x;
    const diffMoveY = nextMove.y - currentMove.y;
    const nextMoveDiff = Math.sqrt(
      diffMoveX * diffMoveX + diffMoveY * diffMoveY
    );
    expect(nextMoveDiff).toBe(1);
  });
});
