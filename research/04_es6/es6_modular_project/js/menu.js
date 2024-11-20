import { useTool } from './tools.js';

// Function triggered when a menu option is selected
export function menuOptionSelected(toolName) {
  console.log(`Menu option selected: ${toolName}`);

  // Call the `useTool` function from tools.js
  useTool(toolName);
}

// Example: Attach event listeners for menu options
document.addEventListener('DOMContentLoaded', () => {
  const button = document.createElement('button');
  button.textContent = 'Select Eraser';
  button.onclick = () => menuOptionSelected('eraser');
  document.body.appendChild(button);
});
