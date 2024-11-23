import { Globals } from './globals.js';

// Example timeline function
export function addTimelineEvent(event) {
  Globals.timeline.push(event);
  console.log('Timeline updated:', Globals.timeline);
}
