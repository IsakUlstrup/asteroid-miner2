import type GameObject from "../engine/GameObject";
import Module from "./Module";
import type CanvasWrapper from "../engine/CanvasWrapper";
import DestroyableObject from "./DestroyableObject";
import { isWithinCircle } from "../services/Utils";

export default class Laser extends Module {
  range: number;
  targetVector: Vector2;
  hitDistance: number;
  hit: DestroyableObject | undefined;
  constructor(offset: Vector2, parent: GameObject) {
    super(offset, parent, 1);
    this.color.rgb(255, 0, 0);
    this.range = 500;
  }

  private hitScan(objects: DestroyableObject[]) {
    const nearby = this.getNearbyObjects(
      this.parent.transform,
      objects,
      this.range
    ) as DestroyableObject[];
    let distance = 0;
    for (distance; distance < this.range; distance += 1) {
      for (let index = 0; index < nearby.length; index++) {
        const obj = nearby[index];
        const hit = isWithinCircle(
          this.parent.transform.x + this.targetVector.x * distance,
          this.parent.transform.y + this.targetVector.y * distance,
          obj.transform.x,
          obj.transform.y,
          obj.radius
        );
        if (hit) {
          // console.log("hit", distance);
          this.hitDistance = distance;
          return obj;
        }
      }
    }
    // console.log(distance);
    this.hitDistance = distance;
    return undefined;
  }
  public update(dt: number, canvas: CanvasWrapper, gameObjects: GameObject[]) {
    if (canvas.cursor.active) {
      this.targetVector = {
        x: Math.cos(this.parent.rotation),
        y: Math.sin(this.parent.rotation),
      };
      const possibleTargets = gameObjects.filter(
        (o) => o instanceof DestroyableObject && o !== this.parent
      ) as DestroyableObject[];
      this.hit = this.hitScan(possibleTargets);
      this.active = true;
    } else {
      this.active = false;
    }
  }
  public draw(context: CanvasRenderingContext2D) {
    if (!this.active) return;

    context.save();
    // context.translate(this.parent.transform.x, this.parent.transform.y);
    context.strokeStyle = this.color.rgbString;
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(this.parent.transform.x, this.parent.transform.y);
    context.lineTo(
      this.parent.transform.x + this.targetVector.x * this.hitDistance,
      this.parent.transform.y + this.targetVector.y * this.hitDistance
    );
    context.stroke();

    // laser hit
    if (this.hit) {
      context.beginPath();
      context.arc(
        this.parent.transform.x + this.targetVector.x * this.hitDistance,
        this.parent.transform.y + this.targetVector.y * this.hitDistance,
        5,
        0,
        2 * Math.PI
      );
      context.fillStyle = this.color.rgbString;
      context.fill();
      context.restore();
    }
  }
}
