"use client";

import * as React from "react";
import { Slider as SliderPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max],
  );

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "data-vertical: relative flex h-full max-h-10 w-full touch-none items-center overflow-hidden select-none data-disabled:opacity-20 data-vertical:h-full data-vertical:w-auto data-vertical:flex-col md:max-h-20",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="relative grow overflow-hidden rounded-sm bg-amber-400/12 data-horizontal:h-full data-horizontal:w-full data-vertical:h-full data-vertical:w-1 md:rounded-lg"
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="bg-chart-2 absolute rounded-sm select-none data-horizontal:h-full data-vertical:w-full"
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className="hover: focus-visible: relative mr-5 block size-2 h-4 w-1 shrink-0 rounded-full bg-white/0 transition-[color,box-shadow] select-none after:absolute after:-inset-2 hover:ring-1 focus-visible:outline-hidden active:ring-1 disabled:pointer-events-none disabled:opacity-50 md:h-6 md:rounded-md md:bg-white/50"
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
