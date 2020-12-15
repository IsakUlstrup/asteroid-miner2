import DestroyableObject from "./DestroyableObject";
import type Module from "./Module";
import type CanvasWrapper from "../engine/CanvasWrapper";
import type GameObject from "../engine/GameObject";
import RigidBody from "../engine/RigidBody";

export default class Ship extends DestroyableObject {
  modules: Module[];
  constructor(transform: Vector2, size = 64, color = { r: 255, g: 0, b: 0 }) {
    super(transform, size, color);
    this.modules = [];
  }

  addModule(module: Module) {
    this.modules.push(module);
  }
  public update(dt: number, canvas: CanvasWrapper, gameObjects: GameObject[]) {
    if (!this.isAlive) {
      this.destroy(gameObjects);
      return;
    }
    this.handleCollision(
      gameObjects.filter((go) => go instanceof RigidBody) as RigidBody[]
    );
    this.handleInput(canvas);
    this.modules.forEach((m) => m.update(dt, canvas, gameObjects));
    this.updateTransform(dt);
  }
}
