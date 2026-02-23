"use client"

import { useState, useRef } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { X, Plus, Image as ImageIcon, GripVertical } from "lucide-react"

const MAX_IMAGES = 3

export default function MultiImageUpload({ 
  value = [], 
  onChange, 
  label = "Fotos",
  maxImages = MAX_IMAGES 
}) {
  const [draggedIndex, setDraggedIndex] = useState(null)
  const fileInputRef = useRef(null)
  
  const images = Array.isArray(value) ? value : (value ? [value] : [])
  
  const triggerFileUpload = () => {
    if (images.length >= maxImages) return
    fileInputRef.current?.click()
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    const remainingSlots = maxImages - images.length
    if (remainingSlots <= 0) return

    const filesToProcess = files.slice(0, remainingSlots)

    const promises = filesToProcess.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.readAsDataURL(file)
      })
    })

    Promise.all(promises).then(newBase64Images => {
      onChange([...images, ...newBase64Images])
    })

    if (e.target) e.target.value = ""
  }

  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index)
    onChange(newImages)
  }
  
  const handleImageChange = (index, url) => {
    const newImages = [...images]
    newImages[index] = url
    onChange(newImages)
  }
  
  const handleEditImageFile = (index, file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      handleImageChange(index, reader.result)
    }
    reader.readAsDataURL(file)
  }
  
  const handleDragStart = (e, index) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = "move"
  }
  
  const handleDragOver = (e, index) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return
    
    const newImages = [...images]
    const draggedItem = newImages[draggedIndex]
    newImages.splice(draggedIndex, 1)
    newImages.splice(index, 0, draggedItem)
    
    setDraggedIndex(index)
    onChange(newImages)
  }
  
  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  return (
    <div className="space-y-3">
      <input 
        type="file" 
        multiple
        accept="image/*"
        aria-label="Selecionar imagens"
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFileSelect}
      />
      
      <div className="flex items-center justify-between">
        <Label>{label} ({images.length}/{maxImages})</Label>
        {images.length < maxImages && (
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={triggerFileUpload}
          >
            <Plus className="h-4 w-4 mr-1" />
            Adicionar
          </Button>
        )}
      </div>
      
      {images.length === 0 ? (
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
          onClick={triggerFileUpload}
        >
          <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">Clique para selecionar imagens</p>
          <p className="text-xs text-gray-400 mt-1">Máximo de {maxImages} imagens</p>
        </div>
      ) : (
        <div className="space-y-2">
          {images.map((url, index) => (
            <div 
              key={index}
              className={`flex items-center gap-2 p-2 border rounded-lg bg-gray-50 ${draggedIndex === index ? 'opacity-50' : ''}`}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
            >
              <div className="cursor-grab">
                <GripVertical className="h-5 w-5 text-gray-400" />
              </div>
              
              <div className="flex-shrink-0 w-16 h-16 rounded overflow-hidden bg-white border">
                {url ? (
                  <img 
                    src={url} 
                    alt={`Imagem ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-gray-300" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium text-gray-500">
                    {index === 0 ? "Capa" : `Foto ${index + 1}`}
                  </span>
                </div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleEditImageFile(index, e.target.files[0])}
                  className="text-xs h-8"
                />
              </div>
              
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={() => handleRemoveImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
      
      {images.length > 0 && (
        <p className="text-xs text-gray-500">
          Arraste para reordenar. A primeira imagem será a capa.
        </p>
      )}
    </div>
  )
}