// --- Constants ---
const COLORS = ['red', 'yellow', 'blue', 'green']; 

const PATH = [
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

const SAFE_SPOTS = [1, 9, 14, 22, 27, 35, 40, 48];

const COLOR_CONFIG = {
  yellow: { // Top-Left
    startIndex: 1,
    homePath: [{x:1, y:7}, {x:2, y:7}, {x:3, y:7}, {x:4, y:7}, {x:5, y:7}],
    baseSpots: [{x:1.95, y:1.95}, {x:4.05, y:1.95}, {x:1.95, y:4.05}, {x:4.05, y:4.05}],
    homePos: {x:6, y:7}
  },
  blue: { // Top-Right
    startIndex: 14,
    homePath: [{x:7, y:1}, {x:7, y:2}, {x:7, y:3}, {x:7, y:4}, {x:7, y:5}],
    baseSpots: [{x:10.95, y:1.95}, {x:13.05, y:1.95}, {x:10.95, y:4.05}, {x:13.05, y:4.05}],
    homePos: {x:7, y:6}
  },
  green: { // Bottom-Right
    startIndex: 27,
    homePath: [{x:13, y:7}, {x:12, y:7}, {x:11, y:7}, {x:10, y:7}, {x:9, y:7}],
    baseSpots: [{x:10.95, y:10.95}, {x:13.05, y:10.95}, {x:10.95, y:13.05}, {x:13.05, y:13.05}],
    homePos: {x:8, y:7}
  },
  red: { // Bottom-Left (Human User)
    startIndex: 40,
    homePath: [{x:7, y:13}, {x:7, y:12}, {x:7, y:11}, {x:7, y:10}, {x:7, y:9}],
    baseSpots: [{x:1.95, y:10.95}, {x:4.05, y:10.95}, {x:1.95, y:13.05}, {x:4.05, y:13.05}],
    homePos: {x:7, y:8}
  }
};

// --- Board ---
class Board {
  constructor() {
    this.cellsLayer = document.getElementById('cells-layer');
    this.tokensLayer = document.getElementById('tokens-layer');
  }

  renderBoard() {
    this.cellsLayer.innerHTML = '';
    
    // Draw Center Home
    const center = document.createElement('div');
    center.className = 'center-home';
    this.cellsLayer.appendChild(center);

    this.drawBases();

    for (let y = 0; y < 15; y++) {
      for (let x = 0; x < 15; x++) {
        if ((x < 6 && y < 6) || (x > 8 && y < 6) || (x < 6 && y > 8) || (x > 8 && y > 8)) continue;
        if (x >= 6 && x <= 8 && y >= 6 && y <= 8) continue;

        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.style.gridColumn = `${x + 1}`;
        cell.style.gridRow = `${y + 1}`;

        const pathIndex = PATH.findIndex(p => p.x === x && p.y === y);
        if (pathIndex !== -1) {
          if (SAFE_SPOTS.includes(pathIndex)) {
            cell.classList.add('safe-spot');
          }
          if (pathIndex === COLOR_CONFIG.yellow.startIndex) { cell.classList.add('start-yellow'); cell.classList.remove('safe-spot'); }
          if (pathIndex === COLOR_CONFIG.blue.startIndex) { cell.classList.add('start-blue'); cell.classList.remove('safe-spot'); }
          if (pathIndex === COLOR_CONFIG.green.startIndex) { cell.classList.add('start-green'); cell.classList.remove('safe-spot'); }
          if (pathIndex === COLOR_CONFIG.red.startIndex) { cell.classList.add('start-red'); cell.classList.remove('safe-spot'); }
        } else {
          if (y === 7 && x >= 1 && x <= 5) cell.classList.add('path-yellow'); // left arm
          if (x === 7 && y >= 1 && y <= 5) cell.classList.add('path-blue'); // top arm
          if (y === 7 && x >= 9 && x <= 13) cell.classList.add('path-green'); // right arm
          if (x === 7 && y >= 9 && y <= 13) cell.classList.add('path-red'); // bottom arm
        }

        this.cellsLayer.appendChild(cell);
      }
    }
  }

  drawBases() {
    const bases = [
      { color: 'yellow', col: '1 / 7', row: '1 / 7' },
      { color: 'blue', col: '10 / 16', row: '1 / 7' },
      { color: 'green', col: '10 / 16', row: '10 / 16' },
      { color: 'red', col: '1 / 7', row: '10 / 16' }
    ];

    bases.forEach(b => {
      const base = document.createElement('div');
      base.className = `base-${b.color}`;
      
      const inner = document.createElement('div');
      inner.className = 'base-inner';
      
      for(let i=0; i<4; i++) {
         const spot = document.createElement('div');
         spot.className = `spot-circle spot-circle-${b.color}`;
         spot.id = `base-spot-${b.color}-${i}`;
         inner.appendChild(spot);
      }
      
      base.appendChild(inner);
      this.cellsLayer.appendChild(base);
    });
  }

  createTokens(gameState) {
    this.tokensLayer.innerHTML = '';
    
    COLORS.forEach(color => {
      for (let i = 0; i < 4; i++) {
        const id = `${color}_${i}`;
        const tokenDiv = document.createElement('div');
        tokenDiv.className = `token ${color}`;
        tokenDiv.id = id;
        
        const inner = document.createElement('div');
        inner.className = 'token-inner';
        tokenDiv.appendChild(inner);
        
        tokenDiv.addEventListener('click', () => {
          if (window.onTokenClick) {
            window.onTokenClick(color, i);
          }
        });
        
        // Starts effectively reparenting on init:
        const initialSpot = document.getElementById(`base-spot-${color}-${i}`);
        if(initialSpot) {
            initialSpot.appendChild(tokenDiv);
        } else {
            this.tokensLayer.appendChild(tokenDiv);
        }
      }
    });

    this.updateTokens(gameState);
  }

  updateTokens(gameState) {
    const posMap = {};

    COLORS.forEach(color => {
      gameState[color].forEach((state, i) => {
        const tokenDiv = document.getElementById(`${color}_${i}`);
        
        if (state.type === 'base') {
           const spot = document.getElementById(`base-spot-${color}-${state.index}`);
           if (tokenDiv.parentNode !== spot) {
               spot.appendChild(tokenDiv);
           }
        } else {
           const boardLayer = document.getElementById('tokens-layer');
           if (tokenDiv.parentNode !== boardLayer) {
               boardLayer.appendChild(tokenDiv);
           }
           
           let x, y;
           if (state.type === 'path') {
             x = PATH[state.index].x;
             y = PATH[state.index].y;
           } else if (state.type === 'home_path') {
             x = COLOR_CONFIG[color].homePath[state.index].x;
             y = COLOR_CONFIG[color].homePath[state.index].y;
           } else if (state.type === 'home') {
             x = COLOR_CONFIG[color].homePos.x;
             y = COLOR_CONFIG[color].homePos.y;
           }

           const key = `${x},${y}`;
           if (!posMap[key]) posMap[key] = [];
           posMap[key].push({ color, i, tokenDiv, x, y });
        }
      });
    });

    for (let key in posMap) {
      const tokens = posMap[key];
      if (tokens.length > 1) {
        const offset = tokens.length > 2 ? 0.2 : 0.15;
        const scale = tokens.length > 2 ? 0.6 : 0.8;
        
        tokens.forEach((t, index) => {
          const mainDiv = t.tokenDiv;
          let dx = 0; let dy = 0;
          if (index === 0) { dx = -offset; dy = -offset; }
          if (index === 1) { dx = offset; dy = offset; }
          if (index === 2) { dx = -offset; dy = offset; }
          if (index === 3) { dx = offset; dy = -offset; }
          
          mainDiv.style.setProperty('--cell-x', t.x);
          mainDiv.style.setProperty('--cell-y', t.y);
          mainDiv.style.transform = `translate(calc((var(--cell-x) + ${dx}) * 100%), calc((var(--cell-y) + ${dy}) * 100%)) scale(${scale})`;
          mainDiv.style.zIndex = index + 1;
        });
      } else {
        tokens.forEach(t => {
          const mainDiv = t.tokenDiv;
          mainDiv.style.setProperty('--cell-x', t.x);
          mainDiv.style.setProperty('--cell-y', t.y);
          mainDiv.style.transform = `translate(calc(var(--cell-x) * 100%), calc(var(--cell-y) * 100%)) scale(1)`;
          mainDiv.style.zIndex = Math.floor(Math.random() * 10) + 10;
        });
      }
    }
  }

  setSelectable(color, validIndices) {
    COLORS.forEach(c => {
      for (let i = 0; i < 4; i++) {
        const tokenDiv = document.getElementById(`${c}_${i}`);
        if (!tokenDiv) continue;
        if (c === color && validIndices.includes(i)) {
          tokenDiv.classList.add('selectable');
        } else {
          tokenDiv.classList.remove('selectable');
        }
      }
    });
  }
}

// --- Dice ---
class Dice {
  constructor() {
    this.diceContainer = document.getElementById('dice-container');
    this.diceFace = document.getElementById('dice');
    this.isRolling = false;
  }

  async roll(biasedSix = false) {
    if (this.isRolling) return null;
    this.isRolling = true;
    
    this.diceContainer.classList.add('rolling');
    
    let shuffleInt = setInterval(() => {
       const r = Math.floor(Math.random() * 6) + 1;
       this.diceFace.className = `dice-face show-${r}`;
    }, 100);

    await new Promise(resolve => setTimeout(resolve, 500));

    clearInterval(shuffleInt);
    this.diceContainer.classList.remove('rolling');

    // Biased roll: treat a pool of 8 equally-likely outcomes where two of them are 6
    let result;
    if (biasedSix) {
      const pool = [1, 2, 3, 4, 5, 6, 6]; // 2/7 chance of 6 (close enough to 2/6)
      result = pool[Math.floor(Math.random() * pool.length)];
    } else {
      result = Math.floor(Math.random() * 6) + 1;
    }
    this.diceFace.className = `dice-face show-${result}`;

    await new Promise(resolve => setTimeout(resolve, 300));
    
    this.isRolling = false;
    return result;
  }
}

// --- Bot ---
class Bot {
  playTurn(game) {
    game.performRoll();
  }

  chooseMove(game, color, validTokens, roll) {
    let bestScores = [];

    validTokens.forEach(index => {
      const token = game.state[color][index];
      let score = 0;
      
      const currentSteps = token.steps;
      let targetSteps = currentSteps;
      
      if (currentSteps === 0 && roll === 6) {
        targetSteps = 1;
        score += 50;
      } else {
        targetSteps = currentSteps + roll;
      }
      
      if (targetSteps === 57) {
        score += 100;
      }
      
      if (targetSteps >= 1 && targetSteps <= 51) {
        const destIndex = (COLOR_CONFIG[color].startIndex + targetSteps - 1) % 52;
        if (!SAFE_SPOTS.includes(destIndex)) {
          let canCapture = false;
          COLORS.forEach(c => {
            if (c !== color) {
              game.state[c].forEach(enemyToken => {
                if (enemyToken.steps >= 1 && enemyToken.steps <= 51) {
                  const enemyIndex = (COLOR_CONFIG[c].startIndex + enemyToken.steps - 1) % 52;
                  if (enemyIndex === destIndex) {
                    canCapture = true;
                  }
                }
              });
            }
          });
          if (canCapture) {
            score += 200;
          }
        }
      }
      
      score += targetSteps;
      bestScores.push({ index, score });
    });
    
    // sort descending
    bestScores.sort((a, b) => b.score - a.score);
    return bestScores[0].index;
  }
}

// --- Game ---
class Game {
  constructor(board, dice, bot) {
    this.board = board;
    this.dice = dice;
    this.bot = bot;
    
    // Human is Red, playing from bottom left.
    // Turn order clockwise: Yellow, Blue, Green, Red
    this.humanColor = 'red';
    this.turnIndex = 0; // COLORS[0] === 'red', so red always goes first
    this.diceValue = null;
    this.hasExtraTurn = false;
    
    this.state = {};
    this.initTokens();
    
    window.onTokenClick = this.handleTokenClick.bind(this);
    
    // bind dice container and main roll button
    const containerNode = document.getElementById('dice-container');
    const newContainer = containerNode.cloneNode(true);
    containerNode.parentNode.replaceChild(newContainer, containerNode);
    this.dice.diceContainer = newContainer;
    this.dice.diceFace = newContainer.querySelector('.dice-face');
    
    newContainer.addEventListener('click', this.handleRollClick.bind(this));

    const rollBtnNode = document.getElementById('roll-button-main');
    const newRollBtn = rollBtnNode.cloneNode(true);
    rollBtnNode.parentNode.replaceChild(newRollBtn, rollBtnNode);
    this.rollBtn = newRollBtn;
    this.rollBtn.addEventListener('click', this.handleRollClick.bind(this));
    
    this.updateUI();
  }

  initTokens() {
    COLORS.forEach(color => {
      this.state[color] = [];
      for (let i = 0; i < 4; i++) {
        this.state[color].push({ steps: 0 });
      }
    });
  }

  get currentColor() {
    return COLORS[this.turnIndex];
  }

  get isHumanTurn() {
    return this.currentColor === this.humanColor;
  }

  startGame() {
    this.board.createTokens(this.getRenderState());
    this.startTurn();
  }

  nextTurn() {
    if (!this.hasExtraTurn) {
      this.turnIndex = (this.turnIndex + 1) % 4;
    }
    this.hasExtraTurn = false;
    this.diceValue = null;
    this.startTurn();
  }

  startTurn() {
    this.updateUI();
    const color = this.currentColor;
    this.board.setSelectable(color, []);

    if (this.checkWin(color)) {
       this.showWinner(color);
       return;
    }

    if (!this.isHumanTurn) {
      setTimeout(() => this.bot.playTurn(this), 800);
    }
  }

  async handleRollClick() {
    if (!this.isHumanTurn) return;
    if (this.diceValue !== null) return; // already rolled
    await this.performRoll();
  }

  async performRoll() {
    // Biased roll for human when all pieces are still in base: 2/6 chance of a 6
    let biasedSix = false;
    if (this.isHumanTurn) {
      const allInBase = this.state[this.humanColor].every(t => t.steps === 0);
      biasedSix = allInBase;
    }
    this.diceValue = await this.dice.roll(biasedSix);
    const color = this.currentColor;
    
    if (this.diceValue === 6) {
      this.hasExtraTurn = true;
    }

    const validTokens = this.getValidMoves(color, this.diceValue);

    if (validTokens.length === 0) {
      setTimeout(() => this.nextTurn(), 1000);
      return;
    }

    if (validTokens.length === 1 && !this.isHumanTurn) {
      setTimeout(async () => {
        await this.moveToken(color, validTokens[0]);
      }, 500);
    } 
    else if (!this.isHumanTurn) {
      setTimeout(async () => {
        const choice = this.bot.chooseMove(this, color, validTokens, this.diceValue);
        await this.moveToken(color, choice);
      }, 500);
    }
    else {
      if (validTokens.length === 1) {
         setTimeout(async () => {
           await this.moveToken(color, validTokens[0]);
         }, 300);
      } else {
         this.board.setSelectable(color, validTokens);
      }
    }
  }

  async handleTokenClick(color, index) {
    if (!this.isHumanTurn) return;
    if (color !== this.currentColor) return;
    
    const validTokens = this.getValidMoves(color, this.diceValue);
    if (validTokens.includes(index)) {
      this.board.setSelectable(color, []);
      await this.moveToken(color, index);
    }
  }

  getValidMoves(color, roll) {
    if (!roll) return [];
    const valid = [];
    
    this.state[color].forEach((t, index) => {
      if (t.steps === 0) {
        if (roll === 6) valid.push(index);
      } else {
        if (t.steps + roll <= 57) {
          valid.push(index);
        }
      }
    });
    
    return valid;
  }

  async moveToken(color, index) {
    const token = this.state[color][index];
    const roll = this.diceValue;

    if (token.steps === 0 && roll === 6) {
      token.steps = 1;
      this.board.updateTokens(this.getRenderState());
      await new Promise(r => setTimeout(r, 250));
    } else {
      for (let i = 0; i < roll; i++) {
        token.steps += 1;
        this.board.updateTokens(this.getRenderState());
        await new Promise(r => setTimeout(r, 250));
      }
    }

    if (token.steps >= 1 && token.steps <= 51) {
      const destIndex = (COLOR_CONFIG[color].startIndex + token.steps - 1) % 52;
      let captured = false;
      
      if (!SAFE_SPOTS.includes(destIndex)) {
        COLORS.forEach(c => {
          if (c !== color) {
            this.state[c].forEach(t => {
              if (t.steps >= 1 && t.steps <= 51) {
                const enemyIndex = (COLOR_CONFIG[c].startIndex + t.steps - 1) % 52;
                if (enemyIndex === destIndex) {
                  t.steps = 0;
                  captured = true;
                }
              }
            });
          }
        });
      }
      
      if (captured) {
        this.hasExtraTurn = true;
        this.board.updateTokens(this.getRenderState());
        await new Promise(r => setTimeout(r, 250));
      }
    }

    setTimeout(() => {
      this.nextTurn();
    }, 200);
  }

  checkWin(color) {
    return this.state[color].every(t => t.steps === 57);
  }

  showWinner(color) {
    const modal = document.getElementById('winner-modal');
    const text = document.getElementById('winner-text');
    text.textContent = `${color.toUpperCase()} WINS!`;
    modal.classList.remove('hidden');
    
    document.getElementById('play-again-btn').onclick = () => {
      modal.classList.add('hidden');
      this.initTokens();
      this.turnIndex = 0; // Reset to red (COLORS[0])
      this.startGame();
    };
  }

  getRenderState() {
    const renderState = {};
    COLORS.forEach(color => {
      renderState[color] = this.state[color].map((t, idx) => {
        if (t.steps === 0) return { type: 'base', index: idx };
        if (t.steps >= 1 && t.steps <= 51) {
          return { type: 'path', index: (COLOR_CONFIG[color].startIndex + t.steps - 1) % 52 };
        }
        if (t.steps >= 52 && t.steps <= 56) {
          return { type: 'home_path', index: t.steps - 52 };
        }
        if (t.steps === 57) {
          return { type: 'home', index: idx };
        }
      });
    });
    return renderState;
  }

  updateUI() {
    const c = this.currentColor;
    COLORS.forEach(color => {
      const base = document.querySelector(`.base-${color} .base-inner`);
      if (base) {
         if (color === c) {
            base.style.boxShadow = `0 0 10px 4px #ffffff80`;
         } else {
            base.style.boxShadow = 'none';
         }
      }
    });

    const diceContainer = document.getElementById('dice-container');
    if (this.isHumanTurn) {
       this.rollBtn.style.backgroundColor = `var(--${c})`;
       this.rollBtn.disabled = false;
       diceContainer.style.outline = '4px solid white';
       diceContainer.style.cursor = 'pointer';
    } else {
       this.rollBtn.style.backgroundColor = `#888`;
       this.rollBtn.disabled = true;
       diceContainer.style.outline = 'none';
       diceContainer.style.cursor = 'default';
    }
  }
}

// --- Main execution ---
document.addEventListener('DOMContentLoaded', () => {
  const board = new Board();
  board.renderBoard();
  
  const dice = new Dice();
  const bot = new Bot();
  
  let game = new Game(board, dice, bot);
  game.startGame();

  document.getElementById('reset-btn').addEventListener('click', () => {
    game = new Game(board, dice, bot);
    game.startGame();
  });
});
