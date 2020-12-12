// provides scaled canvas size, cursor tracking
import CursorTracker from "../services/CursorTracker";
import ZoomTracker from "../services/ZoomTracker";
import config from "../config";

export default class CanasWrapper {
  public context: CanvasRenderingContext2D;
  public cursor: CursorTracker;
  public resolutionScale: number;
  public cameraZoom: number;
  public zoom: ZoomTracker;
  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
    this.resolutionScale = window.devicePixelRatio || 1;
    this.cursor = new CursorTracker(this.context.canvas, this.resolutionScale);
    this.cameraZoom = config.defaultCameraZoom;
    this.zoom = new ZoomTracker(context.canvas, (zoomModifier: number) => {
      this.setZoom(zoomModifier);
    });
  }

  public setZoom(level: number) {
    this.cameraZoom += level * this.resolutionScale;
    if (this.cameraZoom < 0.1 * window.devicePixelRatio)
      this.cameraZoom = 0.1 * window.devicePixelRatio;
    if (this.cameraZoom > 1 * window.devicePixelRatio)
      this.cameraZoom = window.devicePixelRatio * 1;
  }
  get size() {
    return {
      width: this.context.canvas.width * (1 / this.resolutionScale),
      height: this.context.canvas.height * (1 / this.resolutionScale),
    };
  }
}
