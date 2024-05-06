function bresenham(x1, x2, y1, y2) {
  const points = [];

  x1 = parseInt(x1);
  x2 = parseInt(x2);
  y1 = parseInt(y1);
  y2 = parseInt(y2);
  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);
  const sx = x1 < x2 ? 1 : -1;
  const sy = y1 < y2 ? 1 : -1;
  let err = dx - dy;

  // Add the starting point
  //points.push({ x: x1, y: y1 });

  while (true) {
    // Plot the point (x, y)
    points.push({ x: x1, y: y1 });

    if (x1 === x2 && y1 === y2) break;

    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x1 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y1 += sy;
    }
  }

  return points;
}

// Example usage:
const input = [
  { x: 1, y: 1 },
  { x: 4, y: 1 },
];
const result = bresenham(input[0].x, input[1].x, input[0].y, input[1].y);
console.log(result);
