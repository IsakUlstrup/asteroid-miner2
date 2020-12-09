import GameObject from "./GameObject";
import { distanceBetweenPoints } from "../services/Utils";
import type CanvasWrapper from "./CanvasWrapper";

export default class RigidBody extends GameObject {
  nearbyObjectsThreshold: number;
  force: Vector2;
  hit: RigidBody;
  constructor(transform: Vector2, size: number) {
    super(transform, size);
    this.nearbyObjectsThreshold = 128;
    this.force = { x: 0, y: 0 };
    this.hit = undefined;
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
          this.hit = hits[0];
          const distance = Math.abs(
            distanceBetweenPoints(this.transform, this.hit.transform) -
              (this.size / 2 + this.hit.size / 2)
          );
          this.vector.x = -this.vector.x / 2;
          this.vector.y = -this.vector.y / 2;
          // move ship away from object to prevent it getting stick inside
          this.transform.x += this.vector.x * (distance + 10);
          this.transform.y += this.vector.y * (distance + 10);
        } else {
          this.hit = undefined;
        }
      } else {
        this.hit = undefined;
      }
    }
  }
  updateTransform(dt: number) {
    this.vector.x += this.force.x;
    this.vector.y += this.force.y;

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
