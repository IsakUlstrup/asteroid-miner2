import GameObject from "../engine/GameObject";
import type Game from "./Game";

export default class Module extends GameObject {
  positionOffset: Vector2;
  parent: GameObject;
  effect: number;
  constructor(offset: Vector2, parent: GameObject, effect = 1, size = 16) {
    super(parent.transform, size);
    this.positionOffset = offset;
    this.parent = parent;
    this.effect = effect;
  }

  use() {
    return 0;
  }
}
