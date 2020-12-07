<script lang="ts">
  import { onMount } from "svelte";
  import Game from "./classes/Game";
  let context: CanvasRenderingContext2D;

  function resizeCanvas(canvas: HTMLCanvasElement, devicePixelRatio: number) {
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.round(devicePixelRatio * rect.width);
    canvas.height = Math.round(devicePixelRatio * rect.height);
    canvas.getContext("2d").scale(1 / devicePixelRatio, 1 / devicePixelRatio);
  }


  onMount(() => {
    const canvas = document.querySelector("#game-canvas") as HTMLCanvasElement;
    const devicePixelRatio = window.devicePixelRatio || 1;
    window.addEventListener("resize", () => {
      resizeCanvas(canvas, devicePixelRatio);
    });
    resizeCanvas(canvas, devicePixelRatio);
    context = canvas.getContext("2d");

    const game = new Game(context);
    game.start();
  });
</script>

<style>
  canvas {
    display: block;
    width: 100%;
    height: 100%;
  }
</style>

<canvas width="800" height="400" id="game-canvas" alt="game canvas">
  Canvas not supported
</canvas>