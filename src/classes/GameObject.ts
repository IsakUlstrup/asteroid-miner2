import type CanvasWrapper from "./CanvasWrapper";
import { distanceBetweenPoints } from "../services/Utils";
import config from "../config";

export default class GameObject {
  public transform: Vector2;
  public vector: Vector2;
  public acceleration: Vector2;
  public rotation: number;
  public torque: number;
  public size: number;
  protected bufferCanvas: HTMLCanvasElement;
  constructor(transform: Vector2, size = 64) {
    this.size = Math.round(size);
    this.bufferCanvas = this.render();
    this.transform = transform;
    this.vector = { x: 0, y: 0 };
    this.acceleration = { x: 0, y: 0 };
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
  public collisionDetection(source: GameObject, objects: GameObject[]) {
    return objects.filter((o) => {
      return distanceBetweenPoints(source.transform, o.transform) <
        source.size / 2 + o.size / 2
        ? true
        : false;
    });
  }
  public update(dt: number, canvas: CanvasWrapper, gameObjects: GameObject[]) {
    this.transform.x += this.vector.x * dt;
    this.transform.y += this.vector.y * dt;
    this.rotation += this.torque * dt;
  }
  public draw(context: CanvasRenderingContext2D, cameraPosition: Vector2) {
    const relativePosition = {
      x: this.transform.x - this.size / 2 - cameraPosition.x,
      y: this.transform.y - this.size / 2 - cameraPosition.y,
    };

    context.save();
    context.translate(
      relativePosition.x + this.size / 2,
      relativePosition.y + this.size / 2
    );
    context.rotate(this.rotation);
    context.translate(
      -(relativePosition.x + this.size / 2),
      -(relativePosition.y + this.size / 2)
    );

    context.drawImage(
      this.bufferCanvas,
      relativePosition.x,
      relativePosition.y
    );

    if (config.debug) {
      context.beginPath();
      context.arc(
        relativePosition.x + this.size / 2,
        relativePosition.y + this.size / 2,
        5,
        0,
        2 * Math.PI
      );
      context.strokeStyle = "rgb(250, 0, 0)";
      context.stroke();
    }
    context.restore();
  }
}
