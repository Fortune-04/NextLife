import { useState, useEffect } from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog'

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
} from 'recharts'

//API finder
import NetworthFinder from '../Apis/NetworthFinder'
import Networth_TimeFinder from '../Apis/Networth_TimeFinder'
import Trading_TimeFinder from '@/Apis/Trading_TimeFinder'
import Investment_TimeFinder from '@/Apis/Investment_TimeFinder'

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
  const [totalTradingProfitIncrement, setTotalTradingProfitIncrement] =
    useState(0)
  const [totalInvestProfit, setTotalInvestProfit] = useState(0)
  const [totalInvestProfitIncrement, setTotalInvestProfitIncrement] =
    useState(0)
  const [totalBusinessProfit, setTotalBusinessProfit] = useState(0)
  const [totalBusinessProfitIncrement, setTotalBusinessProfitIncrement] =
    useState(0)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

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
        setTotalInvestProfit(
          response.data.data.investment_time[
            response.data.data.investment_time.length - 1
          ].investment_profit
        )
        setTotalInvestProfitIncrement(
          response.data.data.investment_time[
            response.data.data.investment_time.length - 1
          ].investment_profit -
            response.data.data.investment_time[
              response.data.data.investment_time.length - 2
            ].investment_profit
        )
      }
    } catch (error) {
      console.log(error)
    }

    try {
      const response = await Trading_TimeFinder.get('/time')
      if (response.data.data.trading_time.length !== 0) {
        setTotalTradingProfit(
          response.data.data.trading_time[
            response.data.data.trading_time.length - 1
          ].total_profit
        )
        setTotalTradingProfitIncrement(
          response.data.data.trading_time[
            response.data.data.trading_time.length - 1
          ].total_profit -
            response.data.data.trading_time[
              response.data.data.trading_time.length - 2
            ].total_profit
        )
      }
    } catch (error) {
      console.log(error)
    }

    try {
      const response = await Business_TimeFinder.get('/')
      if (response.data.data.business_time.length !== 0) {
        setTotalBusinessProfit(
          response.data.data.business_time[
            response.data.data.business_time.length - 1
          ].business_profit
        )
        setTotalBusinessProfitIncrement(
          response.data.data.business_time[
            response.data.data.business_time.length - 1
          ].business_profit -
            response.data.data.business_time[
              response.data.data.business_time.length - 2
            ].business_profit
        )
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

  const processedData = datas.map((item, index) => ({
    // Extracting date
    date: new Date(item.date).toLocaleDateString(),
    value: item.total_networth,
    increment: index > 0 ? item.total_networth - datas[index - 1].total_networth : 0,
  }))

  const fmtRM = (v: number) =>
    `RM ${Number(v).toLocaleString('en-MY', { minimumFractionDigits: 2 })}`

  const IncrementBadge = ({ value }: { value: number }) => {
    if (value === 0) return null
    const isPositive = value > 0
    return (
      <span
        className={`inline-flex items-center gap-0.5 text-xs font-medium px-2 py-0.5 rounded-full ${
          isPositive
            ? 'bg-emerald-50 text-emerald-600'
            : 'bg-red-50 text-red-500'
        }`}>
        {isPositive ? (
          <svg className='w-3 h-3' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2.5}>
            <path strokeLinecap='round' strokeLinejoin='round' d='M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25' />
          </svg>
        ) : (
          <svg className='w-3 h-3' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2.5}>
            <path strokeLinecap='round' strokeLinejoin='round' d='M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25' />
          </svg>
        )}
        {isPositive ? '+' : ''}{fmtRM(value)}
      </span>
    )
  }

  const statCards = [
    {
      label: 'Total Networth',
      value: total_networth,
      increment: null,
      icon: <CurrencyDollarIcon className='h-5 w-5' />,
      iconBg: 'bg-indigo-100 text-indigo-600',
      onClick: () => setShowConfirmDialog(true),
    },
    {
      label: 'Investment Profit',
      value: totalInvestProfit,
      increment: totalInvestProfitIncrement,
      icon: <BanknotesIcon className='h-5 w-5' />,
      iconBg: 'bg-violet-100 text-violet-600',
    },
    {
      label: 'Trading Profit',
      value: totalTradingProfit,
      increment: totalTradingProfitIncrement,
      icon: <ArrowTrendingUpIcon className='h-5 w-5' />,
      iconBg: 'bg-amber-100 text-amber-600',
    },
    {
      label: 'Business Profit',
      value: totalBusinessProfit,
      increment: totalBusinessProfitIncrement,
      icon: <ChevronDoubleUpIcon className='h-5 w-5' />,
      iconBg: 'bg-emerald-100 text-emerald-600',
    },
  ]

  return (
    <div className='flex flex-col h-full'>
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className='max-w-sm rounded-2xl border-0 p-0 overflow-hidden shadow-xl'>
          <div className='bg-gradient-to-br from-indigo-500 to-indigo-600 px-6 pt-6 pb-5 text-center'>
            <div className='mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm'>
              <ArrowTrendingUpIcon className='h-6 w-6 text-white' />
            </div>
            <AlertDialogHeader className='space-y-1'>
              <AlertDialogTitle className='text-lg font-semibold text-white text-center'>
                Update Networth Graph
              </AlertDialogTitle>
              <AlertDialogDescription className='text-sm text-indigo-100 text-center'>
                This will record a new data point on the graph.
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>
          <div className='px-6 py-4'>
            <div className='rounded-xl bg-gray-50 p-3 text-center'>
              <span className='text-xs font-medium text-gray-400 uppercase tracking-wider'>Current Networth</span>
              <p className='text-xl font-bold text-gray-900 mt-0.5'>{fmtRM(total_networth)}</p>
            </div>
          </div>
          <AlertDialogFooter className='flex-row gap-3 px-6 pb-5 pt-0 sm:space-x-0'>
            <AlertDialogAction
              onClick={handleUpdate}
              className='flex-1 m-0 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700'>
              Confirm
            </AlertDialogAction>
            <AlertDialogCancel className='flex-1 m-0 rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900'>
              Cancel
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Stat Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0'>
        {statCards.map((card, i) => (
          <div
            key={i}
            className='bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-default'
            onClick={card.onClick}>
            <div className='flex items-center justify-between mb-3'>
              <span className='text-xs font-medium text-gray-400 uppercase tracking-wider'>
                {card.label}
              </span>
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${card.iconBg}`}>
                {card.icon}
              </div>
            </div>
            <p className='text-2xl font-bold text-gray-900 mb-1'>
              {fmtRM(card.value)}
            </p>
            {card.increment !== null && (
              <IncrementBadge value={card.increment} />
            )}
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className='flex-1 min-h-0 mt-4 bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col'>
        {datas.length === 0 ? (
          <div className='flex-1 flex flex-col items-center justify-center'>
            <div className='w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mb-4'>
              <ArrowTrendingUpIcon className='h-7 w-7 text-gray-300' />
            </div>
            <p className='text-gray-400 text-lg'>Add networth to view the graph</p>
          </div>
        ) : (
          <>
            <div className='text-center mb-4'>
              <h2 className='text-base font-semibold text-gray-800 font-serif'>
                Networth Over Time
              </h2>
              <span className='text-xs text-gray-400'>
                {processedData.length} data point{processedData.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className='flex-1'>
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart
                  data={processedData}
                  margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray='3 3' stroke='#f1f5f9' />
                  <XAxis
                    dataKey='date'
                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload || !payload.length) return null
                      const data = payload[0].payload
                      const inc = data.increment
                      return (
                        <div className='bg-white border border-gray-200 rounded-xl shadow-md px-3.5 py-2.5 text-sm'>
                          <p className='text-gray-400 text-xs mb-1'>{label}</p>
                          <p className='text-gray-900 font-semibold'>{fmtRM(data.value)}</p>
                          {inc !== 0 && (
                            <p className={`text-xs mt-0.5 ${inc > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                              {inc > 0 ? '+' : ''}{fmtRM(inc)}
                            </p>
                          )}
                        </div>
                      )
                    }}
                  />
                  <Line
                    type='monotone'
                    dataKey='value'
                    stroke='#6366f1'
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Dashboard
