import GameObject from "./GameObject";
import { distanceBetweenPoints } from "../services/Utils";
import type CanvasWrapper from "./CanvasWrapper";

export default class RigidBody extends GameObject {
  nearbyObjectsThreshold: number;
  force: Vector2;
  mass: number;
  minSpeed: number;
  maxSpeed: number;
  constructor(transform: Vector2, size: number) {
    super(transform, size);
    this.nearbyObjectsThreshold = 256;
    this.force = { x: 0, y: 0 };
    this.mass = 1;
    this.minSpeed = 0.1;
    this.maxSpeed = 10;
  }

  get speed() {
    return Math.abs(this.vector.x) + Math.abs(this.vector.y)
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

  collideMass(a: RigidBody, b: RigidBody) {
    const m1 = a.mass;
    const m2 = b.mass;
    const x = a.transform.x - b.transform.x;
    const y = a.transform.y - b.transform.y;
    const d = Math.pow(x, 2) + Math.pow(y, 2);

    const u1 = (a.vector.x * x + a.vector.y * y) / d;
    const u2 = (x * a.vector.y - y * a.vector.x) / d;
    const u3 = (b.vector.x * x + b.vector.y * y) / d;
    const u4 = (x * b.vector.y - y * b.vector.x) / d;

    const mm = m1 + m2;
    const vu3 = ((m1 - m2) / mm) * u1 + ((2 * m2) / mm) * u3;
    const vu1 = ((m2 - m1) / mm) * u3 + ((2 * m1) / mm) * u1;

    // resolve overlap
    const distance = Math.sqrt(
      (a.transform.x - b.transform.x) * (a.transform.x - b.transform.x) +
        (a.transform.y - b.transform.y) * (a.transform.y - b.transform.y)
    );
    const overlap = 0.5 * (distance - a.size / 2 - b.size / 2);

    a.transform.x -= (overlap * (a.transform.x - b.transform.x)) / distance;
    a.transform.y -= (overlap * (a.transform.y - b.transform.y)) / distance;

    b.transform.x += (overlap * (a.transform.x - b.transform.x)) / distance;
    b.transform.y += (overlap * (a.transform.y - b.transform.y)) / distance;

    // set new vectors
    b.vector = {
      x: x * vu1 - y * u4,
      y: y * vu1 + x * u4,
    };
    a.vector = {
      x: x * vu3 - y * u2,
      y: y * vu3 + x * u2,
    };

    const newX = a.transform.x - b.transform.x;
    const newY = a.transform.y - b.transform.y;
    // const newd = Math.pow(newX, 2) + Math.pow(newY, 2);
    const dist = Math.sqrt(Math.pow(newX, 2) + Math.pow(newY, 2));

    if (dist < a.size / 2 + b.size / 2) {
      console.log("invalid collision!");
      console.log(
        "dist after collision:",
        dist,
        "should be over:",
        a.size / 2 + b.size / 2
      );
    }
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
    this.vector.x += this.force.x;
    this.vector.y += this.force.y;

    // if we are not accelerating and speed is below min, stop
    if (
      this.force.x === 0 &&
      this.force.y === 0 &&
      Math.abs(this.vector.x) < this.minSpeed &&
      Math.abs(this.vector.y) < this.minSpeed
    ) {
      this.vector.x = 0;
      this.vector.y = 0;
    }

    // limit max speed
    if (this.speed > this.maxSpeed) {
      const overSpeed = this.speed - this.maxSpeed;
      this.vector.x *= (1 - overSpeed) / 2;
      this.vector.y *= (1 - overSpeed) / 2;
    }

    this.rotation += this.torque * dt;
    this.transform.x += this.vector.x * dt;
    this.transform.y += this.vector.y * dt;
  }
  public update(dt: number, canvas: CanvasWrapper, gameObjects: GameObject[]) {
    if (this.isMoving)
      this.handleCollision(
        gameObjects.filter((go) => go instanceof RigidBody) as RigidBody[]
      );
    this.handleInput(canvas);
    this.updateTransform(dt);
  }
}
