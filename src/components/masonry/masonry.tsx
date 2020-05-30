import React, {
  FC,
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from 'react';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import isFunction from 'lodash/isFunction';
import { useUpdate } from 'react-use';
import ResizeObserver from 'resize-observer-polyfill';
import { ImageRatiosContext } from './imageRatiosContext';

export interface MasonryItem {
  src: string;
}

export type MasonryItemRender = () => JSX.Element[];

export interface MasonryProps {
  length: number;
  children: (index: number) => JSX.Element;
  onLoadMore: () => void;
  query?: string;
  hasMore: boolean;
  after: (isProcessing: boolean) => React.ReactNode;
}

interface Offset {
  offsetTop: number;
  offsetLeft: number;
}

function useRefMemo<T>(value: T | (() => T), deps: any[]) {
  const ref = useRef(isFunction(value) ? value() : value);

  const depsRef = useRef<undefined | any[]>();
  if (!isEqual(depsRef.current, deps)) {
    ref.current = isFunction(value) ? value() : value;
    depsRef.current = deps;
  }

  return ref;
}

const useDebounceCallback = (factory: () => void, deps: any[]) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fn = useCallback(debounce(factory, 0), deps);

  useEffect(
    () => () => {
      fn.cancel();
    },
    [fn]
  );

  return fn;
};

interface MasonryItemContextValue {
  offsetLeft: number;
  offsetTop: number;
  isVisible: boolean;
  index: number;
  width: number;
  onItemResize: (height: number, index: number) => void;
}

interface MasonryItemProviderProps extends MasonryItemContextValue {
  children: JSX.Element;
}

export const MasonryItemContext = React.createContext<MasonryItemContextValue>({
  isVisible: false,
  offsetLeft: 0,
  offsetTop: 0,
  index: 0,
  onItemResize: () => {},
  width: 0,
});

export const MasonryItemProvider = React.memo<MasonryItemProviderProps>(
  ({
    offsetLeft,
    offsetTop,
    isVisible,
    onItemResize,
    index,
    children,
    width,
  }) => {
    const value = useMemo(
      () => ({
        offsetLeft,
        offsetTop,
        isVisible,
        onItemResize,
        index,
        width,
      }),
      [offsetLeft, offsetTop, isVisible, onItemResize, index, width]
    );
    return (
      <MasonryItemContext.Provider value={value}>
        {children}
      </MasonryItemContext.Provider>
    );
  }
);

