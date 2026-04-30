'use client'

import { useEffect, useRef } from 'react'

interface MapProps {
  latitude: number
  longitude: number
  zoom?: number
  markers?: Array<{ lat: number; lng: number; label?: string }>
  className?: string
}

export default function MapComponent({
  latitude,
  longitude,
  zoom = 13,
  markers,
  className = 'h-48 w-full rounded-xl',
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<unknown>(null)
  const initializedRef = useRef(false)

  useEffect(() => {
    if (!mapRef.current || initializedRef.current) return
    initializedRef.current = true

    const initMap = async () => {
      const L = (await import('leaflet')).default
      if (!mapRef.current) return
      const m = L.map(mapRef.current).setView([latitude, longitude], zoom)
      mapInstanceRef.current = m

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
      }).addTo(m)

      const icon = L.divIcon({
        html: `<div style="background:#2563EB;width:24px;height:24px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        className: '',
      })

      if (markers && markers.length > 0) {
        markers.forEach((marker) => {
          L.marker([marker.lat, marker.lng], { icon }).addTo(m).bindPopup(marker.label || '')
        })
      } else {
        L.marker([latitude, longitude], { icon }).addTo(m)
      }

      setTimeout(() => m.invalidateSize(), 100)
    }

    initMap()

    return () => {
      if (mapInstanceRef.current) {
        (mapInstanceRef.current as { remove: () => void }).remove()
        mapInstanceRef.current = null
      }
    }
  }, [latitude, longitude, zoom, markers])

  return <div ref={mapRef} className={className} />
}
