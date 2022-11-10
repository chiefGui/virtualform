'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'

import { useGrid } from '@virtualform/grid'
import { useSuperState } from '@superstate/react'

import { InputSelect } from '../../lib'
import { Pic } from '../pic'
import { Playground } from '../../lib/playground'
import { randomItems } from '../../lib/random-items'
import { SidebarLayout } from '../sidebar-layout'

export default function Page() {
  useSuperState(Playground.state)

  const [items, setItems] = useState(
    randomItems(Playground.state.now().itemsAmount)
  )

  const { getParentProps, getWrapperProps, cells, recompute } = useGrid({
    cells: {
      amount: items.length,
      width: [100, 100],
      height: 100,
    },

    gap: Playground.gap,
    gutter: Playground.gutter,
    overscan: Playground.overscan,
  })

  useEffect(() => {
    const unsub = Playground.state.subscribe(() => {
      setItems(randomItems(Playground.state.now().itemsAmount))
    })

    return () => {
      unsub()
    }
  }, [])

  return (
    <div className='w-full h-full flex'>
      <Sidebar />

      <div className='w-full h-screen' {...getParentProps()}>
        <div {...getWrapperProps()}>
          {cells.map((cell) => {
            return (
              <div {...cell.getProps()} className='group hover:z-50 z-0'>
                <Pic indicator={cell.index + 1} src={items[cell.index]} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const Sidebar = () => {
  return (
    <SidebarLayout>
      <nav className='p-8 pt-0'>
        <ul className='flex items-center gap-4'>
          <li className='bg-white h-8 flex items-center gap-2 text-xs px-4 rounded-lg text-black select-none'>
            Simple
          </li>

          <Link href='/grid/infinite'>
            <li className='border-gray-600 border border-solid text-xs rounded-lg h-8 px-4 flex items-center text-gray-300 cursor-pointer hover:border-white hover:text-white transition-all duration-75'>
              Infinite Loading
            </li>
          </Link>
        </ul>
      </nav>

      <div className='p-8 pt-0 flex flex-col gap-6'>
        <div className='flex gap-2 flex-col'>
          <header className='flex flex-col gap-0.5'>
            <strong>Amount of items</strong>

            <small className='text-gray-400'>
              Adjust the amount of items the grid has to render.
            </small>
          </header>

          <div>
            <InputSelect
              onChange={(e) => {
                Playground.itemsAmount = Number(e.target.value)
              }}>
              <option value={1000} selected={Playground.itemsAmount === 1000}>
                1K
              </option>

              <option value={10000} selected={Playground.itemsAmount === 10000}>
                10K
              </option>

              <option
                value={100000}
                selected={Playground.itemsAmount === 100000}>
                100K
              </option>
            </InputSelect>
          </div>
        </div>

        <div className='flex gap-2 flex-col'>
          <header className='flex flex-col gap-0.5'>
            <strong>Gutter</strong>

            <small className='text-gray-400'>
              Adjust the space around the virtualized grid.
            </small>
          </header>

          <div>
            <InputSelect
              onChange={(e) => {
                Playground.gutter = Number(e.target.value)
              }}>
              <option value={0} selected={Playground.gutter === 0}>
                0
              </option>

              <option value={50} selected={Playground.gutter === 50}>
                50
              </option>

              <option value={100} selected={Playground.gutter === 100}>
                100
              </option>
            </InputSelect>
          </div>
        </div>

        <div className='flex gap-2 flex-col'>
          <header className='flex flex-col gap-0.5'>
            <strong>Gap</strong>

            <small className='text-gray-400'>
              Adjust the space between each cell.
            </small>
          </header>

          <div>
            <InputSelect
              onChange={(e) => {
                Playground.gap = Number(e.target.value)
              }}>
              <option value={0} selected={Playground.gap === 0}>
                0
              </option>

              <option value={10} selected={Playground.gap === 10}>
                10
              </option>

              <option value={50} selected={Playground.gap === 50}>
                50
              </option>
            </InputSelect>
          </div>
        </div>

        <div className='flex gap-2 flex-col'>
          <header className='flex flex-col gap-0.5'>
            <strong>Overscan</strong>

            <small className='text-gray-400'>
              Adjust the amount of rows outside the human eye that will be
              mounted.
            </small>
          </header>

          <div>
            <InputSelect
              onChange={(e) => {
                Playground.overscan = Number(e.target.value)
              }}>
              <option value={0} selected={Playground.overscan === 0}>
                0
              </option>

              <option value={5} selected={Playground.overscan === 5}>
                5
              </option>
            </InputSelect>
          </div>
        </div>
      </div>
    </SidebarLayout>
  )
}
