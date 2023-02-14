'use client'

import { useTable } from '@virtualform/table'

import { SidebarLayout } from '../sidebar-layout'

export default function Page() {
  const { getRootProps, getWrapperProps, virtualized } = useTable({
    gutter: {
      top: 24,
      right: 24,
      bottom: 24,
      left: 24,
    },

    cols: {
      amount: 1,
      width: 100,
    },

    rows: {
      amount: 25,
      height: 40,
    },
  })

  return (
    <div className='flex w-full h-full'>
      <Sidebar />

      <div className='flex flex-col w-full h-screen'>
        <div className='flex items-center text-white bg-blue-500'>
          <div className='w-[100px]'>Age</div>
          <div className='w-[100px]'>Name</div>
        </div>

        <div className='h-[400px] w-full' {...getRootProps()}>
          <div {...getWrapperProps()}>
            {virtualized.cells.map((c) => {
              // get a color for the cell based like a chess board, considering the rowIndex and colIndex
              const rowColor =
                c.rowIndex % 2 === c.colIndex % 2
                  ? 'bg-purple-600'
                  : 'bg-red-600'

              return (
                <div className='text-white' {...c.getProps()}>
                  <div className={'w-full h-full ' + rowColor}>
                    {c.index} ({c.colIndex}x{c.rowIndex})
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

const Sidebar = () => {
  return <SidebarLayout>Hello</SidebarLayout>
}
