import { forwardRef, ImgHTMLAttributes, useState } from 'react'

import Image from 'next/image'

export const BlurImage = forwardRef<
  HTMLImageElement,
  Omit<ImgHTMLAttributes<HTMLImageElement>, 'alt' | 'src'> & {
    alt: string
    src: string
    fill?: boolean
    placeholder?: 'blur' | 'empty'
  }
>(function BlurImage(props) {
  const [isLoading, setLoading] = useState(true)

  return (
    <div>
      {isLoading && (
        <svg className='animate-spin h-5 w-5' viewBox='0 0 24 24' />
      )}

      <Image
        style={{ objectFit: 'cover' }}
        src={props.src}
        alt={props.alt}
        fill={props.fill}
        placeholder={props.placeholder}
        onLoadingComplete={() => setLoading(false)}
      />
    </div>
  )
})
