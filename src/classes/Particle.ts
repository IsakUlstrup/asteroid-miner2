import GameObject from "./GameObject";

export default class Particle extends GameObject {
  opacity: number;
  constructor(transform: Vector2) {
    super(transform, 16);
    this.opacity = 1;
  }
  public update(dt: number) {
    this.opacity -= 0.001 * dt;
    if (this.opacity < 0) this.opacity = 0;
  }
  public draw(context: CanvasRenderingContext2D, cameraPosition: Vector2) {
    context.globalAlpha = this.opacity;
    context.drawImage(
      this.bufferCanvas,
      this.transform.x - this.size / 2 - cameraPosition.x,
      this.transform.y  - this.size / 2 - cameraPosition.y
    );
    context.globalAlpha = 1;
  }
}