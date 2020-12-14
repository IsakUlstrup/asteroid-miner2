import GameObject from "../engine/GameObject";
import type Game from "./Game";

export default class Module extends GameObject {
  positionOffset: Vector2;
  parent: GameObject;
  effect: number;
  powerModifier: number;
  active: boolean;
  constructor(offset: Vector2, parent: GameObject, effect = 1, size = 16) {
    super(parent.transform, size);
    this.positionOffset = offset;
    this.parent = parent;
    this.effect = effect;
    this.active = false;
    this.powerModifier = 1;
  }

  public get derivedEffect() {
    return this.effect * this.powerModifier;
  }

  setPowerModifier(power) {
    this.powerModifier = power;
  }
  use() {
    return 0;
  }
}
