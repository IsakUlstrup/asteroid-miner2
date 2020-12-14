import GameObject from "../engine/GameObject";

export default class Star extends GameObject {
  constructor(transform: Vector2) {
    super(transform, 12);
  }

  protected render() {
    const offScreenCanvas = document.createElement("canvas");
    offScreenCanvas.width = this.size;
    offScreenCanvas.height = this.size;
    const context = offScreenCanvas.getContext("2d");

    context.beginPath();
    context.arc(this.radius, this.radius, this.radius, 0, 2 * Math.PI);
    context.fillStyle = "rgb(200, 200, 200)";
    context.fill();

    return offScreenCanvas;
  }
  update() {
    return;
  }
  public draw(context: CanvasRenderingContext2D) {
    // draw buffer canvas
    context.drawImage(
      this.bufferCanvas,
      Math.round(this.transform.x - this.radius),
      Math.round(this.transform.y - this.radius)
    );
  }
}
