import RigidBody from "../engine/RigidBody";

export default class DestroyableObject extends RigidBody {
  maxHitPoints: number;
  hitPoints: number;
  constructor(transform: Vector2, size = 64) {
    super(transform, size);
    this.maxHitPoints = 100;
    this.hitPoints = this.maxHitPoints;
  }

  get isAlive() {
    return this.hitPoints > 0;
  }
}
