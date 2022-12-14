import { forwardRef, HTMLAttributes, useState } from 'react'

import Image from 'next/image'

export const Pic = forwardRef<HTMLDivElement, IProps>(function Pic(
  { src, indicator },
  ref
) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div
      ref={ref}
      className='bg-gray-800 relative w-full h-full group-hover:scale-150 transition-all duration-75'>
      <div className='absolute px-2 h-6 flex items-center justify-center bg-white shadow-xl z-10 top-2 left-2 rounded-full text-xs font-bold bg-opacity-50'>
        {indicator}
      </div>

      <Image
        style={{ objectFit: 'cover' }}
        src={src}
        alt='Placeholder image'
        fill={true}
        onLoadingComplete={() => setIsLoading(false)}
      />
    </div>
  )
})

interface IProps extends HTMLAttributes<HTMLDivElement> {
  src: string
  indicator: number
}
