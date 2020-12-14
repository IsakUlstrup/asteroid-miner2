import Module from "./Module";
import ParticleEmitter from "../engine/ParticleEmitter";
import type CanvasWrapper from "../engine/CanvasWrapper";
import type GameObject from "../engine/GameObject";

export default class Engine extends Module {
  private particleEmitter: ParticleEmitter;
  // private throttle: number;
  constructor(offset: Vector2, parent: GameObject, effect = 1, size = 16) {
    super(offset, parent, effect, size);
    this.particleEmitter = new ParticleEmitter(this.transform);
    // this.throttle = 1;
  }

  protected render() {
    const offScreenCanvas = document.createElement("canvas");
    offScreenCanvas.width = this.size;
    offScreenCanvas.height = this.size;
    const context = offScreenCanvas.getContext("2d");

    context.fillStyle = "orange";
    context.beginPath();
    context.moveTo(this.size, 0);
    context.lineTo(this.size, this.size);
    context.lineTo(0, this.size / 2);
    context.closePath();
    context.fill();

    return offScreenCanvas;
  }
  public use() {
    const rotatedPosition = {
      x:
        this.size * Math.cos(this.parent.rotation + Math.PI) + this.transform.x,
      y:
        this.size * Math.sin(this.parent.rotation + Math.PI) + this.transform.y,
    };

    if (this.derivedEffect > 0) {
      this.particleEmitter.emit({
        x: rotatedPosition.x,
        y: rotatedPosition.y,
      });
    }
    return this.derivedEffect;
  }
  public update(dt: number, canvas: CanvasWrapper, gameObjects: GameObject[]) {
    if (canvas.cursor.active) {
      this.use();
      this.active = true;
    } else {
      this.active = false;
    }
    this.particleEmitter.update(dt);
  }
  public draw(context: CanvasRenderingContext2D) {
    this.particleEmitter.draw(context);

    context.save();
    context.translate(this.transform.x, this.transform.y);
    context.rotate(this.parent.rotation);
    context.translate(-this.transform.x, -this.transform.y);
    if (this.active) {
      context.drawImage(
        this.bufferCanvas,
        this.transform.x + this.positionOffset.x - this.size / 2,
        this.transform.y + this.positionOffset.y - this.size / 2
      );
    }
    context.restore();
  }
}
