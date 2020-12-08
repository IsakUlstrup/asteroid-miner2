import GameObject from "./GameObject";
import type CanvasWrapper from "./CanvasWrapper";
import Particle from "./Particle";
import config from "../config";
import { radianToPoint, distanceBetweenPoints } from "../services/Utils";

export default class PlayerShip extends GameObject {
  particles: Particle[] = [];
  hit: GameObject;
  nearbyObjectsThreshold: number;
  accelerationModifier: number;
  constructor(transform: Vector2) {
    super(transform, 32);
    this.nearbyObjectsThreshold = 128;
    this.accelerationModifier = 0.1;
  }

  protected render() {
    const offScreenCanvas = document.createElement("canvas");
    offScreenCanvas.width = this.size;
    offScreenCanvas.height = this.size;
    if (config.debug) {
      const context = offScreenCanvas.getContext("2d");
      context.beginPath();
      context.arc(this.size / 2, this.size / 2, this.size / 2, 0, 2 * Math.PI);
      context.strokeStyle = 'rgb(50, 50, 50)';
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
  private handleCollision(gameObjects: GameObject[]) {
    // collision detection, only if we are moving
    if (Math.abs(this.vector.x) > 0 || Math.abs(this.vector.y) > 0) {
      const nearby = this.getNearbyObjects(this.transform, gameObjects, this.nearbyObjectsThreshold);
      if (nearby.length > 0) {
        const hits = this.collisionDetection(this, nearby);
        if (hits.length > 0) {
          this.hit = hits[0];
          const distance = Math.abs(distanceBetweenPoints(this.transform, this.hit.transform) - (this.size / 2 + this.hit.size / 2));
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
  handleInput(canvas: CanvasWrapper) {
    this.rotation = radianToPoint(canvas.size.width / 2, canvas.size.height / 2, canvas.cursor.position.x, canvas.cursor.position.y);
  
    if (canvas.cursor.active) {
      this.acceleration.x = ((canvas.cursor.position.x / canvas.size.width) - 0.5) * this.accelerationModifier;
      this.acceleration.y = ((canvas.cursor.position.y / canvas.size.height) - 0.5) * this.accelerationModifier;
      this.particles.push(new Particle({x: this.transform.x, y: this.transform.y}));
    } else {
      this.acceleration.x = 0;
      this.acceleration.y = 0;
    }
  }
  updateParticles(dt: number) {
    this.particles.forEach(p => {
      p.update(dt);
    });
    this.particles = this.particles.filter(p => p.opacity > 0);
  }
  move(dt: number) {
    this.vector.x += this.acceleration.x;
    this.vector.y += this.acceleration.y;

    // if we are not accelerating and moving really slow, stop
    if (this.acceleration.x === 0 && this.acceleration.y === 0 && Math.abs(this.vector.x) < 0.1 && Math.abs(this.vector.y) < 0.1) {
      this.vector.x = 0;
      this.vector.y = 0;
    }

    this.transform.x += this.vector.x * dt;
    this.transform.y += this.vector.y * dt;
  }
  public update(dt: number, canvas: CanvasWrapper, gameObjects: GameObject[]) {
    this.handleCollision(gameObjects);
    this.handleInput(canvas);
    this.updateParticles(dt);
    this.move(dt);
  }
  public draw(context: CanvasRenderingContext2D, cameraPosition: Vector2) {
    if (config.debug) {
      // vector debug
      context.strokeStyle = "rgb(100, 100, 100)";
      context.lineCap = "round";
      context.lineWidth = 3;
      context.beginPath();
      context.moveTo(this.transform.x - cameraPosition.x, this.transform.y  - cameraPosition.y);
      context.lineTo(this.vector.x * 500, this.vector.y * 500);
      context.stroke();

      // collide target
      if (this.hit) {
        context.beginPath();
        context.arc(this.hit.transform.x - cameraPosition.x, this.hit.transform.y - cameraPosition.y, this.hit.size / 2, 0, 2 * Math.PI);
        context.strokeStyle = 'rgb(250, 50, 50)';
        context.stroke();
      }
    }

    this.particles.forEach(p => p.draw(context, cameraPosition));

    context.rotate(this.rotation);
    context.drawImage(
      this.bufferCanvas,
      this.transform.x - this.size / 2 - cameraPosition.x,
      this.transform.y  - this.size / 2 - cameraPosition.y
    );
  }
}