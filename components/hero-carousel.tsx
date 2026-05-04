"use client";

import * as React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type HeroCarouselProps = {
  images: ReadonlyArray<{ src: string; alt: string }>;
};

export function HeroCarousel({ images }: HeroCarouselProps) {
  const plugin = React.useRef(
    Autoplay({ delay: 2600, stopOnInteraction: true }),
  );

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={image.src}>
            <div className="p-1 sm:p-2">
              <Card className="overflow-hidden">
                <CardContent className="relative h-[240px] sm:h-[320px] lg:h-[400px]">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    priority={index === 0}
                    className="object-cover"
                    sizes="100vw"
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-3" />
      <CarouselNext className="right-3" />
    </Carousel>
  );
}
