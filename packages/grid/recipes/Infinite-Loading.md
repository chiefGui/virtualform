# Recipe: Infinite Loading

So you are looking for loading data as you scroll, yes? Awesome&mdash;we've got you covered!

### Before you get started

1. Make sure you've read [the documentation](/packages/grid/) for `@virtualform/grid`.
2. This walkthrough won't care about visuals, etc. This is on you.

### Let's start by creating a simple virtualized grid:

```tsx
import { useGrid } from '@virtualform/grid'

const Grid = () => {
  const { getParentProps, getWrapperProps, cells } = useGrid({
    cells: {
      amount: 1000,
      width: [50, 100],
      height: 100,
    },
  })

  const { style, ...parentProps } = getParentProps()

  return (
    <div style={{ ...style, height: '100vh' }} {...parentProps}>
      <div {...getWrapperProps()}>
        {cells.map((cell) => (
          <div {...cell.getProps()}>Item {cell.index}</div>
        ))}
      </div>
    </div>
  )
}
```

### Now, let's fetch our initial data:

```tsx
import { useGrid } from '@virtualform/grid'
import { useQuery } from 'query-lib' // this is fake; use the lib of your choice!

const Grid = () => {
  const { data, isLoading } = useQuery('/api/pictures')

  const { getParentProps, getWrapperProps, cells } = useGrid({
    cells: {
      amount: data?.pictures.length ?? 0,
      width: [50, 100],
      height: 100,
    },
  })

  const { style, ...parentProps } = getParentProps()

  return (
    <div style={{ ...style, height: '100vh' }} {...parentProps}>
      {isLoading && <div>Loading initial data...</div>}

      {!isLoading && (
        <div {...getWrapperProps()}>
          {cells.map((cell) => (
            <div {...cell.getProps()}>
              <img
                style={{ width: '100%', height: '100%' }}
                src={data.pictures[cell.index].url}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

The code above...

1. Through `useQuery` (which can be any fetch function you like), we are fetching data from `/api/pictures`. This hook returns us both `data` and `isLoading`. The latter, in this case, only indicates whether the initial data is loading or not (more on that later).
2. We replaced `cells.amount` from static `1000` to `data?.pictures.length ?? 0`, that tells **Virtualform**, _hey dude, if data is loaded, lets use its length as the amount of cells, otherwise, we have no cells to display_.
3. We separated our markup a little: we now display `Loading initial data...` while data is loading, otherwise we render the grid as expected.

### Time to have fun!

```tsx
import { useGrid } from '@virtualform/grid'
import { useQuery } from 'query-lib'

const Grid = () => {
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useQuery('/api/pictures')

  const { getParentProps, getWrapperProps, cells, mountedRows, rowsAmount } =
    useGrid({
      cells: {
        amount: data?.pictures.length ?? 0,
        width: [50, 100],
        height: 100,
      },
    })

  const { style, ...parentProps } = getParentProps()

  useEffect(() => {
    const isFetchMoreRowMounted = mountedRows.includes(rowsAmount - 2)
    const shouldFetchMore =
      isFetchMoreRowMounted && hasNextPage && !isFetchingNextPage

    if (!shouldFetchMore) {
      return
    }

    fetchNextPage()
  }, [isFetchingNextPage, hasNextPage, mountedRows])

  return (
    <div style={{ ...style, height: '100vh' }} {...parentProps}>
      {isLoading && <div>Loading initial data...</div>}
      {isFetchingNextPage && <div>Loading more results...</div>}

      {!isLoading && (
        <div {...getWrapperProps()}>
          {cells.map((cell) => (
            <div {...cell.getProps()}>
              <img
                style={{ width: '100%', height: '100%' }}
                src={data.pictures[cell.index].url}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

Let's see what happened.

1. We are now getting new variables from our `useQuery`: `isFetchingNextPage`, `hasNextPage`, `fetchNextPage`.
2. We are now getting new variables from our `useGrid`: `rowsAmount`, `mountedRows`.
3. We called a `useEffect` hook with some dependencies: `isFetchingNextPage`, `hasNextPage`, `mounteRows`. Whenever one of these variables change, the function passed to the `useEffect` will be called (pretty ordinary React code).
4. In the function passed to `useEffect`, we declared two variables:
   1. `isFetchMoreRowMounted`: checks if the penultimate row is among the mounted rows by **Virtualform**. This is key for infinite loading&mdash;it's where we specify at which point of the scroll we must request for more data (or fetch the next page).
   2. `shouldFetchMore`: checks if all the conditions are met in order to fetch more data. In our case, the penultimate row has to be mounted, the api cannot be fetching more results already and there should be more data to be fetched.
5. We are now rendering a `Loading more results...` div to indicate more results are being fetched.

### 🚀 You're good to go!

As you could see, **Virtualform** is only responsible for virtualization. It may sound tedious, but this is us helping you by assigning less responsibility to the lib than it should have. This actually benefits you, application developer, and us, library maintainers.

If you think about it, although we don't offer magical functions to automatically infinite load for you, you retain 100% of the power of how things should happen. In the future, your codebase will be thankful.

Anyways... Congratulations, you now have an infinite, virtualized grid!

---

<div align="center">

[Home](/) · [Grid Documentation](/packages/grid) · [Demo](https://virtualform.vercel.app)

</div>
