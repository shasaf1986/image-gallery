import React, { FC, useContext, useEffect, useRef } from 'react';
// import useMeasure from '../photoGrid/hook';
import { MasonryItemContext } from './masonry';
import ResizeObserver from 'resize-observer-polyfill';
export interface ItemProps {
  isStable: boolean;
}

export function useUpdatedRef<T>(value: T) {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}

export const Item: FC<ItemProps> = ({ children, isStable }) => {
  const {
    index,
    offsetLeft,
    offsetTop,
    width,
    isVisible,
    onItemResize,
  } = useContext(MasonryItemContext);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isStable) {
      return;
    }
    const ro = new ResizeObserver(() => {
      if (!ref.current) {
        return;
      }
      const height = ref.current.offsetHeight;
      onItemResize(height, index);
    });

    ro.observe(ref.current!);
    return () => {
      ro.disconnect();
    };
  }, [onItemResize, index, isStable]);

  return (
    <div
      style={{
        position: 'absolute',
        width,
        transform: `translate(${offsetLeft}px, ${offsetTop}px)`,
        visibility: isVisible ? undefined : 'hidden',
      }}
      ref={ref}
    >
      {children}
    </div>
  );
};
