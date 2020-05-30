import React, { FC, useContext, useState } from 'react';
import { ImageRatiosContext } from './imageRatiosContext';

export interface MasnoryImageProps
  extends Pick<Required<JSX.IntrinsicElements['img']>, 'onLoad' | 'onError'> {
  src: string;
  alt?: string;
  className?: string;
  imgClassName?: string;
}

export const MasnoryImage: FC<MasnoryImageProps> = ({
  src,
  alt,
  onLoad,
  onError,
  className,
  imgClassName,
}) => {
  const imageRatios = useContext(ImageRatiosContext);
  const [imageRatio, setImageRatio] = useState(imageRatios.get(src));

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        paddingTop: `${(imageRatio || 0) * 100}%`,
      }}
    >
      <img
        className={imgClassName}
        onError={onError}
        style={{
          top: 0,
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}
        onLoad={(event) => {
          const { currentTarget } = event;
          const newRatio =
            currentTarget.naturalHeight / currentTarget.naturalWidth;
          imageRatios.set(src, newRatio);
          if (newRatio !== imageRatio) {
            setImageRatio(newRatio);
          }
          onLoad(event);
        }}
        alt={alt}
        src={src}
      />
    </div>
  );
};
