import * as React from "react"
import NextImage, { ImageProps as NextImageProps } from "next/image"

interface ImageProps extends Omit<NextImageProps, 'ref'> {
  // Add any additional props specific to your Image component
}

export const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  (props, ref) => {
    return <NextImage {...props} ref={ref} />
  }
)

Image.displayName = "Image"
