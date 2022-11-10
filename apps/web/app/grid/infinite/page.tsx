'use client'

import { useEffect, useRef, useState } from 'react'

import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'

import { useGrid } from '@virtualform/grid'
import { useSuperState } from '@superstate/react'

import { InputSelect } from '../../../lib'
import { Pic } from '../../pic'
import { Playground } from '../../../lib/playground'
import { randomItems } from '../../../lib/random-items'
import { SidebarLayout } from '../../sidebar-layout'

const api = randomItems(1000)

const fetch = (page: number) => {
  return new Promise<string[]>((resolve) => {
    setTimeout(() => {
      const result = api.slice(page * 100, (page + 1) * 100)

      resolve(result)
    }, 1000)
  })
}

const useQuery = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<string[]>([])

  const currentPage = useRef(0)
  const hasMoreRef = useRef(true)

  useEffect(() => {
    if (!hasMoreRef.current) return
    ;(async () => {
      await methods.fetchMore()
    })()
  }, [])

  const methods = {
    async fetchMore() {
      if (!hasMoreRef.current) return

      setIsLoading(true)

      if (!hasMoreRef.current) {
        setIsLoading(false)
        return
      }

      const result = await fetch(currentPage.current)

      setIsLoading(false)

      if (result.length === 0) {
        hasMoreRef.current = false
        return
      }

      currentPage.current++

      setData((prev) => [...prev, ...result])
    },
  }

  return {
    isLoading,
    data,
    hasMore: hasMoreRef.current,
    ...methods,
  }
}

export default function Page() {
  useSuperState(Playground.state)

  const { fetchMore, isLoading, data, hasMore } = useQuery()

  const { getParentProps, getWrapperProps, cells, rowsAmount, mountedRows } =
    useGrid({
      cells: {
        amount: data.length,
        width: [100, 100],
        height: 100,
      },

      gap: Playground.gap,
      gutter: Playground.gutter,
      overscan: Playground.overscan,
    })

  useEffect(() => {
    if (mountedRows.includes(rowsAmount - 1) && !isLoading && hasMore) {
      fetchMore()
    }
  }, [mountedRows, rowsAmount, isLoading, hasMore])

  return (
    <div className='w-full h-full flex relative'>
      <Sidebar />

      <div className='w-full h-screen' {...getParentProps()}>
        <AnimatePresence initial={false}>
          {isLoading && (
            <motion.div
              initial={{ y: 0, opacity: 0 }}
              animate={{ y: -20, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              transition={{ delay: 0.2 }}
              className='fixed left-1/2 bottom-0 h-fit text-center p-4 px-8 bg-white text-black z-50 rounded-3xl shadow-xl font-bold'>
              Loading more results...
            </motion.div>
          )}
        </AnimatePresence>

        <div {...getWrapperProps()}>
          {cells.map((cell) => {
            return (
              <div {...cell.getProps()} className='group hover:z-50 z-0'>
                <Pic indicator={cell.index + 1} src={data[cell.index]} />
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
          <Link href='/grid'>
            <li className='border-gray-600 border border-solid text-xs rounded-lg h-8 px-4 flex items-center text-gray-300 cursor-pointer hover:border-white hover:text-white transition-all duration-75'>
              Simple
            </li>
          </Link>

          <li className='bg-white h-8 flex items-center gap-2 text-xs px-4 rounded-lg text-black select-none'>
            Infinite Loading
          </li>
        </ul>
      </nav>

      <div className='p-8 pt-0 flex flex-col gap-6'>
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
      </div>
    </SidebarLayout>
  )
}
