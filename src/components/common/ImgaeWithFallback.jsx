import { useState } from "react";

const ImageWithFallback = ({
  src,
  alt,
  className,
  fallback = "https://via.placeholder.com/500x750?text=No+Image",
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => setImgSrc(fallback)}
      loading="lazy"
    />
  );
};
export default ImageWithFallback;
