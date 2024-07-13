import { useState, useEffect, ReactNode } from 'react'

//Import icon
import { CurrencyDollarIcon } from '@heroicons/react/24/solid'
import { BanknotesIcon } from '@heroicons/react/24/solid'
import { ArrowTrendingUpIcon } from '@heroicons/react/24/solid'
import { ChevronDoubleUpIcon } from '@heroicons/react/24/solid'

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

//API finder
import NetworthFinder from '../Apis/NetworthFinder'
import Networth_TimeFinder from '../Apis/Networth_TimeFinder'
import Trading_TimeFinder from '@/Apis/Trading_TimeFinder'
import Investment_TimeFinder from '@/Apis/Investment_TimeFinder'

//Import subcomponents
import InvestmentProfit from './SubComponents/InvestmentProfit'
import BusinessProfit from './SubComponents/BusinessProfit'
import Business_TimeFinder from '@/Apis/Business_TimeFinder'

interface Data {
  id: number
  total_networth: number
  monthly_income: number
  investment_profit: number
  monthly_profit: number
  date: Date
}

const Dashboard = () => {
  const [total_networth, setTotal] = useState(0)
  const [income, setIncome] = useState()
  const [preNetworth, setPreNetworth] = useState(0)
  const [datas, setDatas] = useState<Data[]>([])
  const [totalTradingProfit, setTotalTradingProfit] = useState(0)
  const [totalTradingProfitIncrement, setTotalTradingProfitIncrement] = useState(0)
  const [totalInvestProfit, setTotalInvestProfit] = useState(0)
  const [totalInvestProfitIncrement, setTotalInvestProfitIncrement] = useState(0)
  const [totalBusinessProfit, setTotalBusinessProfit] = useState(0)
  const [totalBusinessProfitIncrement, setTotalBusinessProfitIncrement] = useState(0)

  const handleUpdate = async () => {
    let monthly_income = total_networth - preNetworth
    try {
      const body = { total_networth, monthly_income }
      console.log(body)
      const response = await Networth_TimeFinder.post('/', body)
      fetchData()
    } catch (error) {
      console.log(error)
    }
  }

  const fetchData = async () => {
    try {
      const response = await NetworthFinder.get('/')
      let totalValue = 0
      if (response.data.data.networth.length !== 0) {
        for (let i = 0; i < response.data.data.networth.length; i++) {
          totalValue = totalValue + response.data.data.networth[i].value
        }
        setTotal(totalValue)
      }
    } catch (error) {
      console.log(error)
    }

    try {
      const response = await Investment_TimeFinder.get('/time')
      if (response.data.data.investment_time.length !== 0) {
        setTotalInvestProfit(response.data.data.investment_time[response.data.data.investment_time.length-1].investment_profit)
        setTotalInvestProfitIncrement((response.data.data.investment_time[response.data.data.investment_time.length-1].investment_profit)-(response.data.data.investment_time[response.data.data.investment_time.length-2].investment_profit))
      }
    } catch (error) {
      console.log(error)
    }

    try {
      const response = await Trading_TimeFinder.get('/time')
      if (response.data.data.trading_time.length !== 0) {
        setTotalTradingProfit(response.data.data.trading_time[response.data.data.trading_time.length-1].total_profit)
        setTotalTradingProfitIncrement((response.data.data.trading_time[response.data.data.trading_time.length-1].total_profit)-(response.data.data.trading_time[response.data.data.trading_time.length-2].total_profit))
      }
    } catch (error) {
      console.log(error)
    }

    try {
      const response = await Business_TimeFinder.get('/')
      if (response.data.data.business_time.length !== 0) {
        setTotalBusinessProfit(response.data.data.business_time[response.data.data.business_time.length-1].business_profit)
        setTotalBusinessProfitIncrement((response.data.data.business_time[response.data.data.business_time.length-1].business_profit)-(response.data.data.business_time[response.data.data.business_time.length-2].business_profit))
      }
    } catch (error) {
      console.log(error)
    }

    try {
      const response = await Networth_TimeFinder.get('/')
      setPreNetworth(
        response.data.data.networth_time[
          response.data.data.networth_time.length - 1
        ].total_networth
      )
      setIncome(
        response.data.data.networth_time[
          response.data.data.networth_time.length - 1
        ].monthly_income
      )
      if (response.data.data.networth_time.length !== 0) {
        setDatas(response.data.data.networth_time)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const processedData = datas.map((item) => ({
    // Extracting date
    date: new Date(item.date).toLocaleDateString(),
    value: item.total_networth,
  }))

  return (
    <>
      <div className='flex gap-4'>
        <BoxWrapper>
          <button className='rounded-full h-12 w-12 flex items-center justify-center bg-sky-500'>
            <CurrencyDollarIcon
              className='text-2xl text-white'
              onClick={handleUpdate}
            />
          </button>
          <div className='pl-4'>
            <span className='text-sm text-gray-500 font-light'>
              Total Networth
            </span>
            <div className='flex items-center'>
              <strong className='text-xl text-gray-700 font-semibold'>
                ${total_networth}
              </strong>
            </div>
          </div>
        </BoxWrapper>
        <BoxWrapper>
          <div className='rounded-full h-12 w-12 flex items-center justify-center bg-orange-600'>
            <BanknotesIcon className='text-2xl text-white' />
          </div>
          <div className='pl-4'>
            <span className='text-sm text-gray-500 font-light'>
              Investment Profit
            </span>
            <div className='flex items-center'>
              <strong className='text-xl text-gray-700 font-semibold'>
                ${totalInvestProfit}
                {/* $<InvestmentProfit type='profit' /> */}
              </strong>
              {totalInvestProfitIncrement > 0 ? <span className='text-sm text-green-500 pl-2'>+{totalInvestProfitIncrement}</span> : <span className='text-sm text-red-500 pl-2'>{totalInvestProfitIncrement}</span>}
            </div>
          </div>
        </BoxWrapper>
        <BoxWrapper>
          <div className='rounded-full h-12 w-12 flex items-center justify-center bg-yellow-400'>
            <ArrowTrendingUpIcon className='text-2xl text-white' />
          </div>
          <div className='pl-4'>
            <span className='text-sm text-gray-500 font-light'>
              Trading Profit
            </span>
            <div className='flex items-center'>
              <strong className='text-xl text-gray-700 font-semibold'>
              ${totalTradingProfit}
              </strong>
              {totalTradingProfitIncrement > 0 ? <span className='text-sm text-green-500 pl-2'>+{totalTradingProfitIncrement}</span> : <span className='text-sm text-red-500 pl-2'>{totalTradingProfitIncrement}</span>}
            </div>
          </div>
        </BoxWrapper>
        <BoxWrapper>
          <div className='rounded-full h-12 w-12 flex items-center justify-center bg-green-600'>
            <ChevronDoubleUpIcon className='text-2xl text-white' />
          </div>
          <div className='pl-4'>
            <span className='text-sm text-gray-500 font-light'>
              Business Profit
            </span>
            <div className='flex items-center'>
              <strong className='text-xl text-gray-700 font-semibold'>
                ${totalBusinessProfit}
                {/* $<BusinessProfit type='profit' /> */}
              </strong>
              {totalBusinessProfitIncrement > 0 ? <span className='text-sm text-green-500 pl-2'>+{totalBusinessProfitIncrement}</span> : <span className='text-sm text-red-500 pl-2'>{totalBusinessProfitIncrement}</span>}
            </div>
          </div>
        </BoxWrapper>
      </div>

      <div className='h-[35rem] mt-3 bg-white p-3 rounded-sm border border-gray-200 flex flex-col flex-1'>
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart
            width={1000}
            height={550}
            data={processedData}
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

export default Dashboard
