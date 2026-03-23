'use client'

import { useState, useRef, useEffect } from 'react'
import { X } from 'lucide-react'

export function ImageZoom({ src, alt, className = '' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const imageRef = useRef(null)
  const touchStartDistance = useRef(0)
  const containerRef = useRef(null)

  // Reset quando fecha
  useEffect(() => {
    if (!isOpen) {
      setZoom(1)
      setPosition({ x: 0, y: 0 })
    }
  }, [isOpen])

  // Fechar com ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    const handleTouchMove = (e) => {
      if (isOpen) e.preventDefault()
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [isOpen])

  // Calcular distância entre dois pontos (pinch)
  const getTouchDistance = (e) => {
    if (e.touches.length !== 2) return 0
    const dx = e.touches[0].clientX - e.touches[1].clientX
    const dy = e.touches[0].clientY - e.touches[1].clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  // Calcular centro do pinch
  const getTouchCenter = (e) => {
    if (e.touches.length !== 2) return { x: 0, y: 0 }
    return {
      x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
      y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
    }
  }

  // Touch start - detectar pinch
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      touchStartDistance.current = getTouchDistance(e)
    }
    if (e.touches.length === 1) {
      setDragStart({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      })
      setIsDragging(true)
    }
  }

  // Touch move - pinch zoom ou dragging
  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && imageRef.current) {
      e.preventDefault()
      const currentDistance = getTouchDistance(e)
      const scale = currentDistance / touchStartDistance.current
      const newZoom = Math.max(1, Math.min(zoom * scale, 5))
      
      // Atualizar zoom só se mudou significativamente
      if (Math.abs(newZoom - zoom) > 0.05) {
        setZoom(newZoom)
        touchStartDistance.current = currentDistance
      }
    } else if (zoom > 1 && isDragging && e.touches.length === 1) {
      e.preventDefault()
      const dx = (e.touches[0].clientX - dragStart.x) / zoom
      const dy = (e.touches[0].clientY - dragStart.y) / zoom

      const rect = imageRef.current?.getBoundingClientRect()
      if (rect) {
        const maxX = (rect.width * (zoom - 1)) / 2
        const maxY = (rect.height * (zoom - 1)) / 2

        const newX = Math.max(-maxX, Math.min(maxX, position.x + dx))
        const newY = Math.max(-maxY, Math.min(maxY, position.y + dy))

        setPosition({ x: newX, y: newY })
        setDragStart({
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        })
      }
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    touchStartDistance.current = 0
  }

  // Desktop: scroll para zoom
  const handleWheel = (e) => {
    if (!isOpen) return
    e.preventDefault()

    const delta = e.deltaY > 0 ? 0.9 : 1.1
    const newZoom = Math.max(1, Math.min(zoom * delta, 5))
    setZoom(newZoom)
  }

  // Desktop: mouse move para pan
  const handleMouseMove = (e) => {
    if (!imageRef.current || zoom === 1) return

    const rect = imageRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const maxX = (rect.width * (zoom - 1)) / 2
    const maxY = (rect.height * (zoom - 1)) / 2

    const newX = Math.max(-maxX, Math.min(maxX, x - rect.width / 2))
    const newY = Math.max(-maxY, Math.min(maxY, y - rect.height / 2))

    setPosition({ x: newX, y: newY })
  }

  return (
    <>
      {/* Imagem clicável */}
      <div 
        className={`relative cursor-pointer ${className}`}
        onClick={() => setIsOpen(true)}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-contain p-4 transition-all duration-300 hover:brightness-90"
        />
      </div>

      {/* Modal fullscreen ao clicar */}
      {isOpen && (
        <div
          ref={containerRef}
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm overflow-hidden"
          onClick={() => setIsOpen(false)}
          onWheel={handleWheel}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Botão fechar */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
            title="Fechar (ESC)"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Container da imagem com zoom */}
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              ref={imageRef}
              src={src}
              alt={alt}
              className="select-none transition-transform duration-200"
              style={{
                transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                cursor: zoom > 1 ? 'grab' : 'default',
                maxWidth: '90vw',
                maxHeight: '90vh',
                objectFit: 'contain',
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Info de controles */}
          <div className="absolute bottom-4 left-4 right-4 text-white/60 text-sm text-center pointer-events-none">
            {zoom > 1 ? (
              <>
                <p className="hidden md:block">Mova o mouse para navegar • Scroll para zoom</p>
                <p className="md:hidden">Pinça para zoom • Arraste para navegar</p>
              </>
            ) : (
              <>
                <p className="hidden md:block">Scroll para ampliar</p>
                <p className="md:hidden">Pinça para ampliar</p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
