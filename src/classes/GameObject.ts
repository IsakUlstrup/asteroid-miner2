import type CanvasWrapper from "./CanvasWrapper";
import { distanceBetweenPoints, circlesIntersect } from "../services/Utils";

export default class GameObject {
  public transform: Vector2;
  public vector: Vector2;
  public acceleration: Vector2;
  public rotation: number;
  public size: number;
  protected bufferCanvas: HTMLCanvasElement;
  constructor(transform: Vector2, size = 64) {
    this.size = Math.round(size);
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
  public getNearbyObjects(position: Vector2, gameObjects: GameObject[], limit: number) {
    return gameObjects.filter(go => {
      const distance = distanceBetweenPoints(position, go.transform);
      return distance < limit && go !== this;
    });
  }
  public collisionDetection(source: GameObject, objects: GameObject[]) {
    return objects.filter(o => () => {
      return circlesIntersect(source.transform.x, source.transform.y, source.size, o.transform.x, o.transform.y, o.size);
    });
  }
  public update(dt: number, canvas: CanvasWrapper, gameObjects: GameObject[]) {
    this.transform.x += this.vector.x * dt;
    this.transform.y += this.vector.y * dt;
  }
  public draw(context: CanvasRenderingContext2D, cameraPosition: Vector2) {
    // context.rotate(this.rotation);
    context.drawImage(
      this.bufferCanvas,
      this.transform.x - this.size / 2 - cameraPosition.x,
      this.transform.y  - this.size / 2 - cameraPosition.y
    );
  }
}