import GameObject from "./GameObject";
import { distanceBetweenPoints } from "../services/Utils";

export default class RigidBody extends GameObject {
  nearbyObjectsThreshold: number;
  hit: RigidBody;
  constructor(transform: Vector2, size: number) {
    super(transform, size);
    this.nearbyObjectsThreshold = 128;
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
  private handleCollision(rigidBodies: RigidBody[]) {
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
        }
      } else {
        this.hit = undefined;
      }
    }
  }
}
