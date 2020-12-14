<script lang="ts">
  import { onMount } from "svelte";
  import Game from "./classes/Game";
  import ShipPlayer from "./classes/ShipPlayer";
  import Engine from "./classes/Engine";
  import Laser from "./classes/Laser";

  const ship = new ShipPlayer({ x: 0, y: 0 }, { r: 255, g: 255, b: 255 });
  ship.addModule(new Engine({ x: -14, y: 0 }, ship, 0.07, 16));
  ship.addModule(new Laser({ x: 0, y: 0 }, ship));

  let engineThrottle = 0;
  function setEngineThrottle(power: number) {
    ship.engines.forEach((e) => e.setPowerModifier(power));
  }
  $: setEngineThrottle(engineThrottle);

  let laserPower = 0;
  function setLaserPower(power: number) {
    ship.lasers.forEach((e) => e.setPowerModifier(power));
  }
  $: setLaserPower(laserPower);

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
    background: url("https://www.toptal.com/designers/subtlepatterns/patterns/broken_noise.png");
  }
  .hud {
    position: absolute;
    display: block;
    color: white;
    background: rgba(255, 255, 255, 0.1);
    margin: 1rem;
    padding: 1rem;
  }
</style>

<div class="game">
  <div class="hud">
    <p>
      engine
      <br />
      <input type="range" min="0" max="1" step="0.1" bind:value="{engineThrottle}" name="engine-power">
    </p>
    <p>
      laser
      <br />
      <input type="range" min="0" max="1" step="0.1" bind:value="{laserPower}" name="laser-power">
    </p>
  </div>
  <canvas width="800" height="400" id="game-canvas" alt="game canvas">
    Canvas not supported
  </canvas>
</div>