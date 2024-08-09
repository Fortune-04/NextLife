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
  type: string
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

  //to insert into the database
  const [totalValue, setTotalValue] = useState(0)
  const [profitPercentage, setProfitPercentage] = useState(0)
  const [totalProfit, setTotalProfit] = useState(0)
  const [totalPrevProfit, setTotalPrevProfit] = useState(0)
  const [totalAvgProfit, setTotalAvgProfit] = useState(0)
  const [totalAvgProfitPercentage, setTotalAvgProfitPercentage] = useState(0)

  //to diplay
  const [total, setTotal] = useState(0)
  const [totalIncrement, setTotalIncrement] = useState(0)
  const [prevProfit, setPrevProfit] = useState(0)
  const [prevProfitIncrement, setPrevProfitIncrement] = useState(0)
  const [avgProfit, setAvgProfit] = useState(0)
  const [avgProfitIncrement, setAvgProfitIncrement] = useState(0)
  const [avgProfitPercent, setAvgProfitPercent] = useState(0)
  const [avgProfitPercentIncrement, setAvgProfitPercentIncrement] = useState(0)

  const handleUpdateGraph = async () => {
    try {
      const body = {
        total: totalValue,
        profit_percentage: profitPercentage,
        total_profit: totalProfit,
        prev_profit: totalPrevProfit,
        avg_profit: totalAvgProfit,
        avg_profit_percent: totalAvgProfitPercentage,
      }
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
    let value = 0
    let capital = 0
    let profitPercent = 0

    for (let i = 0; i < datas.length; i++) {
      value = value + datas[i].value
      capital = capital + datas[i].base_value
    }

    for (let i = 0; i < tradingTimeDatas.length; i++) {
      profitPercent = profitPercent + tradingTimeDatas[i].profit_percentage
    }

    let profPercent = ((value - capital) / capital) * 100

    if (tradingTimeDatas.length != 0) {
      setTotalValue(value)
      setProfitPercentage(profPercent)
      setTotalProfit(value - capital)
      setTotalPrevProfit(
        value -
          capital -
          tradingTimeDatas[tradingTimeDatas.length - 1].total_profit
      )
      setTotalAvgProfit((value - capital) / (tradingTimeDatas.length + 1))
      setTotalAvgProfitPercentage(
        (profitPercent + profPercent) / (tradingTimeDatas.length + 1)
      )
    } else {
      setTotalValue(value)
      setProfitPercentage(profPercent)
      setTotalProfit(value - capital)
      setTotalPrevProfit(value - capital)
      setTotalAvgProfit(value - capital)
      setTotalAvgProfitPercentage(profPercent)
    }
  }

  const fetchData = async () => {
    try {
      const response = await NetworthFinder.get('/')
      if (response.data.data.networth.length !== 0) {
        // Filter and update datas state with only invest true data
        const filteredData: InvestData[] = response.data.data.networth.filter(
          (data: InvestData) => data.type === 'trading'
        )
        setDatas(filteredData)
      }
    } catch (error) {
      console.log(error)
    }

    try {
      const response = await Trading_TimeFinder.get('/time')
      if (response.data.data.trading_time.length > 1) {
        setTradingTimeDatas(response.data.data.trading_time)

        setTotal(
          response.data.data.trading_time[
            response.data.data.trading_time.length - 1
          ].total
        )
        setTotalIncrement(
          response.data.data.trading_time[
            response.data.data.trading_time.length - 1
          ].total -
            response.data.data.trading_time[
              response.data.data.trading_time.length - 2
            ].total
        )
        setPrevProfit(
          response.data.data.trading_time[
            response.data.data.trading_time.length - 1
          ].prev_profit
        )
        setPrevProfitIncrement(
          response.data.data.trading_time[
            response.data.data.trading_time.length - 1
          ].prev_profit -
            response.data.data.trading_time[
              response.data.data.trading_time.length - 2
            ].prev_profit
        )
        setAvgProfit(
          response.data.data.trading_time[
            response.data.data.trading_time.length - 1
          ].avg_profit
        )
        setAvgProfitIncrement(
          response.data.data.trading_time[
            response.data.data.trading_time.length - 1
          ].avg_profit -
            response.data.data.trading_time[
              response.data.data.trading_time.length - 2
            ].avg_profit
        )
        setAvgProfitPercent(
          response.data.data.trading_time[
            response.data.data.trading_time.length - 1
          ].avg_profit_percent
        )
        setAvgProfitPercentIncrement(
          response.data.data.trading_time[
            response.data.data.trading_time.length - 1
          ].avg_profit_percent -
            response.data.data.trading_time[
              response.data.data.trading_time.length - 2
            ].avg_profit_percent
        )
      } else {
        setTradingTimeDatas(response.data.data.trading_time)

        setTotal(
          response.data.data.trading_time[
            response.data.data.trading_time.length - 1
          ].total
        )

        setPrevProfit(
          response.data.data.trading_time[
            response.data.data.trading_time.length - 1
          ].prev_profit
        )

        setAvgProfit(
          response.data.data.trading_time[
            response.data.data.trading_time.length - 1
          ].avg_profit
        )

        setAvgProfitPercent(
          response.data.data.trading_time[
            response.data.data.trading_time.length - 1
          ].avg_profit_percent
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
  }, [tradingTimeDatas])

  useEffect(() => {
    if (tradingTimeDatas.length == 0) {
      calc()
    }
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
            <span className='text-sm text-gray-500 font-light'>Total</span>
            <div className='flex items-center'>
              <strong className='text-xl text-gray-700 font-semibold'>
                ${total}
              </strong>
              {totalIncrement > 0 ? (
                <span className='text-sm text-green-500 pl-2'>
                  +{totalIncrement}
                </span>
              ) : (
                <span className='text-sm text-red-500 pl-2'>
                  {totalIncrement}
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
            <span className='text-sm text-gray-500 font-light'>
              Previous Profit
            </span>
            <div className='flex items-center'>
              <strong className='text-xl text-gray-700 font-semibold'>
                ${prevProfit}
              </strong>
              {prevProfitIncrement > 0 ? (
                <span className='text-sm text-green-500 pl-2'>
                  +{prevProfitIncrement}
                </span>
              ) : (
                <span className='text-sm text-red-500 pl-2'>
                  {prevProfitIncrement}
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
              Average Profit (MYR)
            </span>
            <div className='flex items-center'>
              <strong className='text-xl text-gray-700 font-semibold'>
                ${avgProfit.toFixed(2)}
              </strong>
              {avgProfitIncrement > 0 ? (
                <span className='text-sm text-green-500 pl-2'>
                  +{avgProfitIncrement.toFixed(2)}
                </span>
              ) : (
                <span className='text-sm text-red-500 pl-2'>
                  {avgProfitIncrement.toFixed(2)}
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
            <span className='text-sm text-gray-500 font-light'>
              Average Profit (%)
            </span>
            <div className='flex items-center'>
              <strong className='text-xl text-gray-700 font-semibold'>
                {avgProfitPercent.toFixed(2)}
              </strong>
              {avgProfitPercentIncrement > 0 ? (
                <span className='text-sm text-green-500 pl-2'>
                  +{avgProfitPercentIncrement.toFixed(2)}
                </span>
              ) : (
                <span className='text-sm text-red-500 pl-2'>
                  {avgProfitPercentIncrement.toFixed(2)}
                </span>
              )}
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
