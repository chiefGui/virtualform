![Virtualform hero](https://i.imgur.com/d6Obyxk.png)

<div align="center">

### An ultra-fast virtualization engine for React.

[Quick Start](#-quick-start) · [API](#usegrid) · [Demo](https://refocus.vercel.app/grid) · [FAQ](#-faq)

</div>

## ✋ Before you use

**Virtualform** is currently pretty stable as is, but designed to satisfy our needs at [Starchive](https://starchive.io). For example, it still does not virtualize plain, vertical lists or masonry-like grids. Also, it is fully responsive without the option to opt-out.

That said, at the time I'm writing this, I'd only suggest you to use **Virtualform** if you are specifically looking for a way to virtualize symmetrical, responsive grids. Otherwise, I'd suggest you to use [TanStack Virtual](https://tanstack.com/virtual/v3).

## 🏁 Quick Start

As usual, you have to install it first.

```shell
yarn add @virtualform/grid
```

> ⚠️ **NOTE:** Yes, **Virtualform** is currently only meant for grids.

Then, instantiate the hook.

```tsx
import { useGrid } from '@virtualform/grid'

const App = () => {
  const { getParentProps, getWrapperProps, getRows } = useGrid({
    cells: 100,

    rows: {
      height: 100,
    },

    cols: {
      minmax: [100, 100],
    },
  })

  return null
}
```

And display it!

```tsx
import { useGrid } from '@virtualform/grid'

const App = () => {
  const { getParentProps, getWrapperProps, getRows } = useGrid({
    cells: 100,

    rows: {
      height: 100,
    },

    cols: {
      minmax: [100, 100],
    },
  })

  const { style, ...parentProps } = getParentProps()

  return (
    <div style={{ ...style, width: '100vw', height: 600 }} {...parentProps}>
      <div {...getWrapperProps()}>
        {getRows().map((row) => {
          return (
            <div {...row.getProps()}>
              {row.cols().map((col) => {
                return <div {...col.getProps()}>Item {col.index}</div>
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

✨ You now have a virtualized grid! **Please, to understand why the code looks ugly and nothing is making sense, continue reading the docs.**

## `useGrid`

### Inputs

#### `cells`

A **required** property that expects a `number` that represents the total amount of items to be virtualized. Imagine that you want to display a gallery with a user's photos, and your database knows they have `5000` photos stored. If you want a grid that displays all the photos this user has, then you want to pass `5000` to `cells`.

```tsx
useGrid({
  cells: 5000,
})
```

#### `cols.minmax`

A **required** property that expects a tuple of numbers (`[number, number]`) that specifies, respectively, the _minimum_ and _maximum_ width a column can have inside your grid.

```tsx
useGrid({
  cols: { minmax: [100, 100] },
})
```

#### `rows.height`

A **required** property that expects a `number` that represents the `height` of your rows. Each cell (or item, if you prefer) of your grid will have this specified height.

```tsx
useGrid({
  rows: { height: 100 },
})
```

### `gap`

An optional property that expects a `number` that represents the space (in pixels) between each column and each row.

```tsx
useGrid({
  gap: 10,
})
```

> ⚠️ Currently you cannot specify gaps at specific diretions. I.e. gap only at the top, or only at the bottom, etc.

> ⚠️ Gaps won't space the surroundings of your grid. Use [`gutter`](#gutter) for that.

### `gutter`

An optional property that expects a `number` that represents the space (in pixels) around your grid. This is useful when you want better control of where the scrollbar will be displayed at, otherwise, using traditional styling methods, such as `padding` or `margin` at a parent element, will work just fine.

```tsx
useGrid({
  gutter: 50,
})
```

### Outputs

#### `getParentProps`

A function that returns the necessary props a `<div />` must have in order to proper virtualize things. It's nothing scary, really, just some styles and a `ref`.

```tsx
const { ..., getParentProps } = useGrid({
  // ...
})
```

> ⚠️ The parent `<div />` necessarily needs an explicit `height`.

#### `getWrapperProps`

A function that returns the necessary props a `<div />` inside the parent div needs to properly virtualize things. `styles` only, and we recommend that you don't tweak position-related styles too much otherwise your virtualization may break.

```tsx
const { ..., getWrapperProps } = useGrid({
  // ...
})
```

#### `getRows`

A function that returns an array containing your rows. Each `row` is composed by a few properties:

- `isVisible`: a `boolean` that checks whether the row is visible on screen. This is useful for you to control what you want to do to the rows that are not being seen by the user, such as displaying a placeholder (in case they scroll too fast).
- `index`: a `number` that represents the index of each row.
- `getProps()`: a `function` to be spread at the `<div />` of each row. Returns the row's `key` as well as its `style`.

And last but not least, `cols()`. It's a function that returns an array containing the columns of the given row. You have to `.map()` it inside your row so the columns belonging to that row are properly rendered.

Each column returned by the `cols()` array is composed by the following properties:

- `index`: a `number` that represents the index of the column, relative to the row.
- `cellIndex`: a `number` that represents the index of the cell, regardless of the row.
- `getProps()`: a `function` to be spread at the firstmost element inside `cols().map()`. It returns the `key` of the cell, as well as its `style`.

```tsx
const { ..., getRows } = useGrid({
  // ...
})
```

## 🆘 FAQ

### What is virtualization?

Virtualization, or windowing, is the concept of "unloading" content that's not visible to the human's eye, hence making your application more performant.

Imagine Instagram's feed: you can spend a day scrolling down and you don't feel any lags or glitches. That's because anything you don't see, thanks to virtualization, is freed from CPU computation.

There are plenty of nuances here I don't want to dive into, but in a nutshell, that's how virtualization can be understood.

### Is virtualization for me?

It depends. Virtualization is only useful when you are dealing with a great, or an unpredictable, amount of data.

To give you a sense of scale,

- I wouldn't bother if I have to render up to 100-200 pictures. Anything beyond that though, I'd definitely virtualize.
- I wouldn't bother to virtualize data that aren't paginated through infinite loading. I'd display 100 items per page and that's it.

Virtualization comes at a very expensive cost: complexity. It's more difficult to maintain, it's more difficult to digest and if not done properly, it may lock you in a place where you become a hostage, really hard to get out.

### Why Virtualform was created?

At [Starchive](https://starchive.io), we render huge grids of files and the painting, loading and scrolling experience have to be fast and seamless. We already used other virtualization libraries that did a pretty good job, but we always had the feeling that either a feature was missing or proper developer experience was lacking.

**Virtualform** was built from scratch to address the two problems at the same time.

### Why Virtualform has this exquisite API?

I know, right? Well, it's not _that_ exquisite once you start working with it. It gives you some freedom like no other library I used had give me. It was inspired by [Floating UI](https://floating-ui.com/).

### Why do I need to explictly specify the amount of cells to render?

That was a design decision I made because of my needs at [Starchive](https://starchive.io). We paginate our data using infinite loading, thus we need the exact amount of data so **Virtualform** can reserve the necessary space to accomodate all the items coming from our API, to give our customers the best experience as possible.

Also, I can't remember of any other virtualization solution that didn't ask for the amount of items to render. Please, let me know if you know any.

### How stable is Virtualform right now?

As is, it's pretty stable&mdash;we are using it in production.

However, note that its API can change. And I say "can" because there's no plan for it, but if really needed, it'll be changed.

### Where's feature X?

**Virtualform** is an ongoing project that first has to satisfy the needs we have at [Starchive](https://starchive.io). Everything it offers right now is based on our demands at the company. If it lacks a feature you need, feel free to submit a Pull Request or Create an Issue asking for it.

### Will Virtualform support lists/tabular data other than grids?

Yes.

### Will Virtualform support Masonry-like grids?

Very likely.

### Will Virtualform support horizontal scrolling?

Very likely.

---

#### Brought to you by 🇧🇷 [Guilherme "chiefGui" Oderdenge](https://github.com/chiefGui) and [Starchive](https://starchive.io/).

---

The MIT License (MIT)

Copyright (c) 2022 Guilherme Oderdenge

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
