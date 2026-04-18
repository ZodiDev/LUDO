import { COLORS, COLOR_CONFIG, SAFE_SPOTS } from './constants.js';

export class Game {
  constructor(board, dice, bot) {
    this.board = board;
    this.dice = dice;
    this.bot = bot;
    
    this.messageEl = document.getElementById('game-message');
    this.turnIndicator = document.getElementById('turn-indicator');
    this.rollBtn = document.getElementById('roll-btn');
    
    // Who is human? Let's say user is 'red', rest are bots
    this.humanColor = 'red';
    this.turnIndex = 0; // 0=red, 1=green, 2=yellow, 3=blue
    this.diceValue = null;
    this.hasExtraTurn = false;
    
    this.state = {};
    this.initTokens();
    
    window.onTokenClick = this.handleTokenClick.bind(this);
    this.rollBtn.addEventListener('click', this.handleRollClick.bind(this));
    
    this.updateUI();
  }

  initTokens() {
    COLORS.forEach(color => {
      this.state[color] = [];
      for (let i = 0; i < 4; i++) {
        this.state[color].push({ steps: 0 }); // 0 = base
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
    this.board.setSelectable(color, []); // clear highlighting

    // Check for win condition
    if (this.checkWin(color)) {
       this.showWinner(color);
       return;
    }

    if (this.isHumanTurn) {
      this.dice.setDisabled(false);
      this.setMessage("Your turn! Roll the dice.");
    } else {
      this.dice.setDisabled(true);
      this.setMessage(`${color.charAt(0).toUpperCase() + color.slice(1)} is thinking...`);
      setTimeout(() => this.bot.playTurn(this), 800);
    }
  }

  async handleRollClick() {
    if (!this.isHumanTurn) return;
    await this.performRoll();
  }

  async performRoll() {
    this.diceValue = await this.dice.roll();
    const color = this.currentColor;
    
    if (this.diceValue === 6) {
      this.hasExtraTurn = true;
    }

    this.setMessage(`Rolled a ${this.diceValue}.`);

    const validTokens = this.getValidMoves(color, this.diceValue);

    if (validTokens.length === 0) {
      this.setMessage(`No valid moves.`);
      setTimeout(() => this.nextTurn(), 1000);
      return;
    }

    // Auto-move if only 1 option and it's bot (or even human)
    if (validTokens.length === 1 && !this.isHumanTurn) {
      setTimeout(() => {
        this.moveToken(color, validTokens[0]);
      }, 500);
    } 
    else if (!this.isHumanTurn) {
      // Bot chooses
      setTimeout(() => {
        const choice = this.bot.chooseMove(this, color, validTokens, this.diceValue);
        this.moveToken(color, choice);
      }, 500);
    }
    else {
      // Human chooses
      if (validTokens.length === 1) {
         // Auto move for human if only 1 choice? That's good UX.
         setTimeout(() => {
           this.moveToken(color, validTokens[0]);
         }, 200);
      } else {
         this.setMessage(`Select a piece to move.`);
         this.board.setSelectable(color, validTokens);
      }
    }
  }

  handleTokenClick(color, index) {
    if (!this.isHumanTurn) return;
    if (color !== this.currentColor) return;
    
    const validTokens = this.getValidMoves(color, this.diceValue);
    if (validTokens.includes(index)) {
      this.board.setSelectable(color, []);
      this.moveToken(color, index);
    }
  }

  getValidMoves(color, roll) {
    if (!roll) return [];
    const valid = [];
    
    this.state[color].forEach((t, index) => {
      if (t.steps === 0) {
        // In base
        if (roll === 6) valid.push(index);
      } else {
        // On board
        if (t.steps + roll <= 57) {
          valid.push(index);
        }
      }
    });
    
    return valid;
  }

  moveToken(color, index) {
    const token = this.state[color][index];
    const roll = this.diceValue;

    if (token.steps === 0 && roll === 6) {
      token.steps = 1;
    } else {
      token.steps += roll;
    }

    // Check for captures
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
                  // Capture!
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
      }
    }

    this.board.updateTokens(this.getRenderState());

    setTimeout(() => {
      this.nextTurn();
    }, 500);
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
      this.turnIndex = 0;
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
    this.turnIndicator.textContent = `${c.charAt(0).toUpperCase() + c.slice(1)}'s Turn`;
    this.turnIndicator.style.color = `var(--${c})`;
    if (this.isHumanTurn) {
        this.rollBtn.style.backgroundColor = `var(--${c})`;
    } else {
        this.rollBtn.style.backgroundColor = `#ccc`;
    }
  }

  setMessage(msg) {
    this.messageEl.textContent = msg;
  }
}
