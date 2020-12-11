import type CanvasWrapper from "./CanvasWrapper";
import { distanceBetweenPoints } from "../services/Utils";
import config from "../config";

export default class GameObject {
  public transform: Vector2;
  public vector: Vector2;
  public rotation: number;
  public torque: number;
  public size: number;
  protected bufferCanvas: HTMLCanvasElement;
  constructor(transform: Vector2, size = 64) {
    this.size = Math.round(size);
    this.bufferCanvas = this.render();
    this.transform = transform;
    this.vector = { x: 0, y: 0 };
    this.rotation = 0;
    this.torque = 0;
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
  public getNearbyObjects(
    position: Vector2,
    gameObjects: GameObject[],
    limit: number
  ) {
    return gameObjects.filter((go) => {
      const distance = distanceBetweenPoints(position, go.transform);
      return distance < limit && go !== this;
    });
  }
  handleInput(canvas: CanvasWrapper) {
    return;
  }
  protected updateTransform(dt: number) {
    this.transform.x += this.vector.x * dt;
    this.transform.y += this.vector.y * dt;
    this.rotation += this.torque * dt;
  }
  public update(dt: number, canvas: CanvasWrapper, gameObjects: GameObject[]) {
    this.handleInput(canvas);
    this.updateTransform(dt);
  }
  public rotateContext(context: CanvasRenderingContext2D, radian: number) {
    // rotation
    context.save();
    context.translate(this.transform.x, this.transform.y);
    context.rotate(radian);
    context.translate(-this.transform.x, -this.transform.y);
  }
  public drawDebug(context: CanvasRenderingContext2D) {
    // object center
    context.beginPath();
    context.arc(this.transform.x, this.transform.y, 3, 0, 2 * Math.PI);
    context.strokeStyle = "rgb(250, 0, 0)";
    context.stroke();

    // vector
    context.strokeStyle = "white";
    context.lineCap = "round";
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(this.transform.x, this.transform.y);
    context.lineTo(
      this.transform.x + this.vector.x * 500,
      this.transform.y + this.vector.y * 500
    );
    context.stroke();

    // size
    context.lineWidth = 1;
    context.beginPath();
    context.arc(
      this.transform.x,
      this.transform.y,
      this.radius,
      0,
      2 * Math.PI
    );
    context.strokeStyle = "white";
    context.stroke();
  }
  public draw(context: CanvasRenderingContext2D) {
    this.rotateContext(context, this.rotation);

    // draw buffer canvas
    context.drawImage(
      this.bufferCanvas,
      Math.round(this.transform.x - this.size / 2),
      Math.round(this.transform.y - this.size / 2)
    );
    context.restore();
    if (config.debug) this.drawDebug(context);
  }
  get radius() {
    return this.size / 2;
  }
  get isMoving() {
    return Math.abs(this.vector.x) > 0 || Math.abs(this.vector.y) > 0
      ? true
      : false;
  }
}
