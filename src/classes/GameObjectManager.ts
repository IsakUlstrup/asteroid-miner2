import type GameObject from "./GameObject";
// import CursorTracker from "../services/CursorTracker";
import CanvasWrapper from "./CanvasWrapper";

export default class GameObjectManager {
  private canvas: CanvasWrapper;
  private gameObjects: GameObject[] = [];
  private cameraPosition: Vector2;
  private cameraZoom: number;
  constructor(context: CanvasRenderingContext2D, cameraPosition: Vector2) {
    this.cameraPosition = cameraPosition;
    this.cameraZoom = 0.5 * window.devicePixelRatio || 1;
    this.canvas = new CanvasWrapper(context, window.devicePixelRatio || 1);
  }
  public update(dt: number) {
    this.gameObjects.forEach(object => object.update(dt, this.canvas));
  }
  public draw() {
    this.canvas.context.setTransform(1,0,0,1,0,0)
    this.canvas.context.clearRect(0, 0, this.canvas.context.canvas.width, this.canvas.context.canvas.height);
    this.canvas.context.scale(this.cameraZoom, this.cameraZoom);
    this.canvas.context.translate((this.canvas.context.canvas.width / 2) / this.cameraZoom, (this.canvas.context.canvas.height / 2 ) / this.cameraZoom); 

    this.gameObjects.forEach(object => {
      object.draw(this.canvas.context, this.cameraPosition);
    });
  }
  public addGameObject(object: GameObject) {
    this.gameObjects.push(object);
  }
  public removeGameObject(object: GameObject) {
    const index = this.gameObjects.indexOf(object)
    if (index) this.gameObjects.splice(index, 1);
  }
}