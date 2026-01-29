import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
}

export function formatDateRange(
  start: string | Date,
  end?: string | Date | null,
  isCurrent?: boolean,
): string {
  const startDate = formatDate(start);
  if (isCurrent) return `${startDate} - Present`;
  if (end) return `${startDate} - ${formatDate(end)}`;
  return startDate;
}

export const categoryLabels: Record<string, string> = {
  branding: "Branding",
  "logo-design": "Logo Design",
  "ui-ux": "UI/UX",
  posters: "Posters",
  "social-media": "Social Media",
  illustration: "Illustration",
  packaging: "Packaging",
  other: "Other",
};

export function getCategoryLabel(category: string): string {
  return categoryLabels[category] || category;
}

/**
 * Get the full CDN URL for a public asset
 * @param path - Path relative to the public folder (e.g., "videos&reels/video.mp4")
 * @returns Full CDN URL with proper encoding
 */
export function getCdnUrl(path: string): string {
  const cdnUrl = process.env.NEXT_PUBLIC_BUNNY_CDN_URL || "https://FelixTuk.b-cdn.net";
  if (!cdnUrl) {
    console.warn("NEXT_PUBLIC_BUNNY_CDN_URL not configured");
    return path;
  }

  // Remove leading slash if present
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  // Ensure path starts with 'public/' if not already
  const fullPath = cleanPath.startsWith("public/")
    ? cleanPath
    : `public/${cleanPath}`;

  // Encode the path segments (spaces, special chars) but preserve slashes
  const encodedPath = fullPath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return `${cdnUrl}/${encodedPath}`;
}
