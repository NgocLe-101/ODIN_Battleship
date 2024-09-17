import Gameboard from "./Gameboard";

export default class Player {
  #_name;
  #_gameboard;
  constructor(name) {
    if (name !== undefined) {
      this.#_name = name;
    } else {
      this.#_name = "Player";
    }
    this.#_gameboard = new Gameboard();
  }
  get name() {
    return this.#_name;
  }
  get gameboard() {
    return this.#_gameboard;
  }
}
