import gameLoop from "../services/GameLoop";
import Asteroid from "./Asteroid";
import GameObjectManager from "./GameObjectManager";
import PlayerShip from "./PlayerShip";

export default class Game {
  private renderer: GameObjectManager;
  private ship: PlayerShip;
  constructor(context: CanvasRenderingContext2D){
    this.ship = new PlayerShip({x: 0, y: 0});
    this.renderer = new GameObjectManager(context, this.ship.transform, 0.3 * window.devicePixelRatio || 1);
  }
  public start() {
    // bogus gameObjects
    for (let index = 0; index < 100; index++) {
      this.renderer.addGameObject(new Asteroid({x: (Math.random() - 0.5) * 10000, y: (Math.random() - 0.5) * 10000}))
    }
    this.renderer.addGameObject(this.ship);

    // start main loop
    gameLoop.addListener((dt: number) => {
      this.mainLoop(dt);
    });
  }
  mainLoop(dt: number) {
    this.renderer.update(dt);
    this.renderer.draw();
  }
}
