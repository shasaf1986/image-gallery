import React, { useState, useRef, useEffect } from 'react';
import Fade from '@material-ui/core/Fade';

interface Props {
  src: string;
  className?: string;
  alt?: string;
}

const FadeImage: React.FC<Props> = ({ src, className, alt }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const mounted = useRef(false);
  useEffect(() => {
    // source changed
    if (!mounted.current) {
      mounted.current = true;
    } else {
      // source changed
      setIsLoaded(false);
    }
  }, [src]);

  return (
    <Fade in={isLoaded}>
      <img
        className={className}
        src={src}
        alt={alt}
        onLoad={() => {
          setIsLoaded(true);
        }}
      />
    </Fade>
  );
}

export default FadeImage;
