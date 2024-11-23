import { Globals } from './globals.js';

// Initialize canvas and attach it to Globals
export function initializeCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 600;
  document.body.appendChild(canvas);
  Globals.canvas = canvas.getContext('2d');
  console.log('Canvas initialized');
}
