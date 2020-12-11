<script lang="ts">
  import { onMount } from "svelte";
  import Game from "./classes/Game";

  onMount(() => {
    const game = new Game("#game-canvas");
    game.start();
  });
</script>

<style>
  canvas {
    background: url("https://www.toptal.com/designers/subtlepatterns/patterns/broken_noise.png");
  }
</style>

<canvas width="800" height="400" id="game-canvas" alt="game canvas">
  Canvas not supported
</canvas>