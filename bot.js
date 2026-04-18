import { COLORS, COLOR_CONFIG, SAFE_SPOTS } from './constants.js';

export class Bot {
  playTurn(game) {
    // Game handles rolling async, we just tell game we are rolling
    game.performRoll();
  }

  chooseMove(game, color, validTokens, roll) {
    // validTokens is array of indices
    // Evaluate each valid token move based on priority priority:
    // 1. Can capture opponent
    // 2. Can enter home (step 57)
    // 3. Can leave base (if roll == 6 and currently in base)
    // 4. Move furthest token
    
    let bestScores = [];

    validTokens.forEach(index => {
      const token = game.state[color][index];
      let score = 0;
      
      const currentSteps = token.steps;
      let targetSteps = currentSteps;
      
      if (currentSteps === 0 && roll === 6) {
        targetSteps = 1;
        score += 50; // good to leave base
      } else {
        targetSteps = currentSteps + roll;
      }
      
      if (targetSteps === 57) {
        score += 100; // Entering home is priority
      }
      
      // Check capture
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
            score += 200; // Capturing is extremely high priority
          }
        }
      }
      
      // Add small bonus for moving tokens that are furthest along
      score += targetSteps;

      bestScores.push({ index, score });
    });
    
    bestScores.sort((a, b) => b.score - a.score);
    return bestScores[0].index;
  }
}
