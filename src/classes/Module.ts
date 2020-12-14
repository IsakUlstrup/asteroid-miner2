import GameObject from "../engine/GameObject";
import type Game from "./Game";

export default class Module extends GameObject {
  positionOffset: Vector2;
  parent: GameObject;
  constructor(offset: Vector2, parent: GameObject, size = 16) {
    super(parent.transform, size);
    this.positionOffset = offset;
    this.parent = parent;
  }

  use() {
    return;
  }
}
