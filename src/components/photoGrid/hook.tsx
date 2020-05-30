import { useState, useRef, useEffect } from 'react';
import ResizeObserver from 'resize-observer-polyfill';

const subscribets = new Map<Element, (rect: DOMRectReadOnly) => void>();

const ro = new ResizeObserver((entries) => {
  entries.forEach(({ target, contentRect }) => {
    const fn = subscribets.get(target)!;
    fn(contentRect as any);
  });
});

function register(
  target: Element,
  subscriber: (rect: DOMRectReadOnly) => void
) {
  subscribets.set(target, subscriber);
  ro.observe(target);

  return () => {
    subscribets.delete(target);
    ro.unobserve(target);
  };
}

export type ContentRect = Pick<
  DOMRectReadOnly,
  'x' | 'y' | 'top' | 'left' | 'right' | 'bottom' | 'height' | 'width'
>;

export function useMeasure<T extends Element = any>() {
  const ref = useRef<T | null>(null);
  const [rect, setRect] = useState<ContentRect>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  });

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    return register(ref.current!, setRect);
  }, []);

  return { ref, rect };
}

export default useMeasure;
