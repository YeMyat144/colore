"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { rgbToHex } from "../utils/colorUtils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EyeIcon as UploadIcon, ClipboardCopy } from "lucide-react"
import ColorPickerCursor from "../components/ColorPickerCursor"

export default function ImageColorPicker() {
  const [imageUrl, setImageUrl] = useState<string>("")
  const [color, setColor] = useState<{ hex: string; rgb: string } | null>(null)
  const [lockedColor, setLockedColor] = useState<{ hex: string; rgb: string } | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [showCustomCursor, setShowCustomCursor] = useState(false)

  const FIXED_WIDTH = 400
  const FIXED_HEIGHT = 300

  const handleImageLoad = useCallback(() => {
    if (canvasRef.current && imageRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (ctx) {
        canvas.width = FIXED_WIDTH
        canvas.height = FIXED_HEIGHT
        ctx.drawImage(imageRef.current, 0, 0, FIXED_WIDTH, FIXED_HEIGHT)
      }
    }
  }, [])

  useEffect(() => {
    window.addEventListener("resize", handleImageLoad)
    return () => window.removeEventListener("resize", handleImageLoad)
  }, [handleImageLoad])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (lockedColor) return // Stop updating when locked

    const canvas = canvasRef.current
    if (canvas) {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setCursorPosition({ x: e.clientX, y: e.clientY })
      const ctx = canvas.getContext("2d")
      if (ctx) {
        const imageData = ctx.getImageData(x, y, 1, 1)
        const [r, g, b] = imageData.data
        const hex = rgbToHex(r, g, b)
        setColor({ hex, rgb: `rgb(${r}, ${g}, ${b})` })
      }
    }
  }, [lockedColor])

  const handleCanvasClick = () => {
    if (color) {
      setLockedColor(color) // Lock the color on click
    }
  }

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImageUrl(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert(`Copied: ${text}`)
  }

  const handleMouseEnter = () => setShowCustomCursor(true)
  const handleMouseLeave = () => setShowCustomCursor(false)

  return (
    <div className="container mx-auto min-h-full flex items-center justify-center w-full">
      <Card className="w-full max-w-5xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Colore
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="imageUrl" className="text-lg font-semibold">
                Image URL:
              </Label>
              <Input
                type="text"
                id="imageUrl"
                value={imageUrl}
                onChange={handleImageUrlChange}
                placeholder="Enter image URL"
                className="w-full mt-1"
              />
            </div>
            <div>
              <Label htmlFor="fileUpload" className="text-lg font-semibold">
                Upload image:
              </Label>
              <div className="mt-1 flex items-center space-x-2">
                <Input type="file" id="fileUpload" onChange={handleFileUpload} accept="image/*" className="hidden" />
                <Button onClick={() => document.getElementById("fileUpload")?.click()} variant="outline">
                  <UploadIcon className="mr-2 h-4 w-4" /> Choose File
                </Button>
                <span className="text-sm text-gray-500">{imageUrl ? "File selected" : "No file chosen"}</span>
              </div>
            </div>
            {imageUrl && (
              <div className="mt-6 relative inline-block w-full flex justify-center" ref={containerRef}>
                <img
                  ref={imageRef}
                  src={imageUrl || "/placeholder.svg"}
                  alt="Uploaded image"
                  onLoad={handleImageLoad}
                  className="hidden"
                />
                <canvas
                  ref={canvasRef}
                  onMouseMove={handleMouseMove}
                  onClick={handleCanvasClick}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  width={FIXED_WIDTH}
                  height={FIXED_HEIGHT}
                  className="rounded-lg shadow-lg"
                  style={{ cursor: lockedColor ? "default" : "crosshair" }}
                />
              </div>
            )}
            {lockedColor && (
  <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
    <h2 className="text-xl font-semibold mb-2">Selected Color:</h2>
    <div className="flex items-center space-x-4">
      <div
        className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
        style={{ backgroundColor: lockedColor.hex }}
      ></div>
      <div>
        <p className="font-mono text-lg flex items-center">
          HEX: {lockedColor.hex}
          <button
            className="ml-2 p-1 text-sm bg-gray-200 rounded flex items-center"
            onClick={() => copyToClipboard(lockedColor.hex)}
          >
            <ClipboardCopy className="w-4 h-4 mr-1" /> Copy
          </button>
        </p>
        <p className="font-mono text-lg flex items-center">
          RGB: {lockedColor.rgb}
          <button
            className="ml-2 p-1 text-sm bg-gray-200 rounded flex items-center"
            onClick={() => copyToClipboard(lockedColor.rgb)}
          >
            <ClipboardCopy className="w-4 h-4 mr-1" /> Copy
          </button>
        </p>
      </div>
    </div>
    <button
      className="mt-4 px-4 py-2 bg-black text-white rounded hover:text-gray transition"
      onClick={() => setLockedColor(null)}
    >
      Reset
    </button>
  </div>
)}

          </div>
          {showCustomCursor && color && (
            <ColorPickerCursor color={color.hex} x={cursorPosition.x} y={cursorPosition.y} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
