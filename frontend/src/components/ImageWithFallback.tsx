import React, { useState } from 'react';

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  // Ordered list of sources to try. Falls back to the next when an error occurs.
  sources: string[];
}

const ImageWithFallback: React.FC<Props> = ({ sources, alt, ...imgProps }) => {
  const [index, setIndex] = useState(0);
  const currentSrc = sources[Math.min(index, sources.length - 1)];

  return (
    <img
      {...imgProps}
      alt={alt}
      src={currentSrc}
      onError={() => {
        // Move to next source if available
        setIndex((i) => (i < sources.length - 1 ? i + 1 : i));
      }}
    />
  );
};

export default ImageWithFallback;
