// Generates the SVG source markup for the app icon, used by generate-icons.mjs.
// Mirrors the in-app Logo component: two periodic-table tiles, Br (Bromine) and
// Pa (Protactinium), spelling out "Breaking Paid" — on the app's dark gradient.

function tile(x, y, side, number, symbol, name) {
  return `
    <g transform="translate(${x} ${y})">
      <rect width="${side}" height="${side}" rx="${side * 0.18}" fill="url(#tile-grad)" stroke="rgba(255,255,255,0.2)" stroke-width="${side * 0.02}" />
      <text x="${side * 0.11}" y="${side * 0.26}" font-size="${side * 0.16}" font-weight="700" fill="#fff" fill-opacity="0.85" font-family="Inter, ui-sans-serif, system-ui, sans-serif">${number}</text>
      <text x="${side * 0.5}" y="${side * 0.64}" font-size="${side * 0.42}" font-weight="800" fill="#fff" text-anchor="middle" font-family="Inter, ui-sans-serif, system-ui, sans-serif">${symbol}</text>
      <text x="${side * 0.5}" y="${side * 0.88}" font-size="${side * 0.075}" letter-spacing="${side * 0.006}" fill="#fff" fill-opacity="0.75" text-anchor="middle" font-family="Inter, ui-sans-serif, system-ui, sans-serif">${name}</text>
    </g>
  `
}

export function buildIconSvg({ size = 512, contentScale = 0.68 } = {}) {
  const blockWidth = size * contentScale
  const gap = blockWidth * 0.06
  const tileSide = (blockWidth - gap) / 2
  const y0 = (size - tileSide) / 2
  const x0 = (size - blockWidth) / 2

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bg1" cx="15%" cy="10%" r="80%">
      <stop offset="0%" stop-color="#4338ca" />
      <stop offset="100%" stop-color="#0b0d17" />
    </radialGradient>
    <radialGradient id="bg2" cx="85%" cy="90%" r="80%">
      <stop offset="0%" stop-color="#7c3aed" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#7c3aed" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="tile-grad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#6366f1" />
      <stop offset="100%" stop-color="#7c3aed" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="#0b0d17" />
  <rect width="${size}" height="${size}" fill="url(#bg1)" />
  <rect width="${size}" height="${size}" fill="url(#bg2)" />
  ${tile(x0, y0, tileSide, 35, 'Br', 'BROMINE')}
  ${tile(x0 + tileSide + gap, y0, tileSide, 91, 'Pa', 'PROTACTINIUM')}
</svg>`
}
