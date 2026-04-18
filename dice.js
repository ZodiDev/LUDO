export class Dice {
  constructor() {
    this.diceEl = document.getElementById('dice');
    this.rollBtn = document.getElementById('roll-btn');
    this.isRolling = false;
  }

  setDisabled(disabled) {
    this.rollBtn.disabled = disabled;
  }

  async roll() {
    if (this.isRolling) return null;
    this.isRolling = true;
    this.setDisabled(true);
    
    // Play sound from web audio or just visual here
    this.diceEl.classList.add('rolling');

    // Wait for animation to almost finish
    await new Promise(resolve => setTimeout(resolve, 800));

    // Calculate result 1-6
    const result = Math.floor(Math.random() * 6) + 1;
    
    this.diceEl.classList.remove('rolling');
    // Remove previous show classes
    this.diceEl.className = 'dice'; 
    // Force reflow to allow transition
    void this.diceEl.offsetWidth;
    this.diceEl.classList.add(`show-${result}`);

    await new Promise(resolve => setTimeout(resolve, 300));
    
    this.isRolling = false;
    return result;
  }
}
