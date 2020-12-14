import GameObject from "../engine/GameObject";

export default class Module extends GameObject {
  constructor(transform: Vector2, size = 16) {
    super(transform, size);
  }
}
