import type CursorTracker from "../services/CursorTracker";
import type CanvasWrapper from "./CanvasWrapper";

export default class GameObject {
  public transform: Vector2;
  public vector: Vector2;
  public acceleration: Vector2;
  public rotation: number;
  public size: number;
  protected bufferCanvas: HTMLCanvasElement;
  constructor(transform: Vector2, size = 64) {
    this.size = size;
    this.bufferCanvas = this.render();
    this.transform = transform;
    this.vector = {x: 0, y: 0};
    this.acceleration = {x: 0, y: 0};
    this.rotation = 0;
  }
  protected render() {
    const offScreenCanvas = document.createElement("canvas");
    offScreenCanvas.width = this.size;
    offScreenCanvas.height = this.size;
    const context = offScreenCanvas.getContext("2d");
    context.fillStyle = "rgb(50, 50, 50)";
    context.fillRect(0, 0, this.size, this.size);
    return offScreenCanvas;
  }
  public update(dt: number, canvas: CanvasWrapper) {
    this.transform.x += this.vector.x * dt;
    this.transform.y += this.vector.y * dt;
  }
  public draw(context: CanvasRenderingContext2D, cameraPosition: Vector2) {
    context.rotate(this.rotation);
    context.drawImage(
      this.bufferCanvas,
      this.transform.x - this.size / 2 - cameraPosition.x,
      this.transform.y  - this.size / 2 - cameraPosition.y
    );
  }
}