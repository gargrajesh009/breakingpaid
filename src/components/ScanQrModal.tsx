import jsQR from 'jsqr'
import { AlertTriangle, ScanLine, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { extractUpiId } from '../lib/upi'

interface ScanQrModalProps {
  onClose: () => void
  onScanned: (upiId: string) => void
}

export function ScanQrModal({ onClose, onScanned }: ScanQrModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number>(0)
  const [error, setError] = useState('')

  useEffect(() => {
    let stream: MediaStream | null = null
    let cancelled = false

    async function start() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        })
        if (cancelled || !videoRef.current) return
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        frameRef.current = requestAnimationFrame(tick)
      } catch {
        if (!cancelled) setError('Could not access the camera. Check your browser permissions and try again.')
      }
    }

    function tick() {
      const video = videoRef.current
      const canvas = canvasRef.current
      if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
        frameRef.current = requestAnimationFrame(tick)
        return
      }

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const result = jsQR(imageData.data, imageData.width, imageData.height)

      if (result) {
        const upiId = extractUpiId(result.data)
        if (upiId) {
          onScanned(upiId)
          return
        }
        setError("That QR code doesn't contain a UPI ID. Try a merchant payment QR.")
      }

      frameRef.current = requestAnimationFrame(tick)
    }

    start()

    return () => {
      cancelled = true
      cancelAnimationFrame(frameRef.current)
      stream?.getTracks().forEach((track) => track.stop())
    }
  }, [onScanned])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm animate-fade-slide-in rounded-3xl border border-white/10 bg-[#12141f] p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-base font-semibold text-white">
            <ScanLine className="h-4 w-4" />
            Scan merchant QR
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full text-white/50 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-black">
          <video ref={videoRef} className="aspect-square w-full object-cover" muted playsInline />
          <canvas ref={canvasRef} className="hidden" />
          <div className="pointer-events-none absolute inset-8 rounded-2xl border-2 border-white/50" />
        </div>

        {error ? (
          <p className="mt-4 flex items-start gap-1.5 text-sm text-amber-300">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </p>
        ) : (
          <p className="mt-4 text-center text-sm text-white/50">Point your camera at a UPI QR code</p>
        )}
      </div>
    </div>
  )
}
