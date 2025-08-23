import { useEffect, useRef, useState } from "react"
import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "../../components/ui/carousel"
import { getListBanner } from "../../service/movie.api"
import type { Banner } from "../../interfaces/movie.interface"

export function Example() {
  const [banners, setBanners] = useState<Banner[]>([])

  const plugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  )

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getListBanner()
        if (Array.isArray(data)) {
          setBanners(data)
        }
      } catch (error) {
        console.error("Lỗi khi lấy banner:", error)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Carousel
        plugins={[plugin.current]}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        className="rounded-lg overflow-hidden"
      >
        <CarouselContent>
          {banners.length > 0 ? (
            banners.map((banner) => (
              <CarouselItem key={banner.maBanner}>
                <img
                  src={banner.hinhAnh}
                  alt={`Banner ${banner.maBanner}`}
                  className="w-full h-full object-cover"
                />
              </CarouselItem>
            ))
          ) : (
            <CarouselItem>
              <div className="w-full h-64 flex items-center justify-center bg-gray-200">
                Đang tải...
              </div>
            </CarouselItem>
          )}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}
