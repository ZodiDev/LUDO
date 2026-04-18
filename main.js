import { Board } from './board.js';
import { Dice } from './dice.js';
import { Game } from './game.js';
import { Bot } from './bot.js';

document.addEventListener('DOMContentLoaded', () => {
  const board = new Board();
  board.renderBoard();
  
  const dice = new Dice();
  const bot = new Bot();
  
  let game = new Game(board, dice, bot);
  game.startGame();

  document.getElementById('reset-btn').addEventListener('click', () => {
    // Check if user is sure? For now just reset
    game = new Game(board, dice, bot);
    game.startGame();
  });
});
