![Virtualform hero](https://i.imgur.com/jcRnTxu.png)

<div align="center">

### An ultra-fast, responsive and headless virtualization engine for React.

[Highlights](#-highlights) · [Before you use](#-before-you-use) · [Grid](/packages/grid) · [Demo](https://virtualform.vercel.app) · [FAQ](#-faq)

</div>

## ✨ Highlights

#### ⚡ Ultra-fast

**Virtualform** was designed from the bottom up to be fast. We chose [O(1)](https://en.wikipedia.org/wiki/Time_complexity) algorithms and good caching management over [Intersection Observers](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) to guarantee lightning fast, consistent performance all around.

#### 📐 Responsiveness for free

Code once, works everywhere. Automatically. Yes, that's right: you don't have to worry about different screen sizes at all.

#### 💅 Bring your own design<sup>TM</sup>

Thanks to its headless nature, **Virtualform** allows you to design your virtualized grid the way you want.

#### 🤓 Friendly, declarative API

Virtualization is not simple. And because of that, we strived for an ergonomic API&mdash;we expect as much as you a smooth developer experience when working with Virtualform.

#### ♾️ Infinite scrolling without abstractions

The way you achieve infinite scrolling with **Virtualform** is up to you. It may sound boring, but in reality, this is us helping you in the long term. **Virtualform** gives you some tools to help you with it, but our intention is not crossing the line in your codebase.

## ✋ Before you use

**Virtualform** is currently pretty stable as is, but designed to satisfy our needs at [Starchive](https://starchive.io). For example, it still does not virtualize plain, vertical lists or masonry-like grids. Also, it is fully responsive without the option to opt-out.

That said, at the time I'm writing this, I'd only suggest you to use **Virtualform** if you are specifically looking for a way to virtualize symmetrical, responsive grids. Otherwise, I'd suggest you to use [react-window](https://github.com/bvaughn/react-window).

## 🆘 FAQ

### What is virtualization?

Virtualization, or windowing, is the concept of "unloading" content that's not visible to the human eye, hence making your application more performant.

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
