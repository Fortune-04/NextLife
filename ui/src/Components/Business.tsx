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
import Business_TimeFinder from '../Apis/Business_TimeFinder'
import BusinessFinder from '../Apis/BusinessFinder'

//import subcomponent
import BusinessItem from '../Components/SubComponents/BusinessItem'

//import icon
import { BuildingLibraryIcon } from '@heroicons/react/24/solid'
import { CreditCardIcon } from '@heroicons/react/24/solid'
import { ChevronDoubleUpIcon } from '@heroicons/react/24/solid'
import { ArrowTrendingUpIcon } from '@heroicons/react/24/solid'
import { ChartBarIcon, ViewColumnsIcon } from '@heroicons/react/24/outline'

//Import Chart
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
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
  const [activeTab, setActiveTab] = useState<'chart' | 'businesses'>('chart')

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
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const handleUpdateGraph = async () => {
    try {
      const body = {
        business_profit: profit || 0,
        total_revenue: revenue || 0,
        total_capital: capitals || 0,
        profit_percentage: profitPercentage || 0,
      }
      const response = await Business_TimeFinder.post('/', body)
      fetchData()
    } catch (error) {
      console.log(error)
    }
  }

  const processedData = businessTimeDatas.map((item) => ({
    date: new Date(item.date).toLocaleDateString(),
    profit: item.business_profit,
    revenue: item.total_revenue,
    capital: item.total_capital,
  }))

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
    setProfitPercentage(capital !== 0 ? ((value - capital) / capital) * 100 : 0)
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
      const bizTime = response.data.data.business_time
      setBusinessTimeDatas(bizTime)

      if (bizTime.length > 1) {
        const latest = bizTime[bizTime.length - 1]
        const prev = bizTime[bizTime.length - 2]

        setTotalRevenue(latest.total_revenue || 0)
        setTotalRevenueIncrement((latest.total_revenue || 0) - (prev.total_revenue || 0))
        setTotalCapital(latest.total_capital || 0)
        setTotalCapitalIncrement((latest.total_capital || 0) - (prev.total_capital || 0))
        setTotalProfit(latest.business_profit || 0)
        setTotalProfitIncrement((latest.business_profit || 0) - (prev.business_profit || 0))
        setTotalProfitPercentage(latest.profit_percentage || 0)
        setTotalProfitPercentageIncrement((latest.profit_percentage || 0) - (prev.profit_percentage || 0))
      } else if (bizTime.length === 1) {
        const latest = bizTime[0]

        setTotalRevenue(latest.total_revenue || 0)
        setTotalCapital(latest.total_capital || 0)
        setTotalProfit(latest.business_profit || 0)
        setTotalProfitPercentage(latest.profit_percentage || 0)
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
      label: 'Revenue',
      value: totalRevenue,
      increment: totalRevenueIncrement,
      icon: <BuildingLibraryIcon className='h-5 w-5' />,
      iconBg: 'bg-indigo-100 text-indigo-600',
      onClick: () => setShowConfirmDialog(true),
    },
    {
      label: 'Capital',
      value: totalCapital,
      increment: totalCapitalIncrement,
      icon: <CreditCardIcon className='h-5 w-5' />,
      iconBg: 'bg-violet-100 text-violet-600',
    },
    {
      label: 'Profit (MYR)',
      value: totalProfit,
      increment: totalProfitIncrement,
      icon: <ChevronDoubleUpIcon className='h-5 w-5' />,
      iconBg: 'bg-amber-100 text-amber-600',
    },
    {
      label: 'Profit (%)',
      value: null,
      displayValue: `${totalProfitPercentage.toFixed(2)}%`,
      increment: totalProfitPercentageIncrement,
      incrementDisplay: `${totalProfitPercentageIncrement > 0 ? '+' : ''}${totalProfitPercentageIncrement.toFixed(2)}%`,
      icon: <ArrowTrendingUpIcon className='h-5 w-5' />,
      iconBg: 'bg-emerald-100 text-emerald-600',
    },
  ]

  const tabs = [
    { key: 'chart' as const, label: 'Chart', icon: <ChartBarIcon className='h-4 w-4' /> },
    { key: 'businesses' as const, label: 'Businesses', icon: <ViewColumnsIcon className='h-4 w-4' /> },
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
                Update Business Graph
              </AlertDialogTitle>
              <AlertDialogDescription className='text-sm text-indigo-100 text-center'>
                This will record a new data point on the graph.
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>
          <div className='px-6 py-4'>
            <div className='rounded-xl bg-gray-50 p-3 text-center'>
              <span className='text-xs font-medium text-gray-400 uppercase tracking-wider'>Current Revenue</span>
              <p className='text-xl font-bold text-gray-900 mt-0.5'>{fmtRM(totalRevenue)}</p>
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

      {/* Tab Switcher + Content */}
      <div className='flex-1 min-h-0 mt-4 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col'>
        {/* Tab bar */}
        <div className='flex items-center gap-1 px-5 pt-4 pb-0'>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab.key
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`}>
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className='flex-1 min-h-0 p-5 overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
          {activeTab === 'chart' ? (
            businessTimeDatas.length === 0 ? (
              <div className='flex-1 h-full flex flex-col items-center justify-center'>
                <div className='w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mb-4'>
                  <ArrowTrendingUpIcon className='h-7 w-7 text-gray-300' />
                </div>
                <p className='text-gray-400 text-lg'>Add business to view the graph</p>
              </div>
            ) : (
              <div className='flex flex-col h-full'>
                <div className='text-center mb-4'>
                  <h2 className='text-base font-semibold text-gray-800' style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
                    Revenue & Capital Over Time
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
                        <linearGradient id='gradRevenue' x1='0' y1='0' x2='0' y2='1'>
                          <stop offset='5%' stopColor='#6366f1' stopOpacity={0.15} />
                          <stop offset='95%' stopColor='#6366f1' stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id='gradCapital' x1='0' y1='0' x2='0' y2='1'>
                          <stop offset='5%' stopColor='#8b5cf6' stopOpacity={0.15} />
                          <stop offset='95%' stopColor='#8b5cf6' stopOpacity={0} />
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
                        formatter={(value: number, name: string) => [
                          fmtRM(value),
                          name.charAt(0).toUpperCase() + name.slice(1),
                        ]}
                        labelStyle={{ color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}
                      />
                      <Legend
                        iconType='circle'
                        iconSize={8}
                        wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }}
                      />
                      <Area
                        type='monotone'
                        dataKey='revenue'
                        stroke='#6366f1'
                        strokeWidth={2.5}
                        fill='url(#gradRevenue)'
                        dot={{ r: 4, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
                        activeDot={{ r: 6, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
                      />
                      <Area
                        type='monotone'
                        dataKey='capital'
                        stroke='#8b5cf6'
                        strokeWidth={2.5}
                        fill='url(#gradCapital)'
                        dot={{ r: 4, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2 }}
                        activeDot={{ r: 6, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )
          ) : (
            <BusinessItem onDataChange={fetchData} />
          )}
        </div>
      </div>
    </div>
  )
}

export default Business
