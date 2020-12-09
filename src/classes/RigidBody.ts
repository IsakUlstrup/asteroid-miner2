import GameObject from "./GameObject";
import { distanceBetweenPoints } from "../services/Utils";
import type CanvasWrapper from "./CanvasWrapper";

export default class RigidBody extends GameObject {
  nearbyObjectsThreshold: number;
  force: Vector2;
  mass: number;
  // hit: RigidBody;
  constructor(transform: Vector2, size: number) {
    super(transform, size);
    this.nearbyObjectsThreshold = 128;
    this.force = { x: 0, y: 0 };
    // this.hit = undefined;
    this.mass = 1;
  }

  public getNearbyBodies(
    position: Vector2,
    rigidBodies: RigidBody[],
    limit: number
  ) {
    return rigidBodies.filter((body) => {
      const distance = distanceBetweenPoints(position, body.transform);
      return distance < limit && body !== this;
    });
  }
  public collisionDetection(source: RigidBody, bodies: RigidBody[]) {
    return bodies.filter((body) => {
      return distanceBetweenPoints(source.transform, body.transform) <
        source.size / 2 + body.size / 2
        ? true
        : false;
    });
  }
  // https://stackoverflow.com/questions/60727534/balls-bouncing-off-of-each-other
  collideMass(a: RigidBody, b: RigidBody) {
    const m1 = a.mass;
    const m2 = b.mass;
    const x = a.transform.x - b.transform.x;
    const y = a.transform.y - b.transform.y;
    const d = x * x + y * y;

    const u1 = (a.vector.x * x + a.vector.y * y) / d;
    const u2 = (x * a.vector.y - y * a.vector.x) / d;
    const u3 = (b.vector.x * x + b.vector.y * y) / d;
    const u4 = (x * b.vector.y - y * b.vector.x) / d;

    const mm = m1 + m2;
    const vu3 = ((m1 - m2) / mm) * u1 + ((2 * m2) / mm) * u3;
    const vu1 = ((m2 - m1) / mm) * u3 + ((2 * m1) / mm) * u1;

    b.vector = {
      x: x * vu1 - y * u4,
      y: y * vu1 + x * u4,
    };

    a.vector = {
      x: x * vu3 - y * u2,
      y: y * vu3 + x * u2,
    };
  }
  protected handleCollision(rigidBodies: RigidBody[]) {
    // collision detection, only if we are moving
    if (Math.abs(this.vector.x) > 0 || Math.abs(this.vector.y) > 0) {
      const nearby = this.getNearbyBodies(
        this.transform,
        rigidBodies,
        this.nearbyObjectsThreshold
      );
      if (nearby.length > 0) {
        const hits = this.collisionDetection(this, nearby);
        if (hits.length > 0) {
          hits.forEach((h) => this.collideMass(this, h));
        }
      }
    }
  }
  updateTransform(dt: number) {
    this.vector.x += this.mass * this.force.x;
    this.vector.y += this.mass * this.force.y;

    // if we are not accelerating and moving really slow, stop
    if (
      this.force.x === 0 &&
      this.force.y === 0 &&
      Math.abs(this.vector.x) < 0.1 &&
      Math.abs(this.vector.y) < 0.1
    ) {
      this.vector.x = 0;
      this.vector.y = 0;
    }

    this.transform.x += this.vector.x * dt;
    this.transform.y += this.vector.y * dt;
    this.rotation += this.torque * dt;
  }
  public update(dt: number, canvas: CanvasWrapper, gameObjects: GameObject[]) {
    this.handleCollision(
      gameObjects.filter((go) => go instanceof RigidBody) as RigidBody[]
    );
    this.handleInput(canvas);
    this.updateTransform(dt);
  }
}
