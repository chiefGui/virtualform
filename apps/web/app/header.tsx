import { twMerge } from 'tailwind-merge'

import { useSuperState } from '@superstate/react'

import { Playground } from '../lib/playground'

export function Header() {
  useSuperState(Playground.state)

  const isSelected = (percentage: number) => {
    return Playground.state.now().containerPercentage === percentage
  }

  return (
    <div className='bg-gray-600 text-white h-24 px-4 flex items-center justify-between w-full'>
      <section>asdf</section>

      <section className='pr-4'>
        <div className='flex items-center gap-8'>
          {/* <div className='flex items-center gap-2'>
            <span>Placeholder</span>

            <input
              type='checkbox'
              checked={Playground.placeholder}
              onChange={() => {
                Playground.placeholder = !Playground.placeholder
              }}
            />
          </div> */}

          <div className='flex items-center gap-2'>
            <span>Gutter</span>

            <select
              className='bg-gray-500 appearance-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
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
            </select>
          </div>

          <div className='flex items-center gap-2'>
            <span>Gap</span>

            <select
              className='bg-gray-500 appearance-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
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
            </select>
          </div>

          <div className='flex items-center gap-2'>
            <span>Items</span>

            <select
              className='bg-gray-500 appearance-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
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
            </select>
          </div>

          <ul className='flex items-center gap-4'>
            <li
              className={twMerge(
                'w-8 h-8  rounded-full flex items-center justify-center border border-solid border-gray-600 transition-all duration-75',
                isSelected(20) && 'text-black bg-white',
                !isSelected(20) && 'hover:border-white cursor-pointer'
              )}
              onClick={() => (Playground.containerPercentage = 20)}>
              <i className='far fa-mobile' />
            </li>

            <li
              className={twMerge(
                'w-8 h-8  rounded-full flex items-center justify-center border border-solid border-gray-600 transition-all duration-75',
                isSelected(50) && 'text-black bg-white',
                !isSelected(50) && 'hover:border-white cursor-pointer'
              )}
              onClick={() => (Playground.containerPercentage = 50)}>
              <i className='far fa-laptop' />
            </li>

            <li
              className={twMerge(
                'w-8 h-8  rounded-full flex items-center justify-center border border-solid border-gray-600 transition-all duration-75',
                isSelected(100) && 'text-black bg-white',
                !isSelected(100) && 'hover:border-white cursor-pointer'
              )}
              onClick={() => (Playground.containerPercentage = 100)}>
              <i className='far fa-desktop' />
            </li>
          </ul>
        </div>
      </section>
    </div>
  )
}
