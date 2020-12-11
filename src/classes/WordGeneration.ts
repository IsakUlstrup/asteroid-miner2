import GameObject from "../engine/GameObject";
import config from "../config";
import type GameObjectManager from "../engine/GameObjectManager";
import Asteroid from "./Asteroid";

export default class WorldGeneration extends GameObject {
  renderer: GameObjectManager;
  constructor(transform: Vector2, gameObjects: GameObjectManager) {
    super(transform);
    this.renderer = gameObjects;
  }

  addAsteroid() {
    this.renderer.addGameObject(
      new Asteroid({
        x: (Math.random() - 0.5) * 25000,
        y: (Math.random() - 0.5) * 25000,
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
