"use client"

import { useState } from "react"

export function SizeSelector() {
  const sizes = ["S", "M", "L", "XL"]
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div>
      <h3 className="mb-3 font-semibold text-white text-sm tracking-wide">사이즈 선택</h3>
      <div className="flex gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => setSelected(size)}
            className={`w-12 h-12 text-sm font-medium rounded-lg border transition-colors duration-150
              ${
                selected === size
                  ? "bg-white text-black border-black"
                  : "bg-black text-white border-white hover:bg-gray-700"
              }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  )
}
