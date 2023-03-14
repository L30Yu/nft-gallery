import React, { useEffect, useRef } from 'react';
import {
  InfiniteLoader,
  List,
  WindowScroller,
  AutoSizer,
  IndexRange,
} from 'react-virtualized';

function generateIndexesForRow(
  rowIndex: number,
  rowWidth: number,
  itemWidth: number,
  itemsAmount: number
) {
  const result = [];
  const maxItemsPerRow = getMaxItemsAmountPerRow(rowWidth, itemWidth);
  const startIndex = rowIndex * maxItemsPerRow;

  for (
    let i = startIndex;
    i < Math.min(startIndex + maxItemsPerRow, itemsAmount);
    i++
  ) {
    result.push(i);
  }

  return result;
}

function getMaxItemsAmountPerRow(rowWidth: number, itemWidth: number) {
  return Math.max(Math.floor(rowWidth / itemWidth), 1);
}

function getRowsAmount(
  rowWidth: number,
  itemWidth: number,
  itemsAmount: number,
  hasMore: boolean
) {
  const maxItemsPerRow = getMaxItemsAmountPerRow(rowWidth, itemWidth);

  return Math.ceil(itemsAmount / maxItemsPerRow) + (hasMore ? 1 : 0);
}

type ItemRenderer<ItemType> = (item: ItemType) => React.ReactNode;

interface InfiniteListProps<ItemType> {
  items?: ItemType[];
  fetchItems?: Function;
  hasMore?: boolean;
  isFetching?: boolean;
  reset?: boolean;
  itemWidth?: number;
  itemHeight?: number;
  children: ItemRenderer<ItemType>;
}

function InfiniteList<ItemType>({
  itemWidth = 400,
  itemHeight = 360,
  hasMore = false,
  items = [],
  reset = false,
  isFetching = false,
  fetchItems = () => {},
  children,
}: InfiniteListProps<ItemType>) {
//   const classes = useStyles();
  const infiniteLoaderRef = useRef<InfiniteLoader>(null);

  useEffect(() => {
    if (reset && infiniteLoaderRef.current) {
      infiniteLoaderRef.current.resetLoadMoreRowsCache(true);
    }
  }, [reset, infiniteLoaderRef]);

  const loadMoreRows = async (_: IndexRange) => {
    if (!isFetching) {
      fetchItems();
    }
  };

  const noRowsRenderer = () => (
    <div className="grid p-1">
      No Data
    </div>
  );

  return (
    <section>
      <AutoSizer disableHeight>
        {({ width: rowWidth }) => {
          const rowCount = getRowsAmount(
            rowWidth,
            itemWidth,
            items.length,
            hasMore
          );

          return (
            <InfiniteLoader
              ref={infiniteLoaderRef}
              rowCount={rowCount}
              isRowLoaded={({ index }) => {
                const allItemsLoaded =
                  generateIndexesForRow(
                    index,
                    rowWidth,
                    itemWidth,
                    items.length
                  ).length > 0;

                return !hasMore || allItemsLoaded;
              }}
              loadMoreRows={loadMoreRows}
            >
              {({ onRowsRendered, registerChild }) => (
                <WindowScroller>
                  {({ height, scrollTop }) => (
                    <List
                      className="my-3 justify-center"
                      autoHeight
                      ref={registerChild}
                      height={height}
                      scrollTop={scrollTop}
                      width={rowWidth}
                      rowCount={rowCount}
                      rowHeight={itemHeight}
                      onRowsRendered={onRowsRendered}
                      rowRenderer={({ index, style, key }) => {
                        const itemsForRow = generateIndexesForRow(
                          index,
                          rowWidth,
                          itemWidth,
                          items.length
                        ).map((itemIndex) => items[itemIndex]);

                        return (
                          <div style={style} key={key} className="flex justify-center">
                            {itemsForRow.map((item, itemIndex) => (
                              <div
                                className="flex justify-center p-1"
                                style={{ width: itemWidth }}
                                key={itemIndex}
                              >
                                {children(item)}
                              </div>
                            ))}
                          </div>
                        );
                      }}
                      noRowsRenderer={noRowsRenderer}
                    />
                  )}
                </WindowScroller>
              )}
            </InfiniteLoader>
          );
        }}
      </AutoSizer>
    </section>
  );
}

export default InfiniteList;
