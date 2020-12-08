// provides scaled canvas size, cursor tracking
import CursorTracker from "../services/CursorTracker";

export default class CanasWrapper {
  context: CanvasRenderingContext2D;
  cursor: CursorTracker;
  resolutionScale: number;
  constructor(context: CanvasRenderingContext2D, resolutionScale: number) {
    this.context = context;
    this.cursor = new CursorTracker(this.context.canvas, resolutionScale);
    this.resolutionScale = resolutionScale;
  }

  get size() {
    return {
      width: this.context.canvas.width * (1 / this.resolutionScale),
      height: this.context.canvas.height * (1 / this.resolutionScale)
    };
  }
}
