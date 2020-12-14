import GameObject from "../engine/GameObject";
import config from "../config";
import type GameObjectManager from "../engine/GameObjectManager";
import Asteroid from "./Asteroid";
import Star from "./Star";

export default class WorldGeneration extends GameObject {
  renderer: GameObjectManager;
  asteroidSpread: number;
  constructor(transform: Vector2, gameObjects: GameObjectManager) {
    super(transform);
    this.renderer = gameObjects;
    this.asteroidSpread = 50000;
  }

  addAsteroid() {
    this.renderer.addGameObject(
      new Asteroid({
        x: (Math.random() - 0.5) * this.asteroidSpread,
        y: (Math.random() - 0.5) * this.asteroidSpread,
      })
    );
  }
  addStar() {
    this.renderer.addParallaxObject(
      new Star(
        {
          x: (Math.random() - 0.5) * 50000,
          y: (Math.random() - 0.5) * 50000,
        },
        {
          r: 255,
          g: 255,
          b: 255,
        }
      )
    );
  }
  update(dt: number) {
    if (this.renderer.objects.length < config.maxAsteroidCount) {
      this.addAsteroid();
      this.addStar();
    }
  }
  draw() {
    return;
  }
}
