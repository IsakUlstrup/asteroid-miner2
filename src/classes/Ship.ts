import DestroyableObject from "./DestroyableObject";
import type Module from "./Module";

export default class Ship extends DestroyableObject {
  modules: Module[];
  constructor(transform: Vector2, size = 64, color = { r: 255, g: 0, b: 0 }) {
    super(transform, size, color);
    this.modules = [];
  }

  addModule(module: Module) {
    this.modules.push(module);
  }
}
