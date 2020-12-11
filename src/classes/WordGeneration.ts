import GameObject from "../engine/GameObject";
import config from "../config";
import type GameObjectManager from "../engine/GameObjectManager";
import Asteroid from "./Asteroid";

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
  update(dt: number) {
    if (this.renderer.objects.length < config.maxAsteroidCount) {
      this.addAsteroid();
    }
  }
  draw() {
    return;
  }
}
