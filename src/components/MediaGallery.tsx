import { useEffect, useState } from 'react'

import type { Screenshot } from '@/content'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils'

export function MediaGallery({ shots }: { shots: Screenshot[] }) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) return
    const onSelect = () => setCurrent(api.selectedScrollSnap())
    onSelect()
    api.on('select', onSelect)
    return () => {
      api.off('select', onSelect)
    }
  }, [api])

  return (
    <div className="flex flex-col gap-2">
      <Carousel setApi={setApi} opts={{ loop: true }} className="bg-black">
        <CarouselContent className="ml-0">
          {shots.map((s, i) => (
            <CarouselItem key={s.file} className="pl-0">
              <img
                src={`/images/shots/${s.file}.jpg`}
                alt={s.alt}
                width={1280}
                height={720}
                loading={i === 0 ? 'eager' : 'lazy'}
                className="aspect-video w-full object-cover"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 border-0 bg-black/60 text-white hover:bg-black/80 hover:text-white" />
        <CarouselNext className="right-2 border-0 bg-black/60 text-white hover:bg-black/80 hover:text-white" />
      </Carousel>

      <div className="flex gap-1.5 overflow-x-auto pb-1" role="tablist" aria-label="Screenshots">
        {shots.map((s, i) => (
          <button
            key={s.file}
            type="button"
            role="tab"
            aria-selected={current === i}
            aria-label={`Screenshot ${i + 1}`}
            onClick={() => api?.scrollTo(i)}
            className={cn(
              'shrink-0 border-2 border-transparent opacity-60 transition hover:opacity-100',
              current === i && 'border-white opacity-100',
            )}
          >
            <img
              src={`/images/thumbs/${s.file}.jpg`}
              alt=""
              width={240}
              height={135}
              className="h-[65px] w-[116px] object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
