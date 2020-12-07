import GameObject from "./GameObject";
import trianglify from "trianglify";

export default class Asteroid extends GameObject {
  constructor(transform: Vector2) {
    super(transform, 128);
  }
  render() {
    const offScreenCanvas = document.createElement("canvas");
    offScreenCanvas.width = this.size;
    offScreenCanvas.height = this.size;
    const width = this.size;
    const height = this.size;

    // generate a spiral using polar coordinates
    const points = [];
    const NUM_POINTS = (Math.random() + 1) * 30;
    // const darkenedColor = color.darken(50);
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
      xColors: [`rgb(${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)})`, `rgb(${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)})`],
      yColors: "match",
      colorFunction: trianglify.colorFunctions.shadows(0.1)
    });
    return pattern.toCanvas(offScreenCanvas, { scaling: false });
  }
}