import GameObject from "./GameObject";
import Particle from "./Particle";

export default class ParticleEmitter extends GameObject {
  particles: Particle[];
  constructor(transform: Vector2, color = { r: 255, g: 0, b: 0 }) {
    super(transform, 0, color);
    this.particles = [];
  }

  public emit(transform = this.transform, vector: Vector2 = { x: 0, y: 0 }) {
    this.particles.push(
      new Particle(
        { x: transform.x, y: transform.y },
        vector,
        this.color.rgbObject
      )
    );
  }
  public update(dt: number) {
    this.particles.forEach((p) => {
      p.update(dt);
    });
    this.particles = this.particles.filter((p) => {
      return p.opacity > 0;
    });
  }
  public draw(context: CanvasRenderingContext2D) {
    this.particles.forEach((p) => {
      p.draw(context);
    });
  }
}
