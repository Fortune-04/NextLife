import { useState, useEffect, ReactNode } from 'react'

//API finder
import NetworthFinder from '../Apis/NetworthFinder'
import Trading_TimeFinder from '@/Apis/Trading_TimeFinder'

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

interface InvestData {
  id: number
  name: string
  value: number
  base_value: number
  investment: boolean
  profit_myr: number
  profit_percentage: number
  date: Date
}

interface InvestTimeData {
  id: number
  total: number
  profit_percentage: number
  total_profit: number
  date: Date
  prev_profit: number
  avg_profit: number
  avg_profit_percent: number
}

const Trading = () => {
  const [datas, setDatas] = useState<InvestData[]>([])
  const [tradingTimeDatas, setTradingTimeDatas] = useState<InvestTimeData[]>([])
  const [total, setTotal] = useState(0)
  const [totalIncrement, setTotalIncrement] = useState(0)
  const [prevProfit, setPrevProfit] = useState(0)
  const [prevProfitIncrement, setPrevProfitIncrement] = useState(0)
  const [avgProfit, setAvgProfit] = useState(0)
  const [avgProfitIncrement, setAvgProfitIncrement] = useState(0)
  const [avgProfitPercent, setAvgProfitPercent] = useState(0)
  const [avgProfitPercentIncrement, setAvgProfitPercentIncrement] = useState(0)
  let total_profit = 0
  let total_profit_percentage = 0

  const handleUpdateGraph = async () => {
    try {
      const body = { total: total}
      const response = await Trading_TimeFinder.post('/time', body)
      fetchData()
    } catch (error) {
      console.log(error)
    }
  }

  const processedData = tradingTimeDatas.map((item) => ({
    // Extracting date
    date: new Date(item.date).toLocaleDateString(),
    value: item.total_profit,
  }))

  const calc = () => {
    for (let i = 0; i < tradingTimeDatas.length; i++) {
      total_profit = total_profit + tradingTimeDatas[i].total_profit
      total_profit_percentage = total_profit_percentage + tradingTimeDatas[i].profit_percentage
    }

    if(tradingTimeDatas.length>1){
      setTotal(tradingTimeDatas[tradingTimeDatas.length-1].total)
      setTotalIncrement((tradingTimeDatas[tradingTimeDatas.length-1].total)-(tradingTimeDatas[tradingTimeDatas.length-2].total))
      setPrevProfit(tradingTimeDatas[tradingTimeDatas.length-1].prev_profit)
      setPrevProfitIncrement((tradingTimeDatas[tradingTimeDatas.length-1].prev_profit)-(tradingTimeDatas[tradingTimeDatas.length-2].prev_profit))
      setAvgProfit(tradingTimeDatas[tradingTimeDatas.length-1].avg_profit)
      setAvgProfitIncrement((tradingTimeDatas[tradingTimeDatas.length-1].avg_profit)-(tradingTimeDatas[tradingTimeDatas.length-2].avg_profit))
      setAvgProfitPercent(tradingTimeDatas[tradingTimeDatas.length-1].avg_profit_percent) 
      setAvgProfitPercentIncrement((tradingTimeDatas[tradingTimeDatas.length-1].avg_profit_percent)-(tradingTimeDatas[tradingTimeDatas.length-2].avg_profit_percent))  
    }
  }

  const fetchData = async () => {
    // TODO: fetch data from networth based on type
    // try {
    //   const response = await NetworthFinder.get('/')
    //   if (response.data.data.networth.length !== 0) {
    //     // Filter and update datas state with only invest true data
    //     const filteredData: InvestData[] = response.data.data.networth.filter(
    //       (data: InvestData) => data.investment
    //     )
    //     filteredData.map(
    //       (data: InvestData) => ({
    //         ...data,
    //         profit_myr: data.value - data.base_value, // Calculate initial profit_myr
    //         profit_percentage: parseFloat(
    //           (
    //             ((data.value - data.base_value) / data.base_value) *
    //             100
    //           ).toFixed(2)
    //         ), // Calculate initial profit_percentage
    //       })
    //     )
    //     setDatas(updatedData)
    //   }
    // } catch (error) {
    //   console.log(error)
    // }

    try {
      const response = await Trading_TimeFinder.get('/time')
      console.log(response)
      console.log(response.data.data.trading_time)
      if (response.data.data.trading_time.length !== 0) {
        setTradingTimeDatas(response.data.data.trading_time)
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
  }, [tradingTimeDatas])

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
            <span className='text-sm text-gray-500 font-light'>Total</span>
            <div className='flex items-center'>
              <strong className='text-xl text-gray-700 font-semibold'>
                ${total}
              </strong>
              {totalIncrement > 0 ? <span className='text-sm text-green-500 pl-2'>+{totalIncrement}</span> : <span className='text-sm text-red-500 pl-2'>{totalIncrement}</span>}
            </div>
          </div>
        </BoxWrapper>
        <BoxWrapper>
          <div className='rounded-full h-12 w-12 flex items-center justify-center bg-orange-600'>
            <CreditCardIcon className='text-2xl text-white' />
          </div>
          <div className='pl-4'>
            <span className='text-sm text-gray-500 font-light'>Previous Profit</span>
            <div className='flex items-center'>
              <strong className='text-xl text-gray-700 font-semibold'>
                ${prevProfit}
              </strong>
              {prevProfitIncrement > 0 ? <span className='text-sm text-green-500 pl-2'>+{prevProfitIncrement}</span> : <span className='text-sm text-red-500 pl-2'>{prevProfitIncrement}</span>}
            </div>
          </div>
        </BoxWrapper>
        <BoxWrapper>
          <div className='rounded-full h-12 w-12 flex items-center justify-center bg-yellow-400'>
            <ChevronDoubleUpIcon className='text-2xl text-white' />
          </div>
          <div className='pl-4'>
            <span className='text-sm text-gray-500 font-light'>
              Average Profit (MYR)
            </span>
            <div className='flex items-center'>
              <strong className='text-xl text-gray-700 font-semibold'>
                ${avgProfit}
              </strong>
              {avgProfitIncrement > 0 ? <span className='text-sm text-green-500 pl-2'>+{avgProfitIncrement}</span> : <span className='text-sm text-red-500 pl-2'>{avgProfitIncrement}</span>}
            </div>
          </div>
        </BoxWrapper>
        <BoxWrapper>
          <div className='rounded-full h-12 w-12 flex items-center justify-center bg-green-600'>
            <ChevronDoubleDownIcon className='text-2xl text-white' />
          </div>
          <div className='pl-4'>
            <span className='text-sm text-gray-500 font-light'>Average Profit (%)</span>
            <div className='flex items-center'>
              <strong className='text-xl text-gray-700 font-semibold'>
                {(avgProfitPercent).toFixed(2)}
              </strong>
              {avgProfitPercentIncrement > 0 ? <span className='text-sm text-green-500 pl-2'>+{avgProfitPercentIncrement}</span> : <span className='text-sm text-red-500 pl-2'>{avgProfitPercentIncrement}</span>}
            </div>
          </div>
        </BoxWrapper>
      </div>
      
      <div className='h-[35rem] mt-3 overflow-auto p-3 rounded-sm border border-gray-200 flex flex-col flex-1'>
      <ResponsiveContainer width='100%' height='100%'>
        <LineChart
          width={1000}
          height={550}
          data={processedData}
          margin={{ top: 20, right: 5, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='date'>
              <Label
                value='Profit vs Time'
                position='insideTop'
                offset={-497}
              />
            </XAxis>
          <YAxis />
          <Tooltip />
          <Line type='monotone' dataKey='value' stroke='#82ca9d' />
        </LineChart>
      </ResponsiveContainer>
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

export default Trading
