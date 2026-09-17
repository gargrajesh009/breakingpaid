interface TileProps {
  x: number
  number: number
  symbol: string
  name: string
}

function Tile({ x, number, symbol, name }: TileProps) {
  return (
    <g transform={`translate(${x} 0)`}>
      <rect
        width="44"
        height="44"
        rx="8"
        fill="url(#break-pay-tile-grad)"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1"
      />
      <text x="5" y="13" fontSize="7" fontWeight="700" fill="#fff" fillOpacity="0.85">
        {number}
      </text>
      <text
        x="22"
        y="29"
        fontSize="18"
        fontWeight="800"
        fill="#fff"
        textAnchor="middle"
        fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
      >
        {symbol}
      </text>
      <text
        x="22"
        y="39"
        fontSize="3.4"
        letterSpacing="0.3"
        fill="#fff"
        fillOpacity="0.75"
        textAnchor="middle"
      >
        {name}
      </text>
    </g>
  )
}

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 94 44" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="break-pay-tile-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <Tile x={0} number={35} symbol="Br" name="BROMINE" />
      <Tile x={50} number={91} symbol="Pa" name="PROTACTINIUM" />
    </svg>
  )
}
