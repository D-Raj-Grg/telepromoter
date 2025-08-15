"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

export interface SliderProps
  extends Omit<React.ComponentProps<typeof SliderPrimitive.Root>, 'value' | 'defaultValue' | 'onValueChange'> {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  onValueChange?: (value: number[]) => void;
  label?: string;
}

function Slider({
  className,
  value,
  defaultValue,
  onChange,
  onValueChange,
  label,
  min = 0,
  max = 100,
  ...props
}: SliderProps) {
  const handleValueChange = React.useCallback((newValue: number[]) => {
    const singleValue = newValue[0];
    onChange?.(singleValue);
    onValueChange?.(newValue);
  }, [onChange, onValueChange]);

  const sliderValue = value !== undefined ? [value] : undefined;
  const sliderDefaultValue = defaultValue !== undefined ? [defaultValue] : undefined;

  return (
    <div className="flex items-center gap-3 w-full">
      {label && (
        <label className="text-xs sm:text-sm font-medium text-white whitespace-nowrap min-w-fit">
          {label}: {value || defaultValue || min}
        </label>
      )}
      <SliderPrimitive.Root
        value={sliderValue}
        defaultValue={sliderDefaultValue}
        onValueChange={handleValueChange}
        min={min}
        max={max}
        className={cn(
          "relative flex w-full touch-none items-center select-none",
          className
        )}
        {...props}
      >
        <SliderPrimitive.Track
          className="bg-gray-600/80 relative h-2 w-full grow overflow-hidden rounded-full"
        >
          <SliderPrimitive.Range
            className="bg-blue-500 absolute h-full"
          />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          className="border-white bg-blue-500 ring-blue-400/50 block h-5 w-5 rounded-full border-2 shadow-lg transition-colors hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        />
      </SliderPrimitive.Root>
    </div>
  )
}

export { Slider }