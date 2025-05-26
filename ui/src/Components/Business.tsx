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
  profit_percentage: number
  date: Date
}

const Business = () => {
  const [datas, setDatas] = useState<any[]>([])
  const [businessTimeDatas, setBusinessTimeDatas] = useState<
    BusinessTimeData[]
  >([])

  //to insert into the database
  const [revenue, setRevenue] = useState(0)
  const [capitals, setCapital] = useState(0)
  const [profit, setProfit] = useState(0)
  const [profitPercentage, setProfitPercentage] = useState(0)

  //to display
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [totalRevenueIncrement, setTotalRevenueIncrement] = useState(0)
  const [totalCapital, setTotalCapital] = useState(0)
  const [totalCapitalIncrement, setTotalCapitalIncrement] = useState(0)
  const [totalProfit, setTotalProfit] = useState(0)
  const [totalProfitIncrement, setTotalProfitIncrement] = useState(0)
  const [totalProfitPercentage, setTotalProfitPercentage] = useState(0)
  const [totalProfitPercentageIncrement, setTotalProfitPercentageIncrement] =
    useState(0)

  const handleUpdateGraph = async () => {
    try {
      const body = {
        business_profit: profit,
        total_revenue: revenue,
        total_capital: capitals,
        profit_percentage: profitPercentage,
      }
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
          margin={{ top: 20, right: 15, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='date'>
            <Label
              value='Revenue/Capital vs Time'
              position='insideTop'
              offset={-500}
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
    let value = 0
    let capital = 0

    for (let i = 0; i < datas.length; i++) {
      value = value + datas[i].revenue
      capital = capital + datas[i].capital
    }

    setRevenue(value)
    setCapital(capital)
    setProfit(value - capital)
    setProfitPercentage(((value - capital) / capital) * 100)
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
        setTotalRevenue(
          response.data.data.business_time[
            response.data.data.business_time.length - 1
          ].total_revenue
        )
        setTotalRevenueIncrement(
          response.data.data.business_time[
            response.data.data.business_time.length - 1
          ].total_revenue -
            response.data.data.business_time[
              response.data.data.business_time.length - 2
            ].total_revenue
        )
        setTotalCapital(
          response.data.data.business_time[
            response.data.data.business_time.length - 1
          ].total_capital
        )
        setTotalCapitalIncrement(
          response.data.data.business_time[
            response.data.data.business_time.length - 1
          ].total_capital -
            response.data.data.business_time[
              response.data.data.business_time.length - 2
            ].total_capital
        )
        setTotalProfit(
          response.data.data.business_time[
            response.data.data.business_time.length - 1
          ].business_profit
        )
        setTotalProfitIncrement(
          response.data.data.business_time[
            response.data.data.business_time.length - 1
          ].business_profit -
            response.data.data.business_time[
              response.data.data.business_time.length - 2
            ].business_profit
        )
        setTotalProfitPercentage(
          response.data.data.business_time[
            response.data.data.business_time.length - 1
          ].profit_percentage
        )
        setTotalProfitPercentageIncrement(
          response.data.data.business_time[
            response.data.data.business_time.length - 1
          ].profit_percentage -
            response.data.data.business_time[
              response.data.data.business_time.length - 2
            ].profit_percentage
        )
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
                ${totalRevenue.toFixed(2)}
              </strong>
              {totalRevenueIncrement > 0 ? (
                <span className='text-sm text-green-500 pl-2'>
                  +{totalRevenueIncrement.toFixed(2)}
                </span>
              ) : (
                <span className='text-sm text-red-500 pl-2'>
                  {totalRevenueIncrement.toFixed(2)}
                </span>
              )}
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
                ${totalCapital.toFixed(2)}
              </strong>
              {totalCapitalIncrement > 0 ? (
                <span className='text-sm text-green-500 pl-2'>
                  +{totalCapitalIncrement.toFixed(2)}
                </span>
              ) : (
                <span className='text-sm text-red-500 pl-2'>
                  {totalCapitalIncrement.toFixed(2)}
                </span>
              )}
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
                ${totalProfit.toFixed(2)}
              </strong>
              {totalProfitIncrement > 0 ? (
                <span className='text-sm text-green-500 pl-2'>
                  +{totalProfitIncrement.toFixed(2)}
                </span>
              ) : (
                <span className='text-sm text-red-500 pl-2'>
                  {totalProfitIncrement.toFixed(2)}
                </span>
              )}
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
                {totalProfitPercentage.toFixed(2)}
              </strong>
              {totalProfitPercentageIncrement > 0 ? (
                <span className='text-sm text-green-500 pl-2'>
                  +{totalProfitPercentageIncrement.toFixed(2)}
                </span>
              ) : (
                <span className='text-sm text-red-500 pl-2'>
                  {totalProfitPercentageIncrement.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </BoxWrapper>
      </div>

      <div className='h-[35rem] mt-3 p-3 rounded-sm border border-gray-200 flex flex-col flex-1'>
        <Carousel className='w-full'>
          <CarouselContent>
            {page.map((content, index) => (
              <CarouselItem key={index}>{content}</CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className='carousel-button previous' />
          <CarouselNext className='carousel-button next' />
        </Carousel>
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
