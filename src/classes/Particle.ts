import GameObject from "./GameObject";

export default class Particle extends GameObject {
  opacity: number;
  constructor(transform: Vector2) {
    super(transform, 16);
    this.opacity = 1;
  }
  render() {
    const offScreenCanvas = document.createElement("canvas");
    offScreenCanvas.width = this.size;
    offScreenCanvas.height = this.size;
    const context = offScreenCanvas.getContext("2d");
    context.beginPath();
    context.arc(this.size / 2, this.size / 2, this.size / 2, 0, 2 * Math.PI);
    context.fillStyle = 'rgb(50, 50, 50)';
    context.fill();
    return offScreenCanvas;
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