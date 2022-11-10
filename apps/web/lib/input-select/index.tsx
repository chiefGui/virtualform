import {
  cloneElement,
  forwardRef,
  ReactElement,
  SelectHTMLAttributes,
} from 'react'

import { twMerge } from 'tailwind-merge'

export const InputSelect = forwardRef<HTMLSelectElement, IProps>(
  function InputSelect({ children, onChange }) {
    return (
      <select
        className={twMerge(
          'bg-transparent outline-none rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-all duration-75',
          'border border-gray-800 hover:border-gray-400',
          'text-gray-50 text-sm'
        )}
        onChange={onChange}>
        {children.map((child) => {
          return cloneElement(child)
        })}
      </select>
    )
  }
)

interface IProps extends SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactElement[]
}
