#!/bin/bash

# Set project folder name
PROJECT_NAME="es6_modular_project"

# Create project directory
mkdir -p "$PROJECT_NAME/js"

# Navigate to the project directory
cd "$PROJECT_NAME" || exit

# Create index.html
cat <<EOL > index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ES6 Modules Project</title>
</head>
<body>
  <script type="module">
    import { initializeCanvas } from './js/canvas.js';
    import { menuOptionSelected } from './js/menu.js';

    // Initialize the app
    document.addEventListener('DOMContentLoaded', () => {
      initializeCanvas(); // Set up the canvas
      menuOptionSelected('pencil'); // Example menu interaction
    });
  </script>
</body>
</html>
EOL

# Create globals.js
cat <<EOL > js/globals.js
// Shared global variables
export const Globals = {
  currentTool: 'pencil',
  canvas: null,
  timeline: [],
};
EOL

# Create tools.js
cat <<EOL > js/tools.js
import { Globals } from './globals.js';

// A function to use a tool
export function useTool(toolName) {
  console.log(\`Using tool: \${toolName}\`);
  Globals.currentTool = toolName;
}
EOL

# Create menu.js
cat <<EOL > js/menu.js
import { useTool } from './tools.js';

// Function triggered when a menu option is selected
export function menuOptionSelected(toolName) {
  console.log(\`Menu option selected: \${toolName}\`);

  // Call the \`useTool\` function from tools.js
  useTool(toolName);
}

// Example: Attach event listeners for menu options
document.addEventListener('DOMContentLoaded', () => {
  const button = document.createElement('button');
  button.textContent = 'Select Eraser';
  button.onclick = () => menuOptionSelected('eraser');
  document.body.appendChild(button);
});
EOL

# Create canvas.js
cat <<EOL > js/canvas.js
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
EOL

# Create timeline.js
cat <<EOL > js/timeline.js
import { Globals } from './globals.js';

// Example timeline function
export function addTimelineEvent(event) {
  Globals.timeline.push(event);
  console.log('Timeline updated:', Globals.timeline);
}
EOL

# Output success message
echo "Project '$PROJECT_NAME' has been created successfully!"
