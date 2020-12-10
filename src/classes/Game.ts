import gameLoop from "../services/GameLoop";
import Asteroid from "./Asteroid";
import GameObjectManager from "./GameObjectManager";
import PlayerShip from "./PlayerShip";

export default class Game {
  private renderer: GameObjectManager;
  private ship: PlayerShip;
  constructor(canvasQuery: string) {
    this.ship = new PlayerShip({ x: 0, y: 0 });

    // setup & resize canvas
    const canvas = document.querySelector(canvasQuery) as HTMLCanvasElement;
    if (!canvas) {
      throw "canvas element not found";
    }

    this.initCanvas(canvas);
    const context = canvas.getContext("2d");

    this.renderer = new GameObjectManager(context, this.ship.transform);
  }
  public start() {
    // bogus gameObjects
    for (let index = 0; index < 100; index++) {
      this.renderer.addGameObject(
        new Asteroid({
          x: (Math.random() - 0.5) * 10000,
          y: (Math.random() - 0.5) * 10000,
        })
      );
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
  initCanvas(canvas: HTMLCanvasElement) {
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    const devicePixelRatio = window.devicePixelRatio || 1;
    window.addEventListener("resize", () => {
      this.resizeCanvas(canvas, devicePixelRatio);
    });
    this.resizeCanvas(canvas, devicePixelRatio);
  }
  resizeCanvas(canvas: HTMLCanvasElement, devicePixelRatio: number) {
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.round(devicePixelRatio * rect.width);
    canvas.height = Math.round(devicePixelRatio * rect.height);
    canvas.getContext("2d").scale(1 / devicePixelRatio, 1 / devicePixelRatio);
  }
}
