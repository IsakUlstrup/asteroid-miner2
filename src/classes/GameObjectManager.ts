import type GameObject from "./GameObject";
import CanvasWrapper from "./CanvasWrapper";
import PinchZoom from "../services/PinchZoom";

export default class GameObjectManager {
  private canvas: CanvasWrapper;
  private gameObjects: GameObject[] = [];
  private cameraPosition: Vector2;
  private cameraZoom: number;
  private pinchZoom: PinchZoom;
  constructor(context: CanvasRenderingContext2D, cameraPosition: Vector2, cameraZoom: number) {
    this.cameraPosition = cameraPosition;
    this.cameraZoom = cameraZoom;
    this.canvas = new CanvasWrapper(context, window.devicePixelRatio || 1);
    this.pinchZoom = new PinchZoom(context.canvas, (zoomModifier: number) => {
      console.log(zoomModifier);
      this.zoom(zoomModifier);
    });
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
  public zoom(level: number) {
    this.cameraZoom += level;
    if (this.cameraZoom < 0.1 * window.devicePixelRatio) this.cameraZoom = 0.1 * window.devicePixelRatio;
    if (this.cameraZoom > 2 * window.devicePixelRatio) this.cameraZoom = window.devicePixelRatio * 2;
  }
  public addGameObject(object: GameObject) {
    this.gameObjects.push(object);
  }
  public removeGameObject(object: GameObject) {
    const index = this.gameObjects.indexOf(object)
    if (index) this.gameObjects.splice(index, 1);
  }
}