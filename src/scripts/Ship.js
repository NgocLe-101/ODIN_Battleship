import env from "./env";

export default class Ship {
  #_length;
  #_width;
  #_timesHit;
  constructor(shipLength, shipWidth) {
    this.#_length = shipLength || env.config.shipLength;
    this.#_width = shipWidth || env.config.shipWidth;
    this.#_timesHit = 0;
  }

  get length() {
    return this.#_length;
  }

  set length(value) {
    this.#_length = value;
  }

  get width() {
    return this.#_width;
  }

  set width(value) {
    this.#_width = value;
  }

  get timesHit() {
    return this.#_timesHit;
  }

  set timesHit(value) {
    this.#_timesHit = value;
  }

  hit() {
    if (!this.isSunk()) {
      this.#_timesHit++;
    }
  }

  #__shipArea() {
    return this.#_width * this.#_length;
  }

  isSunk() {
    return this.#_timesHit >= this.#__shipArea();
  }
}
