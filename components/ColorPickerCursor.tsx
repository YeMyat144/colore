import type React from "react"

interface ColorPickerCursorProps {
  color: string
  x: number
  y: number
}

const ColorPickerCursor: React.FC<ColorPickerCursorProps> = ({ color, x, y }) => {
  return (
    <div className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2" style={{ left: x, top: y }}>
      <div className="relative">
        <div className="absolute inset-0 rounded-full blur" style={{ backgroundColor: color }}></div>
        <div className="h-6 w-6 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: color }}></div>
      </div>
    </div>
  )
}

export default ColorPickerCursor

