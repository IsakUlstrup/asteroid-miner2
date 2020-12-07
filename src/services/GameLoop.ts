const listeners: Function[] = [];
let speedModifier = 1;
let paused = false;
const timing = {
  dt: 0,
  last: 0,
  fpsLimit: 60,
  minFrameTime: (1000 / 60) * (60 / 60) - (1000 / 60) * 0.5
};

function loop() {
  const now = performance.now();
  timing.dt = now - timing.last;
  if (timing.dt < timing.minFrameTime) {
    //skip the frame if the call is too early
    requestAnimationFrame(loop);
    return;
  }
  timing.last = now;
  if (paused) return;
  listeners.forEach(l => {
    l(timing.dt * speedModifier);
  });
  requestAnimationFrame(loop);
}
loop();

export default {
  timing,
  status() {
    console.log(`
      Speed:${speedModifier}, dt: ${timing.dt}, listeners: ${listeners}
    `);
  },
  setFPSLimit(limit: number) {
    this.timing.fpsLimit = limit;
    this.timing.minFrameTime = (1000 / 60) * (60 / limit) - (1000 / 60) * 0.5;
  },
  addListener(listener: Function) {
    // console.log("adding listener", listener);
    listeners.push(listener);
    // this.status();
  },
  removeListener(listener: Function) {
    console.log("removing listener", listener);
    listeners.slice(listeners.indexOf(listener), 1);
  },
  setSpeed(speed: number) {
    console.log("speed:", speed);
    speedModifier = speed;
  },
  pause(flag: boolean) {
    console.log("pause:", flag);
    paused = flag;
  }
};
