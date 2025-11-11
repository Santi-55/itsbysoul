import { useState } from 'react'

export default function LazyImage({ src, alt, className }: { src: string; alt?: string; className?: string }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <div className={`relative ${className ?? ''}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
      {!loaded && (
        <div className="absolute inset-0 bg-zinc-800 animate-pulse" />
      )}
    </div>
  )
}
