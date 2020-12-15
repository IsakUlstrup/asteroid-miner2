<script lang="ts">
  import { onMount } from "svelte";
  import Game from "./classes/Game";
  import ShipPlayer from "./classes/ShipPlayer";
  import Engine from "./classes/Engine";
  import Laser from "./classes/Laser";

  const ship = new ShipPlayer({ x: 0, y: 0 }, { r: 255, g: 255, b: 255 });
  ship.addModule(new Engine({ x: -14, y: 0 }, ship, 0.07, 16));
  ship.addModule(new Laser({ x: 0, y: 0 }, ship));

  // let engineThrottle = 0;
  let engineEnabled = true;
  function setEngineThrottle(power: number) {
    ship.engines.forEach((e) => e.setPowerModifier(power));
  }
  // $: setEngineThrottle(engineThrottle);

  function toggleEngine() {
    engineEnabled = !engineEnabled;
    const power = engineEnabled ? 1 : 0;
    setEngineThrottle(power);
  }

  // let laserPower = 0;
  let laserEnabled = true;
  function setLaserPower(power: number) {
    ship.lasers.forEach((e) => e.setPowerModifier(power));
  }
  // $: setLaserPower(laserPower);
  function toggleLaser() {
    laserEnabled = !laserEnabled;
    const power = laserEnabled ? 1 : 0;
    setLaserPower(power);
  }

  onMount(() => {
    const game = new Game("#game-canvas", ship);
    game.start();
  });
</script>

<style>
  .game {
    width: 100%;
    height: 100%;
    position: relative;
  }
  canvas {
    background: #181818 url("https://www.toptal.com/designers/subtlepatterns/patterns/broken_noise.png");
  }
  .hud {
    position: absolute;
    display: block;
    color: white;
    /* background: rgba(255, 255, 255, 0.1); */
    padding: 0.5rem;
  }
  .toggleButton {
    width: 100%;
    padding: 0.8rem;
    display: block;
    background: transparent;
    border: 1px solid white;
    color: white;
    border-radius: 0.2rem;
    margin-bottom: 0.8rem;
  }
  .inactive {
    opacity: 0.6;
  }
</style>

<div class="game">
  <div class="hud">
    <p>
    <input class="toggleButton" class:inactive="{engineEnabled === false}" type="button" on:click={toggleEngine} value="ENG">
    </p>
    <p>
      <input class="toggleButton" class:inactive="{laserEnabled === false}" type="button" on:click={toggleLaser} value="LSR">
    </p>
  </div>
  <canvas width="800" height="400" id="game-canvas" alt="game canvas">
    Canvas not supported
  </canvas>
</div>