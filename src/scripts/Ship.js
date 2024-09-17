export default class Ship {
  #_length;
  #_timesHit;
  constructor(shipLength) {
    this.#_length = shipLength;
    this.#_timesHit = 0;
  }

  get length() {
    return this.#_length;
  }

  set length(value) {
    this.#_length = value;
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

  isSunk() {
    return this.#_timesHit >= this.length;
  }
}
