export default function getImageSrc(url?: string | null) {
  if (!url) {
    return undefined;
  }

  if (process.env.NODE_ENV === "production") {
    return url;
  }

  return `/api/${url}`;
}
