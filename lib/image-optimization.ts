/**
 * Image optimization utilities for better performance
 */

/**
 * Optimize Cloudinary image URL with transformations
 * @param url - Original Cloudinary image URL
 * @param options - Optimization options
 */
export function optimizeCloudinaryUrl(
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: "auto" | "low" | "high";
    format?: "auto" | "webp" | "jpg" | "png";
  } = {},
): string {
  if (!url || !url.includes("cloudinary.com")) {
    return url;
  }

  const {
    width = 800,
    height = 600,
    quality = "auto",
    format = "auto",
  } = options;

  // Extract public ID from URL
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z]+)?$/);
  if (!match) return url;

  const publicId = match[1];
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!cloudName) return url;

  // Build optimized URL with transformations
  const transformations = [
    "c_fill", // Crop and fill
    `w_${Math.round(width * 2)}`, // Double width for retina
    `h_${Math.round(height * 2)}`, // Double height for retina
    `q_${quality}`, // Quality
    `f_${format}`, // Format
  ].join(",");

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}`;
}

/**
 * Optimize Bunny CDN image URL with query parameters
 * @param url - Original Bunny CDN image URL
 * @param options - Optimization options
 */
export function optimizeBunnyCdnUrl(
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: number; // 1-100
  } = {},
): string {
  if (!url || !url.includes("b-cdn.net")) {
    return url;
  }

  const { width, height, quality = 80 } = options;
  const params = new URLSearchParams();

  if (width) params.append("width", width.toString());
  if (height) params.append("height", height.toString());
  params.append("quality", quality.toString());

  // Add cache busting and optimization params
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}${params.toString()}`;
}

/**
 * Get optimized image URL based on source
 */
export function getOptimizedImageUrl(
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: string | number;
  } = {},
): string {
  if (!url) return url;

  if (url.includes("cloudinary.com") || url.includes("res.cloudinary.com")) {
    return optimizeCloudinaryUrl(url, {
      width: options.width,
      height: options.height,
      quality: options.quality === "auto" ? "auto" : (options.quality as any),
    });
  }

  if (url.includes("b-cdn.net")) {
    return optimizeBunnyCdnUrl(url, {
      width: options.width,
      height: options.height,
      quality:
        typeof options.quality === "string" ? 80 : (options.quality as number),
    });
  }

  return url;
}
