import type GameObject from "../engine/GameObject";
import type CanvasWrapper from "../engine/CanvasWrapper";
import config from "../config";
import { radianToPoint } from "../services/Utils";
import RigidBody from "../engine/RigidBody";
import ParticleEmitter from "../engine/ParticleEmitter";
import DestroyableObject from "./DestroyableObject";

export default class PlayerShip extends DestroyableObject {
  accelerationModifier: number;
  engineParticleEmitter: ParticleEmitter;
  constructor(transform: Vector2) {
    super(transform, 32);
    this.accelerationModifier = 0.1;
    this.mass = 1;
    this.engineParticleEmitter = new ParticleEmitter(this.transform);
    this.minSpeed = 0.1;
    this.maxSpeed = 10;
  }

  protected render() {
    const offScreenCanvas = document.createElement("canvas");
    offScreenCanvas.width = this.size;
    offScreenCanvas.height = this.size;
    if (config.debug) {
      const context = offScreenCanvas.getContext("2d");
      context.beginPath();
      context.arc(this.size / 2, this.size / 2, this.size / 2, 0, 2 * Math.PI);
      context.strokeStyle = "rgb(50, 50, 50)";
      context.stroke();
    }
    const context = offScreenCanvas.getContext("2d");
    context.fillStyle = "rgb(255, 255, 255)";
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(this.size, this.size / 2);
    context.lineTo(0, this.size);
    context.lineTo(10, this.size / 2);
    context.closePath();
    context.fill();
    return offScreenCanvas;
  }
  handleInput(canvas: CanvasWrapper) {
    this.rotation = radianToPoint(
      canvas.size.width / 2,
      canvas.size.height / 2,
      canvas.cursor.position.x,
      canvas.cursor.position.y
    );

    if (canvas.cursor.active) {
      this.engineParticleEmitter.emit();
      const force = {
        x:
          (canvas.cursor.position.x / canvas.size.width - 0.5) *
          this.accelerationModifier,
        y:
          (canvas.cursor.position.y / canvas.size.height - 0.5) *
          this.accelerationModifier,
      };

      this.force.x = force.x / this.mass;
      this.force.y = force.y / this.mass;
    } else {
      this.force.x = 0;
      this.force.y = 0;
    }
  }
  public update(dt: number, canvas: CanvasWrapper, gameObjects: GameObject[]) {
    this.handleCollision(
      gameObjects.filter((go) => go instanceof RigidBody) as RigidBody[]
    );
    this.handleInput(canvas);
    this.engineParticleEmitter.update(dt);
    this.updateTransform(dt);
  }
  public draw(context: CanvasRenderingContext2D) {
    this.engineParticleEmitter.draw(context);
    this.rotateContext(context, this.rotation);

    context.drawImage(
      this.bufferCanvas,
      this.transform.x - this.size / 2,
      this.transform.y - this.size / 2
    );
    context.restore();
    if (config.debug) this.drawDebug(context);
  }
}
