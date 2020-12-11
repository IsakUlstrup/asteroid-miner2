import type GameObject from "./GameObject";
import CanvasWrapper from "./CanvasWrapper";

export default class GameObjectManager {
  private canvas: CanvasWrapper;
  private gameObjects: GameObject[] = [];
  private cameraPosition: Vector2;
  constructor(context: CanvasRenderingContext2D, cameraPosition: Vector2) {
    this.cameraPosition = cameraPosition;
    this.canvas = new CanvasWrapper(context);
  }

  public update(dt: number) {
    this.gameObjects.forEach((object) =>
      object.update(dt, this.canvas, this.gameObjects)
    );
  }
  public draw() {
    // reset context
    this.canvas.context.setTransform(1, 0, 0, 1, 0, 0);
    this.canvas.context.clearRect(
      0,
      0,
      this.canvas.context.canvas.width,
      this.canvas.context.canvas.height
    );
    // zoom
    this.canvas.context.scale(this.canvas.cameraZoom, this.canvas.cameraZoom);

    // camera position
    this.canvas.context.translate(
      this.canvas.context.canvas.width / 2 / this.canvas.cameraZoom -
        this.cameraPosition.x,
      this.canvas.context.canvas.height / 2 / this.canvas.cameraZoom -
        this.cameraPosition.y
    );

    // draw gameObjects
    this.gameObjects.forEach((object) => {
      object.draw(this.canvas.context);
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
