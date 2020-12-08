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
  if (distanceBetweenPoints({x: c1x, y: c1y}, {x: c2x, y: c2y}) < c1r + c2r) {
    console.log("collide");
    return true;
  } else {
    return false;
  }
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

export function radianToPoint(cx: number, cy: number, ex: number, ey: number) {
  const dy = ey - cy;
  const dx = ex - cx;
  let theta = Math.atan2(dy, dx);
  return theta;
}

export function distanceBetweenPoints(p1: Vector2, p2: Vector2) {
  const a = p1.x - p2.x;
  const b = p1.y - p2.y;
  return Math.sqrt(a * a + b * b);
}

export function rotateVector(vector: Vector2, radian: number)
{
  // radian = -radian;
    const cos = Math.cos(-radian);
    const sin = Math.sin(-radian);
    return {
      x: Math.round(10000*(vector.x * cos - vector.y * sin))/10000,
      y: Math.round(10000*(vector.x * sin + vector.y * cos))/10000
    };
};
