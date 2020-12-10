import RigidBody from "./RigidBody";

export default class SpaceStation extends RigidBody {
  constructor(transform: Vector2) {
    super(transform, 256);
    this.mass = 100;
    this.torque = 0.0001;
  }

  render() {
    const offScreenCanvas = document.createElement("canvas");
    offScreenCanvas.width = this.size;
    offScreenCanvas.height = this.size;
    const context = offScreenCanvas.getContext("2d");

    context.fillStyle = "#dd1897";
    context.strokeStyle = "#dd1874";
    context.lineWidth = 20;

    context.beginPath();
    context.moveTo(this.size / 2, 10);
    context.lineTo(this.size / 2, this.size - 10);
    context.stroke();

    context.beginPath();
    context.moveTo(10, this.size / 2);
    context.lineTo(this.size - 10, this.size / 2);
    context.stroke();

    context.arc(this.size / 2, this.size / 2, 30, 0, Math.PI * 2);
    context.fill();

    // Create gradient
    const gradient = context.createRadialGradient(
      this.size / 2,
      this.size / 2,
      this.size / 3,
      this.size / 2,
      this.size / 2,
      this.size / 2
    );
    gradient.addColorStop(0, "#dd1874");
    gradient.addColorStop(0.5, "#dd1897");
    gradient.addColorStop(1, "#dd1874");

    context.fillStyle = gradient;
    context.beginPath();
    context.arc(
      this.size / 2,
      this.size / 2,
      this.size / 2,
      0,
      Math.PI * 2,
      false
    );
    context.arc(
      this.size / 2,
      this.size / 2,
      this.size / 3,
      0,
      Math.PI * 2,
      true
    );
    context.fill();

    return offScreenCanvas;
  }
}
