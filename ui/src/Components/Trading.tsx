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

//API finder
import NetworthFinder from '../Apis/NetworthFinder'
import Trading_TimeFinder from '@/Apis/Trading_TimeFinder'

//import icon
import { BuildingLibraryIcon } from '@heroicons/react/24/solid'
import { CreditCardIcon } from '@heroicons/react/24/solid'
import { ChevronDoubleUpIcon } from '@heroicons/react/24/solid'
import { ArrowTrendingUpIcon } from '@heroicons/react/24/solid'

//Import Chart
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
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
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const handleUpdateGraph = async () => {
    try {
      const body = {
        total: totalValue || 0,
        profit_percentage: profitPercentage || 0,
        total_profit: totalProfit || 0,
        prev_profit: totalPrevProfit || 0,
        avg_profit: totalAvgProfit || 0,
        avg_profit_percent: totalAvgProfitPercentage || 0,
      }
      const response = await Trading_TimeFinder.post('/time', body)
      fetchData()
    } catch (error) {
      console.log(error)
    }
  }

  const processedData = tradingTimeDatas.map((item) => ({
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

    let profPercent = capital !== 0 ? ((value - capital) / capital) * 100 : 0

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
      setProfitPercentage(profPercent || 0)
      setTotalProfit(value - capital)
      setTotalPrevProfit(value - capital)
      setTotalAvgProfit(value - capital)
      setTotalAvgProfitPercentage(profPercent || 0)
    }
  }

  const fetchData = async () => {
    try {
      const response = await NetworthFinder.get('/')
      if (response.data.data.networth.length !== 0) {
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
      const tradingTime = response.data.data.trading_time
      setTradingTimeDatas(tradingTime)

      if (tradingTime.length > 1) {
        const latest = tradingTime[tradingTime.length - 1]
        const prev = tradingTime[tradingTime.length - 2]

        setTotal(latest.total || 0)
        setTotalIncrement((latest.total || 0) - (prev.total || 0))
        setPrevProfit(latest.prev_profit || 0)
        setPrevProfitIncrement((latest.prev_profit || 0) - (prev.prev_profit || 0))
        setAvgProfit(latest.avg_profit || 0)
        setAvgProfitIncrement((latest.avg_profit || 0) - (prev.avg_profit || 0))
        setAvgProfitPercent(latest.avg_profit_percent || 0)
        setAvgProfitPercentIncrement((latest.avg_profit_percent || 0) - (prev.avg_profit_percent || 0))
      } else if (tradingTime.length === 1) {
        const latest = tradingTime[0]

        setTotal(latest.total || 0)
        setPrevProfit(latest.prev_profit || 0)
        setAvgProfit(latest.avg_profit || 0)
        setAvgProfitPercent(latest.avg_profit_percent || 0)
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
      label: 'Total',
      value: total,
      increment: totalIncrement,
      icon: <BuildingLibraryIcon className='h-5 w-5' />,
      iconBg: 'bg-indigo-100 text-indigo-600',
      onClick: () => setShowConfirmDialog(true),
    },
    {
      label: 'Previous Profit',
      value: prevProfit,
      increment: prevProfitIncrement,
      icon: <CreditCardIcon className='h-5 w-5' />,
      iconBg: 'bg-violet-100 text-violet-600',
    },
    {
      label: 'Avg Profit (MYR)',
      value: avgProfit,
      increment: avgProfitIncrement,
      icon: <ChevronDoubleUpIcon className='h-5 w-5' />,
      iconBg: 'bg-amber-100 text-amber-600',
    },
    {
      label: 'Avg Profit (%)',
      value: null,
      displayValue: `${avgProfitPercent.toFixed(2)}%`,
      increment: avgProfitPercentIncrement,
      incrementDisplay: `${avgProfitPercentIncrement > 0 ? '+' : ''}${avgProfitPercentIncrement.toFixed(2)}%`,
      icon: <ArrowTrendingUpIcon className='h-5 w-5' />,
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
                Update Trading Graph
              </AlertDialogTitle>
              <AlertDialogDescription className='text-sm text-indigo-100 text-center'>
                This will record a new data point on the graph.
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>
          <div className='px-6 py-4'>
            <div className='rounded-xl bg-gray-50 p-3 text-center'>
              <span className='text-xs font-medium text-gray-400 uppercase tracking-wider'>Current Total</span>
              <p className='text-xl font-bold text-gray-900 mt-0.5'>{fmtRM(total)}</p>
            </div>
          </div>
          <AlertDialogFooter className='flex-row gap-3 px-6 pb-5 pt-0 sm:space-x-0'>
            <AlertDialogAction
              onClick={handleUpdateGraph}
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
              {card.displayValue ?? fmtRM(card.value ?? 0)}
            </p>
            {card.increment !== null && card.increment !== 0 && (
              card.incrementDisplay ? (
                <span
                  className={`inline-flex items-center gap-0.5 text-xs font-medium px-2 py-0.5 rounded-full ${
                    card.increment > 0
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-red-50 text-red-500'
                  }`}>
                  {card.increment > 0 ? (
                    <svg className='w-3 h-3' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2.5}>
                      <path strokeLinecap='round' strokeLinejoin='round' d='M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25' />
                    </svg>
                  ) : (
                    <svg className='w-3 h-3' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2.5}>
                      <path strokeLinecap='round' strokeLinejoin='round' d='M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25' />
                    </svg>
                  )}
                  {card.incrementDisplay}
                </span>
              ) : (
                <IncrementBadge value={card.increment} />
              )
            )}
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className='flex-1 min-h-0 mt-4 bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col'>
        {tradingTimeDatas.length === 0 ? (
          <div className='flex-1 flex flex-col items-center justify-center'>
            <div className='w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mb-4'>
              <ArrowTrendingUpIcon className='h-7 w-7 text-gray-300' />
            </div>
            <p className='text-gray-400 text-lg'>Add trading to view the graph</p>
          </div>
        ) : (
          <>
            <div className='text-center mb-4'>
              <h2 className='text-base font-semibold text-gray-800' style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
                Trading Profit Over Time
              </h2>
              <span className='text-xs text-gray-400'>
                {processedData.length} data point{processedData.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className='flex-1 min-h-0'>
              <ResponsiveContainer width='100%' height='100%'>
                <AreaChart
                  data={processedData}
                  margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <defs>
                    <linearGradient id='gradTradingProfit' x1='0' y1='0' x2='0' y2='1'>
                      <stop offset='5%' stopColor='#6366f1' stopOpacity={0.15} />
                      <stop offset='95%' stopColor='#6366f1' stopOpacity={0} />
                    </linearGradient>
                  </defs>
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
                    tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      padding: '10px 14px',
                      fontSize: '13px',
                    }}
                    formatter={(value: number) => [fmtRM(value), 'Profit']}
                    labelStyle={{ color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}
                  />
                  <Area
                    type='monotone'
                    dataKey='value'
                    stroke='#6366f1'
                    strokeWidth={2.5}
                    fill='url(#gradTradingProfit)'
                    dot={{ r: 4, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Trading
