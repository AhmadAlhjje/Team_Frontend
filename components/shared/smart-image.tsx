import Image, { type ImageProps } from 'next/image';

import { isOptimizableImage } from '@/lib/utils/images';

/**
 * next/image that never breaks on unknown hosts: images from allowed origins
 * are optimized (AVIF/WebP, responsive sizes), others are served as-is.
 */
export function SmartImage({ alt, ...props }: ImageProps & { src: string }) {
  return <Image alt={alt} {...props} unoptimized={props.unoptimized ?? !isOptimizableImage(props.src)} />;
}
