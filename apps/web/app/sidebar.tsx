'use client'

import { forwardRef, HTMLAttributes } from 'react'

import Link from 'next/link'
import { twMerge } from 'tailwind-merge'
import { usePathname } from 'next/navigation'

export function Sidebar() {
  return (
    <aside className='h-screen w-[260px] bg-black text-white'>
      <nav className='p-4'>
        <ul className='flex flex-col gap-2'>
          <Item src='/grid'>Grid</Item>
        </ul>
      </nav>

      <nav className='p-4'>
        <strong>List</strong>

        <p className='text-gray-600'>Coming soon...</p>
      </nav>
    </aside>
  )
}

const Item = forwardRef<
  HTMLLIElement,
  { src: string } & HTMLAttributes<HTMLLIElement>
>(function Item({ children, src, ...props }, ref) {
  const pathname = usePathname()

  const highlight = pathname.includes(src)

  return (
    <Link href={src}>
      <li
        ref={ref}
        {...props}
        className={twMerge(
          'border border-solid border-gray-800 text-gray-400 h-12 px-4 flex items-center rounded-lg',
          !highlight && 'hover:border-white hover:text-white',
          highlight && 'bg-white text-black'
        )}>
        {children}
      </li>
    </Link>
  )
})
