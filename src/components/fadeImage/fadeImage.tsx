import React from 'react';
import Fade from '@material-ui/core/Fade';

interface Props {
  src: string;
  className?: string;
  alt?: string;
  visible: boolean;
}

const FadeImage: React.FC<Props> = ({ src, className, alt, visible }) => {

  return (
    <Fade in>
      <img
        onLoad={(event) => {
          console.log(event.currentTarget.height);
          console.log(event.currentTarget.width);
        }}
        style={{ width: '100%' }}
        className={className}
        src={src}
        alt={alt}
      />
    </Fade>
  );
}

export default FadeImage;
