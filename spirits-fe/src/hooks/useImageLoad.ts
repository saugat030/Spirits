import { useState, useEffect } from "react";

export function useImageLoad(key: string) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [key]);

  const handleLoad = () => setImageLoaded(true);
  const handleError = () => {
    setImageLoaded(true);
    setImageError(true);
  };

  return {
    imageLoaded,
    imageError,
    showSpinner: !imageLoaded && !imageError,
    handleLoad,
    handleError,
  };
}
