import { Globals } from './globals.js';

// A function to use a tool
export function useTool(toolName) {
  console.log(`Using tool: ${toolName}`);
  Globals.currentTool = toolName;
}
