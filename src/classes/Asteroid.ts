// import GameObject from "./GameObject";
import trianglify from "trianglify";
import config from "../config";
import { randomInt } from "../services/Utils";
import RigidBody from "../engine/RigidBody";

export default class Asteroid extends RigidBody {
  constructor(transform: Vector2) {
    super(transform, 128);
    this.torque = (Math.random() - 0.5) * 0.0002;
    this.vector = {
      x: 0,
      y: 0,
    };
    this.mass = 4;
    this.minSpeed = 0.01;
  }
  public render() {
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
    const width = this.size;
    const height = this.size;

    // generate a spiral using polar coordinates
    const points = [];
    const NUM_POINTS = randomInt(50, 70);
    let r = 0;
    const rStep = width / 2 / NUM_POINTS;
    let theta = 0;
    const thetaStep = (Math.PI / NUM_POINTS) * 18;
    for (let i = 0; i < NUM_POINTS; i++) {
      const x = width / 2 + r * Math.cos(theta);
      const y = height / 2 + r * Math.sin(theta);
      const point = [x, y];
      points.push(point);
      r += rStep;
      theta = (theta + thetaStep) % (2 * Math.PI);
    }

    // apply trianglify to convert the points to polygons and apply the color
    // gradient
    const pattern = trianglify({
      height,
      width,
      points,
      xColors: [
        `rgb(${Math.round(Math.random() * 255)}, ${Math.round(
          Math.random() * 255
        )}, ${Math.round(Math.random() * 255)})`,
        `rgb(${Math.round(Math.random() * 255)}, ${Math.round(
          Math.random() * 255
        )}, ${Math.round(Math.random() * 255)})`,
      ],
      yColors: "match",
      colorFunction: trianglify.colorFunctions.shadows(0.1),
    });
    return pattern.toCanvas(offScreenCanvas, { scaling: false });
  }
}
