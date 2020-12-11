import type GameObject from "./GameObject";
import CanvasWrapper from "./CanvasWrapper";
import config from "../config";
import { distanceBetweenPoints } from "../services/Utils";

export default class GameObjectManager {
  private canvas: CanvasWrapper;
  public gameObjects: GameObject[] = [];
  public parallaxObjects: GameObject[] = [];
  private parallaxAmount: number;
  private cameraPosition: Vector2;
  constructor(context: CanvasRenderingContext2D, cameraPosition: Vector2) {
    this.cameraPosition = cameraPosition;
    this.canvas = new CanvasWrapper(context);
    // 0 background, 1 foreground
    this.parallaxAmount = 0.6;
  }

  public update(dt: number) {
    this.updateObjects.forEach((object) =>
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

    // camera position for parallax objects
    this.canvas.context.translate(
      this.canvas.context.canvas.width / 2 / this.canvas.cameraZoom -
        this.cameraPosition.x * this.parallaxAmount,
      this.canvas.context.canvas.height / 2 / this.canvas.cameraZoom -
        this.cameraPosition.y * this.parallaxAmount
    );

    // parallax objects
    this.parallaxObjects.forEach((object) => {
      object.draw(this.canvas.context);
    });

    // camera position for normal objects
    this.canvas.context.translate(
      -(this.cameraPosition.x * (1 - this.parallaxAmount)),
      -(this.cameraPosition.y * (1 - this.parallaxAmount))
    );

    // draw gameObjects
    this.onScreenObjects.forEach((object) => {
      object.draw(this.canvas.context);
    });

    if (config.debug) {
      // onscreen object statistics
      console.log(
        "onscreen objects:",
        this.onScreenObjects.length,
        "/",
        this.gameObjects.length,
        "\nUpdated objects:",
        this.updateObjects.length,
        "/",
        this.gameObjects.length
      );

      // draw distance
      const context = this.canvas.context;
      context.beginPath();
      context.arc(
        this.cameraPosition.x,
        this.cameraPosition.y,
        this.drawDistance,
        0,
        2 * Math.PI
      );
      context.strokeStyle = "rgb(250, 0, 0)";
      context.stroke();
    }
  }
  public addGameObject(object: GameObject) {
    this.gameObjects.push(object);
  }
  public addParallaxObject(object: GameObject) {
    this.parallaxObjects.push(object);
  }
  public removeGameObject(object: GameObject) {
    const index = this.gameObjects.indexOf(object);
    if (index) this.gameObjects.splice(index, 1);
  }
  get drawDistance() {
    const center = {
      x: this.canvas.context.canvas.width / 2,
      y: this.canvas.context.canvas.height / 2,
    };

    return (
      distanceBetweenPoints({ x: 0, y: 0 }, center) *
      config.drawDistanceModifier *
      (1 / this.canvas.cameraZoom)
    );
  }
  get onScreenObjects() {
    return this.updateObjects.filter((o) => {
      if (
        distanceBetweenPoints(this.cameraPosition, o.transform) <
        this.drawDistance + o.radius
      ) {
        return o;
      }
    });
  }
  get updateObjects() {
    return this.gameObjects.filter((o) => {
      if (
        distanceBetweenPoints(this.cameraPosition, o.transform) <
        config.updateDistance * (1 / this.canvas.cameraZoom)
      ) {
        return o;
      }
    });
  }
  get objects() {
    return this.gameObjects;
  }
}
