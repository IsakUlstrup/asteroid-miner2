import GameObject from "./GameObject";
import Particle from "./Particle";

export default class ParticleEmitter extends GameObject {
  particles: Particle[];
  constructor(transform: Vector2) {
    super(transform);
    this.particles = [];
  }

  public emit(transform = this.transform) {
    this.particles.push(new Particle({ x: transform.x, y: transform.y }));
  }
  public update(dt: number) {
    this.particles.forEach((p) => {
      p.update(dt);
    });
    this.particles = this.particles.filter((p) => {
      return p.opacity > 0;
    });
  }
  public draw(context: CanvasRenderingContext2D, cameraPosition: Vector2) {
    this.particles.forEach((p) => {
      p.draw(context, cameraPosition);
    });
  }
}
