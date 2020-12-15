import trianglify from "trianglify";
import type GameObject from "../engine/GameObject";
import { randomInt } from "../services/Utils";
import DestroyableObject from "./DestroyableObject";
import Ore from "./Ore";

export default class Asteroid extends DestroyableObject {
  constructor(transform: Vector2, color = { r: 255, g: 0, b: 0 }) {
    super(transform, 128, color);
    this.torque = (Math.random() - 0.5) * 0.0002;
    this.vector = {
      x: 0,
      y: 0,
    };
    this.mass = 4;
    this.minSpeed = 0;
    this.collisionRadius = this.radius * 0.9;

    this.inventory.push(new Ore(this.transform, Ore.Type.cyan));
    this.inventory.push(new Ore(this.transform, Ore.Type.magenta));
    this.inventory.push(new Ore(this.transform, Ore.Type.yellow));
    this.inventory.push(new Ore(this.transform, Ore.Type.black));
    this.inventory.push(new Ore(this.transform, Ore.Type.white));
  }

  public destroy(gameObjects: GameObject[]) {
    this.inventory.forEach((i) => {
      i.transform = {
        x: i.transform.x + (Math.random() - 0.5) * this.size,
        y: i.transform.y + (Math.random() - 0.5) * this.size,
      };
      i.vector = this.vector;
      gameObjects.push(i);
    });
    gameObjects.splice(gameObjects.indexOf(this), 1);
  }

  public render() {
    const offScreenCanvas = document.createElement("canvas");
    offScreenCanvas.width = this.size;
    offScreenCanvas.height = this.size;
    this.color.hsv(Math.random() * 360, 100, 100);
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
        this.color.rgbString,
        this.color.hueRotate(randomInt(50, 360)).rgbString,
      ],
      colorFunction: trianglify.colorFunctions.shadows(0.15),
    });
    return pattern.toCanvas(offScreenCanvas, { scaling: false });
  }
}
