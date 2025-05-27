import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null }

export function formatTemperature(
  temp: number,
  { metric = true, unit = true }: { metric?: boolean; unit?: boolean } = {}
): string {
  if (!metric) {
    // Convert Celsius to Fahrenheit
    temp = (temp * 9) / 5 + 32
  }
  const value = Math.round(temp)
  return unit ? `${value}°${metric ? 'C' : 'F'}` : value.toString()
}
