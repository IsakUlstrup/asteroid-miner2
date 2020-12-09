import type GameObject from "./GameObject";
import type CanvasWrapper from "./CanvasWrapper";
import Particle from "./Particle";
import config from "../config";
import { radianToPoint } from "../services/Utils";
import RigidBody from "./RigidBody";

export default class PlayerShip extends RigidBody {
  particles: Particle[] = [];
  accelerationModifier: number;
  constructor(transform: Vector2) {
    super(transform, 32);
    this.accelerationModifier = 0.1;
    this.mass = 1;
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
    context.fillStyle = "rgb(26, 26, 26)";
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

      this.particles.push(
        new Particle({ x: this.transform.x, y: this.transform.y })
      );
    } else {
      this.force.x = 0;
      this.force.y = 0;
    }
  }
  updateParticles(dt: number) {
    this.particles.forEach((p) => {
      p.update(dt);
    });
    this.particles = this.particles.filter((p) => p.opacity > 0);
  }
  public update(dt: number, canvas: CanvasWrapper, gameObjects: GameObject[]) {
    this.handleCollision(
      gameObjects.filter((go) => go instanceof RigidBody) as RigidBody[]
    );
    this.handleInput(canvas);
    this.updateParticles(dt);
    this.updateTransform(dt);
  }
  public draw(context: CanvasRenderingContext2D, cameraPosition: Vector2) {
    this.particles.forEach((p) => p.draw(context, cameraPosition));

    context.rotate(this.rotation);
    context.drawImage(
      this.bufferCanvas,
      this.transform.x - this.size / 2 - cameraPosition.x,
      this.transform.y - this.size / 2 - cameraPosition.y
    );
  }
}
