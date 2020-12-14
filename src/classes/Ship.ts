import DestroyableObject from "./DestroyableObject";
import type Module from "./Module";

export default class Ship extends DestroyableObject {
  modules: Module[];
  constructor(transform: Vector2, size = 64) {
    super(transform, size);
    this.modules = [];
  }

  addModule(module: Module) {
    this.modules.push(module);
  }
}
