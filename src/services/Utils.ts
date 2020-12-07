export function randomInt(min = 0, max = 1) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function isWithinCircle(
  x: number,
  y: number,
  circleX: number,
  circleY: number,
  circleR: number
) {
  const posY = y - circleY;
  const posX = x - circleX;
  const dist = Math.sqrt(posY * posY + posX * posX);

  if (dist < circleR) {
    // coords are within circle
    return true;
  }
  return false;
}

export function circlesIntersect(
  c1x: number,
  c1y: number,
  c1r: number,
  c2x: number,
  c2y: number,
  c2r: number
) {
  const circle1 = { radius: c1r, x: c1x, y: c1y };
  const circle2 = { radius: c2r, x: c2x, y: c2y };
  // console.log(circle1, circle2);

  const dx = circle1.x - circle2.x;
  const dy = circle1.y - circle2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < circle1.radius + circle2.radius) {
    return true;
    // collision detected!
  }
  return false;
}

export function resizeCanvas(
  context: CanvasRenderingContext2D,
  resolutionScaling: number
) {
  // resize whith aspect ratio
  context.canvas.height =
    context.canvas.getBoundingClientRect().height * resolutionScaling;
  context.canvas.width =
    context.canvas.getBoundingClientRect().width * resolutionScaling;
  context.scale(resolutionScaling, resolutionScaling);
}

export function getScaledCanvasDimendsions(
  canvas: HTMLCanvasElement,
  resolutionScale: number
) {
  return {
    width: canvas.width * (1 / resolutionScale),
    height: canvas.height * (1 / resolutionScale)
  };
}

export function getPointInCircle(radius: number) {
  const angle = Math.random() * Math.PI * 2;
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius
  };
}
