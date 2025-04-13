"use client"

import { useState } from "react"
import { chains } from "../../config/chainConfig"

interface ChainSelectorProps {
  selectedChain: string
  onSelectChain: (chain: string) => void
}

export default function ChainSelector({ selectedChain, onSelectChain }: ChainSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (chain: string) => {
    onSelectChain(chain)
    setIsOpen(false)
  }

  const availableChains = Object.keys(chains).filter((key) => !chains[key].isTestnet)

  return (
    <div className="relative">
      <button
        type="button"
        className="w-full flex items-center justify-between px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <img
            src={chains[selectedChain]?.logoUrl || "/placeholder.svg?height=24&width=24"}
            alt={chains[selectedChain]?.name}
            className="w-6 h-6 mr-2 rounded-full"
          />
          <span>{chains[selectedChain]?.name}</span>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-gray-700 border border-gray-600 rounded-md shadow-lg">
          <ul className="py-1">
            {availableChains.map((chain) => (
              <li key={chain}>
                <button
                  type="button"
                  className={`w-full text-left px-3 py-2 flex items-center hover:bg-gray-600 ${
                    selectedChain === chain ? "bg-gray-600" : ""
                  }`}
                  onClick={() => handleSelect(chain)}
                >
                  <img
                    src={chains[chain]?.logoUrl || "/placeholder.svg?height=24&width=24"}
                    alt={chains[chain]?.name}
                    className="w-6 h-6 mr-2 rounded-full"
                  />
                  <span className="text-white">{chains[chain]?.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
