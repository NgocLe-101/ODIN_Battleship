// /D:/repos/ODIN_Battleship/src/scripts/Random.js

const Random = {
  getRandomInt: function (max) {
    return Math.floor(Math.random() * Math.floor(max));
  },

  getRandomIntInRange: function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
};

export default Random;
