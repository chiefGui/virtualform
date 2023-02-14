'use client'

import Head from 'next/head'

import { useList } from '@virtualform/list'

import { SidebarLayout } from '../sidebar-layout'

export default function Page() {
  const { getRootProps, getWrapperProps, virtualized } = useList({
    gutter: {
      top: 24,
      right: 24,
      bottom: 24,
      left: 24,
    },

    rows: {
      amount: 100,
      height: 40,
    },
  })

  return (
    <div className='flex w-full h-full'>
      <Head>
        <title>Virtualform List</title>
      </Head>

      <Sidebar />

      <div className='flex flex-col w-full h-screen'>
        <div className='flex items-center text-white bg-blue-500'>
          <div className='w-[100px]'>Age</div>
          <div className='w-[100px]'>Name</div>
        </div>

        <div className='flex-1 w-full' {...getRootProps()}>
          <div className='w-full' {...getWrapperProps()}>
            {virtualized.rows.map((r) => {
              const rowColor =
                r.index % 2 === 0 ? 'bg-purple-600' : 'bg-red-600'

              return (
                <div className='w-full text-white' {...r.getProps()}>
                  <div className={'w-full h-full ' + rowColor}>{r.index}</div>
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
