'use client'

import { forwardRef, HTMLAttributes } from 'react'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { twMerge } from 'tailwind-merge'
import { usePathname } from 'next/navigation'

import { useSuperState } from '@superstate/react'

import { Logo } from '../lib'
import { Playground } from '../lib/playground'

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  useSuperState(Playground.state)

  return (
    <aside className='flex flex-col h-screen min-w-[320px] w-[320px] bg-black text-white'>
      <div className='flex-1'>
        <div className='flex items-center p-8 gap-4'>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='flex h-10'>
            <Logo className='w-full h-full text-turquoise-500' />
          </motion.div>

          <nav>
            <ul className='flex items-center gap-2 w-full'>
              <Item src='/grid'>Grid</Item>
            </ul>
          </nav>
        </div>

        {children}
      </div>

      <footer className='p-8'>
        <Link
          href='https://github.com/chiefGui/virtualform'
          target='_blank'
          rel='noopener noreferrer'>
          <i className='fab fa-github text-3xl hover:text-brand transition-all duration-75' />
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
          'text-gray-400 font-bold',
          !highlight && 'hover:border-white hover:text-white cursor-pointer',
          highlight && 'border-turquoise-500 text-turquoise-500',
          disabled && 'opacity-80'
        )}>
        {children}
      </li>
    </Link>
  )
})
