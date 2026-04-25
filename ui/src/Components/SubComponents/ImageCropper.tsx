import React, { useState, useRef, useCallback } from 'react'
import ReactCrop, {
  type Crop,
  type PixelCrop,
  centerCrop,
  makeAspectCrop,
} from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

interface ImageCropperProps {
  currentImage?: string
  onImageCropped: (croppedImageBase64: string) => void
  onImageRemoved?: () => void
  aspectRatio?: number
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      { unit: '%', width: 90 },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  )
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  currentImage,
  onImageCropped,
  onImageRemoved,
  aspectRatio = 3 / 1,
}) => {
  const [imgSrc, setImgSrc] = useState('')
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [isCropping, setIsCropping] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        setImgSrc(reader.result?.toString() || '')
        setIsCropping(true)
      })
      reader.readAsDataURL(e.target.files[0])
    }
  }

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget
      setCrop(centerAspectCrop(width, height, aspectRatio))
    },
    [aspectRatio]
  )

  const getCroppedImg = useCallback(() => {
    if (!completedCrop || !imgRef.current) return

    const image = imgRef.current
    const canvas = document.createElement('canvas')
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

    canvas.width = completedCrop.width * scaleX
    canvas.height = completedCrop.height * scaleY

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    )

    const base64 = canvas.toDataURL('image/jpeg', 0.85)
    onImageCropped(base64)
    setIsCropping(false)
    setImgSrc('')
    setCrop(undefined)
    setCompletedCrop(undefined)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [completedCrop, onImageCropped])

  const cancelCrop = () => {
    setIsCropping(false)
    setImgSrc('')
    setCrop(undefined)
    setCompletedCrop(undefined)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleRemoveImage = () => {
    if (onImageRemoved) onImageRemoved()
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div>
      <label className='block text-sm font-medium text-gray-600 mb-1.5'>
        Goal Image
      </label>

      {/* Crop Modal */}
      {isCropping && imgSrc && (
        <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[60] p-4'>
          <div className='bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col'>
            <div className='flex items-center justify-between px-5 pt-5 pb-2'>
              <h3 className='text-base font-bold text-gray-900'>
                Crop Image
              </h3>
              <button
                type='button'
                onClick={cancelCrop}
                className='w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors'>
                <svg
                  className='h-5 w-5'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth={2}>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>

            <div className='px-5 py-3 overflow-auto flex-1 flex items-center justify-center'>
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspectRatio}>
                <img
                  ref={imgRef}
                  alt='Crop preview'
                  src={imgSrc}
                  onLoad={onImageLoad}
                  style={{ maxHeight: '60vh', maxWidth: '100%' }}
                />
              </ReactCrop>
            </div>

            <div className='px-5 pb-5 pt-2 flex gap-3'>
              <button
                type='button'
                onClick={getCroppedImg}
                className='flex-1 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm'>
                Apply Crop
              </button>
              <button
                type='button'
                onClick={cancelCrop}
                className='flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors'>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview & Upload Button */}
      {currentImage && !isCropping ? (
        <div className='relative group'>
          <img
            src={currentImage}
            alt='Goal'
            className='w-full h-36 object-cover rounded-xl border border-gray-200'
          />
          <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2'>
            <button
              type='button'
              onClick={() => fileInputRef.current?.click()}
              className='px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors'>
              Change
            </button>
            <button
              type='button'
              onClick={handleRemoveImage}
              className='px-3 py-1.5 text-xs font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors'>
              Remove
            </button>
          </div>
        </div>
      ) : !isCropping ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className='w-full h-28 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-colors'>
          <svg
            className='h-8 w-8 text-gray-400 mb-1'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth={1.5}>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z'
            />
          </svg>
          <span className='text-xs text-gray-400'>Click to upload image</span>
        </div>
      ) : null}

      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        onChange={onSelectFile}
        className='hidden'
      />
    </div>
  )
}

export default ImageCropper
