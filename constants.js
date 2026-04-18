export const COLORS = ['red', 'green', 'yellow', 'blue'];

export const PATH = [
  {x:0, y:6}, {x:1, y:6}, {x:2, y:6}, {x:3, y:6}, {x:4, y:6}, {x:5, y:6},
  {x:6, y:5}, {x:6, y:4}, {x:6, y:3}, {x:6, y:2}, {x:6, y:1}, {x:6, y:0},
  {x:7, y:0}, {x:8, y:0},
  {x:8, y:1}, {x:8, y:2}, {x:8, y:3}, {x:8, y:4}, {x:8, y:5},
  {x:9, y:6}, {x:10, y:6}, {x:11, y:6}, {x:12, y:6}, {x:13, y:6}, {x:14, y:6},
  {x:14, y:7}, {x:14, y:8},
  {x:13, y:8}, {x:12, y:8}, {x:11, y:8}, {x:10, y:8}, {x:9, y:8},
  {x:8, y:9}, {x:8, y:10}, {x:8, y:11}, {x:8, y:12}, {x:8, y:13}, {x:8, y:14},
  {x:7, y:14}, {x:6, y:14},
  {x:6, y:13}, {x:6, y:12}, {x:6, y:11}, {x:6, y:10}, {x:6, y:9},
  {x:5, y:8}, {x:4, y:8}, {x:3, y:8}, {x:2, y:8}, {x:1, y:8}, {x:0, y:8},
  {x:0, y:7}
];

export const SAFE_SPOTS = [1, 9, 14, 22, 27, 35, 40, 48];

export const COLOR_CONFIG = {
  red: {
    startIndex: 1,
    homePath: [{x:1, y:7}, {x:2, y:7}, {x:3, y:7}, {x:4, y:7}, {x:5, y:7}],
    baseSpots: [{x:2, y:2}, {x:3, y:2}, {x:2, y:3}, {x:3, y:3}], // adjusted to be more centered in 6x6 base map
    homePos: {x:6, y:7} // entering the center
  },
  green: {
    startIndex: 14,
    homePath: [{x:7, y:1}, {x:7, y:2}, {x:7, y:3}, {x:7, y:4}, {x:7, y:5}],
    baseSpots: [{x:11, y:2}, {x:12, y:2}, {x:11, y:3}, {x:12, y:3}],
    homePos: {x:7, y:6}
  },
  yellow: {
    startIndex: 27,
    homePath: [{x:13, y:7}, {x:12, y:7}, {x:11, y:7}, {x:10, y:7}, {x:9, y:7}],
    baseSpots: [{x:11, y:11}, {x:12, y:11}, {x:11, y:12}, {x:12, y:12}],
    homePos: {x:8, y:7}
  },
  blue: {
    startIndex: 40,
    homePath: [{x:7, y:13}, {x:7, y:12}, {x:7, y:11}, {x:7, y:10}, {x:7, y:9}],
    baseSpots: [{x:2, y:11}, {x:3, y:11}, {x:2, y:12}, {x:3, y:12}],
    homePos: {x:7, y:8}
  }
};
