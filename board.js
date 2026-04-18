import { COLORS, PATH, SAFE_SPOTS, COLOR_CONFIG } from './constants.js';

export class Board {
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

    // Draw the Bases
    this.drawBases();

    // Draw the Path Cells
    // Let's create a lookup to easily see if a grid cell belongs to the main path
    const pathSet = new Set(PATH.map(p => `${p.x},${p.y}`));

    for (let y = 0; y < 15; y++) {
      for (let x = 0; x < 15; x++) {
        // Skip base areas
        if ((x < 6 && y < 6) || (x > 8 && y < 6) || (x < 6 && y > 8) || (x > 8 && y > 8)) continue;
        // Skip center
        if (x >= 6 && x <= 8 && y >= 6 && y <= 8) continue;

        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.style.gridColumn = `${x + 1}`;
        cell.style.gridRow = `${y + 1}`;

        // Check for safe spots / path starts
        const pathIndex = PATH.findIndex(p => p.x === x && p.y === y);
        if (pathIndex !== -1) {
          if (SAFE_SPOTS.includes(pathIndex)) {
            cell.classList.add('safe-spot');
          }
          if (pathIndex === COLOR_CONFIG.red.startIndex) cell.classList.add('start-red');
          if (pathIndex === COLOR_CONFIG.green.startIndex) cell.classList.add('start-green');
          if (pathIndex === COLOR_CONFIG.yellow.startIndex) cell.classList.add('start-yellow');
          if (pathIndex === COLOR_CONFIG.blue.startIndex) cell.classList.add('start-blue');
        } else {
          // It's a Home Path cell
          if (y === 7 && x >= 1 && x <= 5) cell.classList.add('path-red');
          if (x === 7 && y >= 1 && y <= 5) cell.classList.add('path-green');
          if (y === 7 && x >= 9 && x <= 13) cell.classList.add('path-yellow');
          if (x === 7 && y >= 9 && y <= 13) cell.classList.add('path-blue');
        }

        this.cellsLayer.appendChild(cell);
      }
    }
  }

  drawBases() {
    const bases = [
      { color: 'red', col: '1 / 7', row: '1 / 7' },
      { color: 'green', col: '10 / 16', row: '1 / 7' },
      { color: 'yellow', col: '10 / 16', row: '10 / 16' },
      { color: 'blue', col: '1 / 7', row: '10 / 16' }
    ];

    bases.forEach(b => {
      const base = document.createElement('div');
      base.className = `base-${b.color}`;
      base.style.gridColumn = b.col;
      base.style.gridRow = b.row;
      base.style.display = 'grid';
      base.style.gridTemplateColumns = 'repeat(6, 1fr)';
      base.style.gridTemplateRows = 'repeat(6, 1fr)';
      base.style.padding = '10%'; // padding to make inner white box nice
      
      const inner = document.createElement('div');
      inner.className = 'base-inner';
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
        
        // Add click listener
        tokenDiv.addEventListener('click', () => {
          if (window.onTokenClick) {
            window.onTokenClick(color, i);
          }
        });

        this.tokensLayer.appendChild(tokenDiv);
      }
    });

    this.updateTokens(gameState);
  }

  updateTokens(gameState) {
    // If multiple tokens are on the same spot, we need to offset them slightly
    // Map of position string "x,y" to array of tokens there
    const posMap = {};

    COLORS.forEach(color => {
      gameState[color].forEach((state, i) => {
        let x, y;
        
        if (state.type === 'base') {
          x = COLOR_CONFIG[color].baseSpots[state.index].x;
          y = COLOR_CONFIG[color].baseSpots[state.index].y;
        } else if (state.type === 'path') {
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
        // Only offset tokens that are exactly on the same coordinate. Base and Home don't need intense stacking UI maybe, but let's do it for paths.
        posMap[key].push({ color, i, type: state.type, tokenDiv: document.getElementById(`${color}_${i}`) });

        const tokenDiv = document.getElementById(`${color}_${i}`);
        // Base positioning logic
        tokenDiv.style.setProperty('--cell-x', x);
        tokenDiv.style.setProperty('--cell-y', y);
      });
    });

    // Handle overlaps
    for (let key in posMap) {
      const tokens = posMap[key];
      if (tokens.length > 1 && tokens[0].type !== 'base' && tokens[0].type !== 'home') {
        // offset them
        // 2 tokens: scale 0.8, offset slightly
        // 3+ tokens scale 0.6 etc
        const offset = tokens.length > 2 ? 0.2 : 0.15;
        const scale = tokens.length > 2 ? 0.6 : 0.8;
        
        tokens.forEach((t, index) => {
          const inner = t.tokenDiv.querySelector('.token-inner');
          let dx = 0; let dy = 0;
          if (index === 0) { dx = -offset; dy = -offset; }
          if (index === 1) { dx = offset; dy = offset; }
          if (index === 2) { dx = -offset; dy = offset; }
          if (index === 3) { dx = offset; dy = -offset; }
          if (index > 3) { dx = 0; dy = 0; } // limit
          
          inner.style.transform = `scale(${scale}) translate(calc(${dx} * 100%), calc(${dy} * 100%))`;
        });
      } else {
        tokens.forEach(t => {
          const inner = t.tokenDiv.querySelector('.token-inner');
          inner.style.transform = `scale(1) translate(0,0)`;
        });
      }
    }
  }

  setSelectable(color, validIndices) {
    COLORS.forEach(c => {
      for (let i = 0; i < 4; i++) {
        const tokenDiv = document.getElementById(`${c}_${i}`);
        if (c === color && validIndices.includes(i)) {
          tokenDiv.classList.add('selectable');
        } else {
          tokenDiv.classList.remove('selectable');
        }
      }
    });
  }
}
