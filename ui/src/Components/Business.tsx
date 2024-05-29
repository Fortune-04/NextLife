import { useState, useEffect, ReactNode } from 'react'

//API finder
import Business_TimeFinder from '../Apis/Business_TimeFinder'
import BusinessFinder from '../Apis/BusinessFinder'

//import subcomponent
import BusinessItem from '../Components/SubComponents/BusinessItem'

//import icon
import { BuildingLibraryIcon } from '@heroicons/react/24/solid'
import { CreditCardIcon } from '@heroicons/react/24/solid'
import { ChevronDoubleUpIcon } from '@heroicons/react/24/solid'
import { ChevronDoubleDownIcon } from '@heroicons/react/24/solid'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/Components/ui/carousel'

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

interface BusinessTimeData {
  id: number
  business_profit: number
  total_revenue: number
  total_capital: number
  date: Date
}

const Business = () => {
  const [datas, setDatas] = useState<any[]>([])
  const [businessTimeDatas, setBusinessTimeDatas] = useState<
    BusinessTimeData[]
  >([])
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [totalCapital, setTotalCapital] = useState(0)
  const [totalProfit, setTotalProfit] = useState(0)
  let value = 0
  let capital = 0
  let business_profit = totalProfit
  let total_revenue = totalRevenue
  let total_capital = totalCapital

  const handleUpdateGraph = async () => {
    try {
      const body = { business_profit, total_revenue, total_capital }
      const response = await Business_TimeFinder.post('/', body)
      fetchData()
    } catch (error) {
      console.log(error)
    }
  }

  const processedData = businessTimeDatas.map((item) => ({
    // Extracting date
    date: new Date(item.date).toLocaleDateString(),
    profit: item.business_profit,
    revenue: item.total_revenue,
    capital: item.total_capital,
  }))

  const page = [
    <div key='1' style={{ width: '100%', height: '550px' }}>
      <ResponsiveContainer width='100%' height='100%'>
        <LineChart
          data={processedData}
          margin={{ top: 35, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='date'>
            <Label
              value='Revenue/Capital vs Time'
              position='insideTop'
              offset={-475}
            />
          </XAxis>
          <YAxis />
          <Tooltip />
          <Line
            type='monotone'
            dataKey='revenue'
            stroke='#8884d8'
            activeDot={{ r: 8 }}
          />
          <Line
            type='monotone'
            dataKey='capital'
            stroke='#82ca9d'
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>,
    <div key='2'>
      <BusinessItem />
    </div>,
  ]

  const calc = () => {
    for (let i = 0; i < datas.length; i++) {
      value = value + datas[i].revenue
      capital = capital + datas[i].capital
    }

    setTotalRevenue(value)
    setTotalCapital(capital)
    setTotalProfit(value - capital)
  }

  const fetchData = async () => {
    try {
      const response = await BusinessFinder.get('/')
      if (response.data.data.business.length !== 0) {
        // Update state once with all the data
        setDatas(response.data.data.business)
      }
    } catch (error) {
      console.log(error)
    }

    try {
      const response = await Business_TimeFinder.get('/')
      console.log(response.data.data.business_time)
      if (response.data.data.business_time.length !== 0) {
        setBusinessTimeDatas(response.data.data.business_time)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    calc()
  }, [datas])

  return (
    <>
      <div className='flex gap-4'>
        <BoxWrapper>
          <button className='rounded-full h-12 w-12 flex items-center justify-center bg-sky-500'>
            <BuildingLibraryIcon
              className='text-2xl text-white'
              onClick={handleUpdateGraph}
            />
          </button>
          <div className='pl-4'>
            <span className='text-sm text-gray-500 font-light'>Revenue</span>
            <div className='flex items-center'>
              <strong className='text-xl text-gray-700 font-semibold'>
                {totalRevenue}
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
                {totalCapital}
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
                {totalProfit}
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
                {((totalProfit / totalCapital) * 100).toFixed(2)}
              </strong>
              <span className='text-sm text-red-500 pl-2'>---</span>
            </div>
          </div>
        </BoxWrapper>
      </div>
      <Carousel className='w-full'>
        <CarouselContent>
          {page.map((content, index) => (
            <CarouselItem key={index}>
              <div className='h-[34rem] mt-3 overflow-auto p-3 rounded-sm border border-gray-200 flex flex-col flex-1'>
                {content}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
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