export const Masonry: FC<MasonryProps> = ({
  children,
  query = '',
  length,
  hasMore,
  onLoadMore,
  after,
}) => {
  const forceUpdate = useUpdate();
  // const [rowWidth, setRowWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);
  const numberOfRows = 4;
  const rowWidth = width / numberOfRows;
  const containerHeightRef = useRefMemo(0, [query, rowWidth]);
  const itemsToRenderRef = useRefMemo<number[]>(() => [], [query]);
  const lengthRef = useRefMemo(length, [length]);
  const onLoadMoreRef = useRefMemo(() => onLoadMore, [onLoadMore]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const itemOffsets = useMemo(() => new Map<number, Offset>(), [
    query,
    rowWidth,
  ]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const itemHeights = useMemo(() => new Map<number, number>(), [
    query,
    rowWidth,
  ]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const imageRatios = useMemo(() => new Map<string, number>(), [
    query,
    rowWidth,
  ]);

  const updateItemsToRender = useCallback(() => {
    const container = containerRef.current as HTMLElement;
    const containerRect = container.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const min = containerRect.top * -1;
    const max = windowHeight + min;
    let limit = 0;
    const rowHeights = Array.from({ length: numberOfRows }, () => 0);
    let newItemsToRender = Array.from({ length }).reduce<number[]>(
      (acc, _, index) => {
        const itemOffset = itemOffsets.get(index);
        const itemHeight = itemHeights.get(index);

        if (itemOffset === undefined || itemHeight === undefined) {
          return acc;
        }
        const isInRange =
          itemOffset.offsetTop + itemHeight >= min - 500 &&
          itemOffset.offsetTop <= max + 500;
        if (isInRange) {
          const minRowIndex = rowHeights.reduce((acc, rowHeight, rowIndex) => {
            if (rowHeight < rowHeights[acc]) {
              return rowIndex;
            }
            return acc;
          }, 0);
          rowHeights[minRowIndex] = itemOffset.offsetTop + itemHeight;
          return [...acc, index];
        }
        return acc;
      },
      []
    );

    const lodaMore = rowHeights.some((rowHeight) => rowHeight < max + 500);
    if (lodaMore) {
      newItemsToRender = Array.from({ length }).reduce<number[]>(
        (acc, _, index) => {
          const itemOffset = itemOffsets.get(index);
          const itemHeight = itemHeights.get(index);

          if (itemOffset === undefined || itemHeight === undefined) {
            limit++;
            if (limit > 50) {
              return acc;
            }
            return [...acc, index];
          }
          return acc;
        },
        newItemsToRender
      );
    }

    // console.log(rowHeights);
    if (!isEqual(itemsToRenderRef.current, newItemsToRender)) {
      itemsToRenderRef.current = newItemsToRender;
      forceUpdate();
    }
  }, [
    containerRef,
    forceUpdate,
    itemHeights,
    itemOffsets,
    itemsToRenderRef,
    length,
    numberOfRows,
  ]);

  const updateLayout = useDebounceCallback(() => {
    const rowHeights = Array.from({ length: numberOfRows }, () => 0);
    itemOffsets.clear();
    let stop = false;
    Array.from({ length: lengthRef.current }).forEach((_, itemIndex) => {
      if (stop) {
        return;
      }

      const itemHeight = itemHeights.get(itemIndex);
      if (itemHeight === undefined) {
        stop = true;
        return;
      }
      const minRowIndex = rowHeights.reduce((acc, rowHeight, rowIndex) => {
        if (rowHeight < rowHeights[acc]) {
          return rowIndex;
        }
        return acc;
      }, 0);
      itemOffsets.set(itemIndex, {
        offsetLeft: rowWidth * minRowIndex,
        offsetTop: rowHeights[minRowIndex],
      });
      rowHeights[minRowIndex] += itemHeight!;
    });

    containerHeightRef.current = rowHeights.reduce(
      (acc, rowHeight) => (rowHeight > acc ? rowHeight : acc),
      0
    );
    updateItemsToRender();
    forceUpdate();
  }, [
    numberOfRows,
    rowWidth,
    itemHeights,
    itemOffsets,
    containerHeightRef,
    lengthRef,
    updateItemsToRender,
  ]);

  useEffect(() => {
    const onChange = () => {
      updateItemsToRender();
    };

    const onChangeDebounced = debounce(onChange, 10);

    window.addEventListener('scroll', onChangeDebounced);
    window.addEventListener('resize', onChangeDebounced);

    return () => {
      window.removeEventListener('scroll', onChangeDebounced);
      window.removeEventListener('resize', onChangeDebounced);
      onChangeDebounced.flush();
    };
  }, [containerRef, forceUpdate, itemsToRenderRef, updateItemsToRender]);

  const canLoadMore = itemOffsets.size === lengthRef.current;
  useEffect(() => {
    if (!hasMore || !canLoadMore) {
      return;
    }
    const dispose = (() => {
      let prevScrollY = window.scrollY;
      const onScroll = () => {
        const { scrollY, innerHeight } = window;
        const height = document.documentElement.offsetHeight;
        const isDown = scrollY > prevScrollY;
        if (isDown && scrollY + 1000 >= height - innerHeight) {
          console.log('load more');
          onLoadMoreRef.current();
          dispose();
        }
        prevScrollY = scrollY;
      };
      window.addEventListener('scroll', onScroll);

      return () => {
        window.removeEventListener('scroll', onScroll);
      };
    })();
    return dispose;
  }, [hasMore, onLoadMoreRef, canLoadMore]);

  const onItemResize = useCallback(
    (height: number, index: number) => {
      const prevHeight = itemHeights.get(index);
      if (prevHeight === height) {
        return;
      }
      itemHeights.set(index, height);
      updateLayout();
    },
    [itemHeights, updateLayout]
  );

  useEffect(() => {
    updateItemsToRender();
  }, [length, query, updateItemsToRender, rowWidth]);

  useEffect(() => {
    let isFirst = true;
    const el = containerRef.current!;
    let offsetWidth = 0;
    const update = debounce(() => {
      if (offsetWidth !== el.offsetWidth) {
        offsetWidth = el.offsetWidth;
        console.log('update');
        setWidth(el.offsetWidth);
      }
    }, 150);
    const ro = new ResizeObserver(() => {
      if (isFirst) {
        setWidth(el.offsetWidth);
        offsetWidth = el.offsetWidth;
        isFirst = false;
      } else {
        update();
      }
    });
    ro.observe(el);

    return () => {
      update.flush();
      ro.disconnect();
    };
  }, []);

  // useEffect(() => { }, [item]);

  return (
    <>
      <ImageRatiosContext.Provider value={imageRatios}>
        <div
          ref={containerRef}
          style={{
            width: '100%',
            position: 'relative',
            height: containerHeightRef.current,
          }}
        >
          {itemsToRenderRef.current.map((itemIndex) => {
            const offset = itemOffsets.get(itemIndex);
            return (
              <MasonryItemProvider
                key={itemIndex}
                index={itemIndex}
                onItemResize={onItemResize}
                width={rowWidth}
                offsetLeft={offset ? offset.offsetLeft : 0}
                offsetTop={offset ? offset.offsetTop : 0}
                isVisible={!!offset}
              >
                {children(itemIndex)}
              </MasonryItemProvider>
            );
          })}
        </div>
      </ImageRatiosContext.Provider>
      {after(!canLoadMore)}
    </>
  );
};
