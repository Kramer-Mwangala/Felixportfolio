"use client";

import { CldImage as NextCldImage } from "next-cloudinary";
import Image from "next/image";

interface CloudinaryImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  crop?: "fill" | "scale" | "fit" | "thumb" | "crop";
  gravity?: "auto" | "face" | "faces" | "center";
  quality?: number | "auto";
  format?: "auto" | "webp" | "png" | "jpg";
}

/**
 * Smart image component that uses Cloudinary for cloud images,
 * Bunny CDN for static assets, and falls back to Next/Image for other images
 */
export function CloudinaryImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className,
  sizes,
  priority = false,
  placeholder = "blur",
  blurDataURL,
  crop = "fill",
  gravity = "auto",
  quality = "auto",
  format = "auto",
}: CloudinaryImageProps) {
  // Check if the image is from Cloudinary
  const isCloudinaryUrl =
    src?.includes("cloudinary.com") || src?.includes("res.cloudinary.com");

  // Check if the image is from Bunny CDN
  const isBunnyCdnUrl = src?.includes("b-cdn.net");

  // Extract the public ID from Cloudinary URL
  const getPublicId = (url: string): string => {
    if (!isCloudinaryUrl) return url;

    // Match pattern: /upload/v{version}/{public_id} or /upload/{public_id}
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z]+)?$/);
    return match ? match[1] : url;
  };

  // Use Next/Image for non-Cloudinary images (including Bunny CDN)
  if (!isCloudinaryUrl || isBunnyCdnUrl) {
    return fill ? (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        sizes={sizes}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        loading={priority ? "eager" : "lazy"}
      />
    ) : (
      <Image
        src={src}
        alt={alt}
        width={width || 800}
        height={height || 600}
        className={className}
        sizes={sizes}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        loading={priority ? "eager" : "lazy"}
      />
    );
  }

  const publicId = getPublicId(src);

  // Use CldImage for Cloudinary images
  return fill ? (
    <NextCldImage
      src={publicId}
      alt={alt}
      fill
      className={className}
      sizes={sizes}
      priority={priority}
      crop={crop}
      gravity={gravity}
      quality={quality}
      format={format}
    />
  ) : (
    <NextCldImage
      src={publicId}
      alt={alt}
      width={width || 800}
      height={height || 600}
      className={className}
      sizes={sizes}
      priority={priority}
      crop={crop}
      gravity={gravity}
      quality={quality}
      format={format}
    />
  );
}

export { NextCldImage as CldImage };
