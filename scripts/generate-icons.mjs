import sharp from 'sharp'
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { buildIconSvg } from './icon-source.js'

const publicDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public')

async function render(size, contentScale, filename) {
  const svg = buildIconSvg({ size, contentScale })
  await sharp(Buffer.from(svg)).png().toFile(join(publicDir, filename))
  console.log('wrote', filename)
}

writeFileSync(join(publicDir, 'favicon.svg'), buildIconSvg({ size: 64, contentScale: 0.72 }))
console.log('wrote favicon.svg')

await render(192, 0.72, 'pwa-192x192.png')
await render(512, 0.72, 'pwa-512x512.png')
await render(512, 0.5, 'maskable-icon-512x512.png')
await render(180, 0.72, 'apple-touch-icon.png')
