import Image from 'next/image'
import type { ProductImage } from '@/lib/products'

export default function WorkbookCover({
  image,
  className = '',
  sizes = '(max-width: 640px) 60vw, 200px',
  priority = false,
}: {
  image: ProductImage
  className?: string
  sizes?: string
  priority?: boolean
}) {
  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-l-sm rounded-r-xl bg-gradient-to-br from-clay/60 via-clay-light/40 to-forest/50 p-1 shadow-[0_28px_55px_-32px_rgba(20,40,25,0.8)] ${className}`}
    >
      <div className="relative h-full w-full overflow-hidden rounded-l-[2px] rounded-r-[0.95rem] bg-sand">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover saturate-[1.08]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/25 via-black/5 to-transparent"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-l-[2px] rounded-r-[0.95rem] ring-1 ring-inset ring-forest/15"
        />
      </div>
    </div>
  )
}
