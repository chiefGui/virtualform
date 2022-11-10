'use client'

import { forwardRef, HTMLAttributes } from 'react'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { twMerge } from 'tailwind-merge'
import { usePathname } from 'next/navigation'

import { useSuperState } from '@superstate/react'

import { InputSelect, Logo } from '../lib'
import { Playground } from '../lib/playground'

export function Sidebar() {
  useSuperState(Playground.state)

  return (
    <aside className='flex flex-col h-screen min-w-[320px] w-[320px] bg-black text-white'>
      <div className='flex-1'>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='flex items-center w-full h-24 mt-8'>
          <Logo className='w-full h-full' />
        </motion.div>

        <nav className='p-8'>
          <ul className='flex items-center gap-2 w-full'>
            <Item src='/grid'>Grid</Item>

            <Item src='/list' disabled>
              List
            </Item>

            <Item src='/masonry' disabled>
              Masonry
            </Item>
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

                <option
                  value={10000}
                  selected={Playground.itemsAmount === 10000}>
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
        </div>
      </div>

      <footer className='p-8'>
        <Link
          href='https://github.com/chiefGui/virtualform'
          target='_blank'
          rel='noopener noreferrer'>
          <i className='fab fa-github text-3xl' />
        </Link>
      </footer>
    </aside>
  )
}

const Item = forwardRef<
  HTMLLIElement,
  { src: string; disabled?: boolean } & HTMLAttributes<HTMLLIElement>
>(function Item({ children, src, disabled, ...props }, ref) {
  const pathname = usePathname()

  const highlight = pathname.includes(src)

  return (
    <Link
      href={src}
      className={twMerge(
        (disabled || highlight) && 'pointer-events-none',
        'w-full text-center'
      )}>
      <li
        ref={ref}
        {...props}
        className={twMerge(
          'border border-solid border-gray-800 text-gray-400 h-12 px-4 flex items-center rounded-lg justify-center text-center w-full',
          !highlight && 'hover:border-white hover:text-white',
          highlight && 'bg-white text-black',
          disabled && 'opacity-80'
        )}>
        {children}
      </li>
    </Link>
  )
})
