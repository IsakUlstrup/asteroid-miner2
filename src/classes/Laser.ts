import type GameObject from "../engine/GameObject";
import Module from "./Module";
import type CanvasWrapper from "../engine/CanvasWrapper";
import DestroyableObject from "./DestroyableObject";
import { isWithinCircle } from "../services/Utils";
import type Ship from "./Ship";
import ParticleEmitter from "../engine/ParticleEmitter";

export default class Laser extends Module {
  range: number;
  targetVector: Vector2;
  hitDistance: number;
  hit: DestroyableObject | undefined;
  particleEmitter: ParticleEmitter;
  constructor(offset: Vector2, parent: Ship) {
    super(offset, parent, 1);
    this.color.rgb(255, 0, 0);
    this.range = 500;
    this.particleEmitter = new ParticleEmitter(
      this.transform,
      this.color.rgbObject
    );
  }

  get derivedRange() {
    return this.range * this.powerModifier;
  }

  private hitScan(objects: DestroyableObject[]) {
    if (objects.length <= 0) {
      this.hitDistance = this.derivedRange;
      return;
    }
    let distance = 0;
    for (distance; distance < this.derivedRange; distance += 5) {
      for (let index = 0; index < objects.length; index++) {
        const obj = objects[index];
        const hit = isWithinCircle(
          this.parent.transform.x + this.targetVector.x * distance,
          this.parent.transform.y + this.targetVector.y * distance,
          obj.transform.x,
          obj.transform.y,
          obj.radius
        );
        this.hitDistance = distance;
        if (hit) {
          return obj;
        }
      }
    }
    return undefined;
  }
  public update(dt: number, canvas: CanvasWrapper, gameObjects: GameObject[]) {
    this.particleEmitter.update(dt);
    if (canvas.cursor.active) {
      this.targetVector = {
        x: Math.cos(this.parent.rotation),
        y: Math.sin(this.parent.rotation),
      };
      const possibleTargets = gameObjects.filter(
        (o) => o instanceof DestroyableObject && o !== this.parent
      ) as DestroyableObject[];
      const nearby = this.getNearbyObjects(
        this.parent.transform,
        possibleTargets,
        this.range * 1.2
      ) as DestroyableObject[];
      this.hit = this.hitScan(nearby);
      if (this.hit) {
        this.hit.hit(1, this.parent);
        this.particleEmitter.emit(
          {
            x: this.parent.transform.x + this.targetVector.x * this.hitDistance,
            y: this.parent.transform.y + this.targetVector.y * this.hitDistance,
          },
          {
            x: (Math.random() - 0.5) * 0.3,
            y: (Math.random() - 0.5) * 0.3,
          },
          this.hit.color.rgbObject
        );
      }
      this.active = true;
    } else {
      this.active = false;
    }
  }
  public draw(context: CanvasRenderingContext2D) {
    this.particleEmitter.draw(context);
    if (!this.active || this.derivedEffect <= 0) return;

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
