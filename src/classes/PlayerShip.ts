import GameObject from "./GameObject";
import type CanvasWrapper from "./CanvasWrapper";
import Particle from "./Particle";

export default class PlayerShip extends GameObject {
  particles: Particle[] = [];
  constructor(transform: Vector2) {
    super(transform);
  }

  protected render() {
    const offScreenCanvas = document.createElement("canvas");
    offScreenCanvas.width = this.size;
    offScreenCanvas.height = this.size;
    const context = offScreenCanvas.getContext("2d");
    context.fillstyle = "rgb(26, 26, 26)";
    context.lineCap = "round";
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(this.size, this.size / 2);
    context.lineTo(0, this.size);
    context.lineTo(10, this.size / 2);
    context.closePath();
    context.fill();
    return offScreenCanvas;
  }
  angle(cx: number, cy: number, ex: number, ey: number) {
    const dy = ey - cy;
    const dx = ex - cx;
    let theta = Math.atan2(dy, dx);
    return theta;
  }
  update(dt: number, canvas: CanvasWrapper) {
    this.rotation = this.angle(canvas.size.width / 2, canvas.size.height / 2, canvas.cursor.position.x, canvas.cursor.position.y);
    this.particles.forEach(p => {
      p.update(dt);
    });
    this.particles = this.particles.filter(p => p.opacity > 0);

    if (canvas.cursor.active) {
      this.acceleration.x = ((canvas.cursor.position.x / canvas.size.width) - 0.5) * 0.1;
      this.acceleration.y = ((canvas.cursor.position.y / canvas.size.height) - 0.5) * 0.1;
      this.particles.push(new Particle({x: this.transform.x, y: this.transform.y}));
    } else {
      this.acceleration.x = 0;
      this.acceleration.y = 0;
    }

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
  public draw(context: CanvasRenderingContext2D, cameraPosition: Vector2) {
    // vector debug
    context.strokeStyle = "rgb(100, 100, 100)";
    context.lineCap = "round";
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(this.transform.x - cameraPosition.x, this.transform.y  - cameraPosition.y);
    context.lineTo(this.vector.x * 500, this.vector.y * 500);
    context.stroke();

    this.particles.forEach(p => p.draw(context, cameraPosition));

    context.rotate(this.rotation);
    context.drawImage(
      this.bufferCanvas,
      this.transform.x - this.size / 2 - cameraPosition.x,
      this.transform.y  - this.size / 2 - cameraPosition.y
    );
  }
}