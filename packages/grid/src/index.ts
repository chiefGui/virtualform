import { useCallback, useEffect, useRef, useState } from 'react'

import { useEventListener } from './use-event-listener'

export function useGrid(input: IInput) {
  const { cols, rows, gap = 0, cells = 0, gutter = 0 } = input

  const parentRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const rowsAmount = useRef(0)
  const colsPerRow = useRef(0)
  const colWidthRef = useRef(0)

  const [rowsVisibility, setRowsVisibility] = useState<{
    [key: number]: [number, boolean]
  }>({})

  const computeRowsVisibility = useCallback(() => {
    if (
      rowsAmount.current === Infinity ||
      rowsAmount.current === 0 ||
      !parentRef.current
    ) {
      return
    }

    const rowsVisibility: { [key: number]: [number, boolean] } = {}

    for (let i = 0; i < rowsAmount.current; i++) {
      const rowTop = calcRowTop(i, rows.height, gap, gutter)

      rowsVisibility[i] = [
        rowTop,
        isRowVisible(rowTop, rows.height, parentRef.current),
      ]
    }

    setRowsVisibility((prev) => ({ ...prev, ...rowsVisibility }))
  }, [gap, gutter, rows.height])

  /**
   * An expensive task that recomputes all the maths.
   */
  const recompute = useCallback(() => {
    // if (!parentRef.current) {
    //   throw new Error(`Tried to recompute grid but parentRef is null.`)
    // }

    console.log(parentRef.current)

    // Recalculate the available width.
    const nextAvailableWidth = calcAvailableWidth(parentRef, gutter)

    const [_colsPerRow, colWidth] = calcColsPerRow(
      nextAvailableWidth,
      cols.minmax,
      gap
    )

    // Recompute the width of a single row.
    colWidthRef.current = colWidth

    // Recompute the number of columns that can fit in a single row of the grid.
    colsPerRow.current = _colsPerRow

    // Recompute the number of rows that can fit in the grid.
    rowsAmount.current = calcRowsAmount(colsPerRow.current, cells)

    computeRowsVisibility()
  }, [gap, gutter, cols.minmax, cells, computeRowsVisibility])

  const getParentProps = useCallback(() => {
    return {
      ref: parentRef,

      style: {
        position: 'relative',
        overflowY: 'auto',
      } as React.CSSProperties,
    }
  }, [])

  const getWrapperProps = useCallback(() => {
    const height = calcGridHeight(rowsAmount.current, rows.height, gap, gutter)

    if (isNaN(height) || !isFinite(height) || height < 0) {
      return
    }

    return {
      ref: wrapperRef,

      style: {
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        height,
      } as React.CSSProperties,
    }
  }, [gap, gutter, rows.height])

  /**
   * Returns an array of rows.
   */
  const getRows = useCallback(() => {
    if (!isFinite(rowsAmount.current) || rowsAmount.current === 0) {
      return []
    }

    return Array.from({ length: rowsAmount.current }, (_, rowIndex) => {
      const rowTop = calcRowTop(rowIndex, rows.height, gap, gutter)

      return {
        key: rowIndex,

        isVisible: rowsVisibility[rowIndex]?.[1] ?? false,

        getProps() {
          return {
            style: {
              height: rows.height,
              width: '100%',
              position: 'absolute',
              transform: `translateY(${rowTop}px)`,
            } as React.CSSProperties,
          }
        },

        cols() {
          const colsAtRowAmount = Math.min(
            colsPerRow.current,
            cells - rowIndex * colsPerRow.current
          )

          return Array.from({ length: colsAtRowAmount }, (_, colIndex) => {
            const colLeft = calcColLeft(
              colIndex,
              colWidthRef.current,
              gap,
              gutter
            )

            return {
              key: `${rowIndex}-${colIndex}`,

              index: rowIndex * colsPerRow.current + colIndex,

              getProps() {
                return {
                  style: {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: colWidthRef.current,
                    height: '100%',
                    transform: `translateX(${colLeft}px)`,
                  } as React.CSSProperties,
                }
              },
            }
          })
        },
      }
    })
  }, [cells, gap, gutter, rows.height, rowsVisibility])

  /**
   * Recompute on mount
   */
  useEffect(() => {
    let isAvailable = false

    while (!isAvailable) {
      if (parentRef.current) {
        isAvailable = true

        break
      }
    }

    if (isAvailable) {
      recompute()
    }
  }, [])

  useEffect(recompute, [cells, gap, gutter])

  /**
   * Calc visible rows.
   */
  useEventListener('scroll', computeRowsVisibility, parentRef)

  useEventListener('resize', recompute)

  useEffect(computeRowsVisibility, [
    gap,
    gutter,
    rows.height,
    computeRowsVisibility,
  ])

  return { getParentProps, getWrapperProps, getRows, recompute }
}

function calcAvailableWidth(
  parentRef: React.RefObject<HTMLDivElement>,
  gutter = 0
) {
  if (!parentRef.current) {
    return 0
  }

  const { width } = parentRef.current.getBoundingClientRect()

  return width - gutter
}

/**
 * Returns the number of columns that can fit in the grid.
 *
 * @param availableWidth The available width of the grid.
 * @param minMax The minimum and maximum width of each column.
 * @param gap The gap between each column.
 *
 * @returns A tuple of the number of columns that can fit in the grid and the width of each column.
 */
function calcColsPerRow(
  availableWidth: number,
  minmax: [number, number],
  gap = 0
) {
  const [min, max] = minmax

  const colsPerRow = Math.floor(availableWidth / (max + gap))

  const colWidth = (availableWidth - gap * (colsPerRow - 1)) / colsPerRow

  return [colsPerRow, colWidth]
}

/**
 * Returns the number of rows that can fit in the grid.
 *
 * @param colsPerRow The number of columns that can fit in the grid.
 * @param totalCells The total number of cells.
 *
 * @returns
 */
function calcRowsAmount(colsPerRow: number, totalCells: number) {
  return Math.ceil(totalCells / colsPerRow)
}

function calcRowTop(rowIndex: number, rowHeight: number, gap = 0, gutter = 0) {
  return rowIndex * (rowHeight + gap) + gutter / 2
}

/**
 * Returns the left position of a column in the grid.
 *
 * @param colIndex
 * @param colWidth
 * @param gap
 * @returns
 */
function calcColLeft(colIndex: number, colWidth: number, gap = 0, gutter = 0) {
  return colIndex * (colWidth + gap) + gutter / 2
}

/**
 * Returns the height (in pixels) of the grid.
 *
 * @param rowsAmount The total number of rows.
 * @param gap The gap between each row.
 * @returns
 */
function calcGridHeight(
  rowsAmount: number,
  rowsHeight: number,
  gap = 0,
  gutter = 0
) {
  return rowsAmount * (rowsHeight + gap) - gap + gutter
}

/**
 * Returns a filtered array of rows that are visible in the grid.
 */
function isRowVisible(
  rowTop: number,
  rowsHeight: number,
  parentElement: Element
) {
  const top = rowTop
  const bottom = top + rowsHeight

  const parentTop = parentElement.scrollTop
  const parentBottom = parentTop + parentElement.clientHeight

  return bottom > parentTop && top < parentBottom
}

type IInput = {
  cells: number
  cols: { minmax: [number, number] }
  rows: { height: number }

  /**
   * The amount of space between each column and row.
   */
  gap?: number

  /**
   * The amount of whitespace around the grid.
   */
  gutter?: number
}
