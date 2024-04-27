import { useState, useEffect, ReactNode } from 'react'

import BusinessItem from '../Components/SubComponents/BusinessItem'

//import icon
import { BuildingLibraryIcon } from '@heroicons/react/24/solid'
import { CreditCardIcon } from '@heroicons/react/24/solid'
import { ChevronDoubleUpIcon } from '@heroicons/react/24/solid'
import { ChevronDoubleDownIcon } from '@heroicons/react/24/solid'

//Import Chart
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from 'recharts'

const Business = () => {
  return (
    <>
      <div className='flex gap-4'>
        <BoxWrapper>
          <div className='rounded-full h-12 w-12 flex items-center justify-center bg-sky-500'>
            <BuildingLibraryIcon className='text-2xl text-white' />
          </div>
          <div className='pl-4'>
            <span className='text-sm text-gray-500 font-light'>Revenue</span>
            <div className='flex items-center'>
              <strong className='text-xl text-gray-700 font-semibold'>
                {/* {totalValue} */}
              </strong>
              <span className='text-sm text-green-500 pl-2'>---</span>
            </div>
          </div>
        </BoxWrapper>
        <BoxWrapper>
          <div className='rounded-full h-12 w-12 flex items-center justify-center bg-orange-600'>
            <CreditCardIcon className='text-2xl text-white' />
          </div>
          <div className='pl-4'>
            <span className='text-sm text-gray-500 font-light'>Capital</span>
            <div className='flex items-center'>
              <strong className='text-xl text-gray-700 font-semibold'>
                {/* {totalCapital} */}
              </strong>
              <span className='text-sm text-green-500 pl-2'>---</span>
            </div>
          </div>
        </BoxWrapper>
        <BoxWrapper>
          <div className='rounded-full h-12 w-12 flex items-center justify-center bg-yellow-400'>
            <ChevronDoubleUpIcon className='text-2xl text-white' />
          </div>
          <div className='pl-4'>
            <span className='text-sm text-gray-500 font-light'>
              Profit (MYR)
            </span>
            <div className='flex items-center'>
              <strong className='text-xl text-gray-700 font-semibold'>
                {/* {totalProfit} */}
              </strong>
              <span className='text-sm text-red-500 pl-2'>---</span>
            </div>
          </div>
        </BoxWrapper>
        <BoxWrapper>
          <div className='rounded-full h-12 w-12 flex items-center justify-center bg-green-600'>
            <ChevronDoubleDownIcon className='text-2xl text-white' />
          </div>
          <div className='pl-4'>
            <span className='text-sm text-gray-500 font-light'>Profit (%)</span>
            <div className='flex items-center'>
              <strong className='text-xl text-gray-700 font-semibold'>
                {/* {((totalProfit / totalCapital) * 100).toFixed(2)} */}
              </strong>
              <span className='text-sm text-red-500 pl-2'>---</span>
            </div>
          </div>
        </BoxWrapper>
      </div>
      <div className='h-[35rem] mt-3 bg-white p-3 rounded-sm border border-gray-400 flex flex-col flex-1'>
        {/* <ResponsiveContainer width='100%' height='100%'>
          <LineChart
            width={1000}
            height={550}
            // data={processedData}
            margin={{ top: 20, right: 5, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='date'>
              <Label
                value='Networth vs Time'
                position='insideTop'
                offset={-497}
              />
            </XAxis>
            <YAxis />
            <Tooltip />
            <Line type='monotone' dataKey='value' stroke='#8884d8' />
          </LineChart>
        </ResponsiveContainer> */}
        <BusinessItem />
      </div>
    </>
  )
}

interface BoxWrapperProps {
  children: ReactNode
}

const BoxWrapper: React.FC<BoxWrapperProps> = ({ children }) => {
  return (
    <div className='bg-white rounded-sm p-4 flex-1 border border-gray-200 flex items-center'>
      {children}
    </div>
  )
}

export default Business
