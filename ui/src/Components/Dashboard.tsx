import { useState, useEffect, ReactNode } from 'react'
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

//API Finder
import NetworthFinder from '../Apis/NetworthFinder'
import Networth_TimeFinder from '../Apis/Networth_TimeFinder'

//Import subcomponents
import InvestmentProfit from './SubComponents/InvestmentProfit'

interface Data {
  id: number
  total_networth: number
  monthly_income: number
  created_at: Date
  updated_at: Date
}

const Dashboard = () => {
  const [total_networth, setTotal] = useState(0)
  const [income, setIncome] = useState()
  const [preNetworth, setPreNetworth] = useState(0)
  const [datas, setDatas] = useState<Data[]>([])

  const handleUpdate = async () => {
    let monthly_income = total_networth - preNetworth
    try {
      const body = { total_networth, monthly_income }
      console.log(body)
      const response = await Networth_TimeFinder.post('/create', body)
      fetchData()
    } catch (error) {
      console.log(error)
    }
  }

  const fetchData = async () => {
    try {
      const response = await NetworthFinder.get('/')
      console.log(response.data)
      let totalValue = 0
      if (response.data.length !== 0) {
        for (let i = 0; i < response.data.length; i++) {
          totalValue = totalValue + response.data[i].values
        }
        setTotal(totalValue)
      }
    } catch (error) {
      console.log(error)
    }

    try {
      const response = await Networth_TimeFinder.get('/')
      setPreNetworth(response.data[response.data.length - 1].total_networth)
      setIncome(response.data[response.data.length - 1].monthly_income)
      if (response.data.length !== 0) {
        // for (let i = 0; i < response.data.length; i++) {
        //   // let date = response.data[i].updated_at.split("T").pop();
        //   let date = response.data[i].updated_at.substring(
        //     0,
        //     response.data[i].updated_at.length - 17
        //   )
        //   setXAxis((data) => [...data, date])
        //   setYAxis((data) => [...data, response.data[i].total_networth])
        // }
        setDatas(response.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const processedData = datas.map((item) => ({
    date: new Date(item.created_at).toLocaleDateString(), // Extracting date part
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
              <span className='text-sm text-green-500 pl-2'>---</span>
            </div>
          </div>
        </BoxWrapper>
        <BoxWrapper>
          <div className='rounded-full h-12 w-12 flex items-center justify-center bg-orange-600'>
            <BanknotesIcon className='text-2xl text-white' />
          </div>
          <div className='pl-4'>
            <span className='text-sm text-gray-500 font-light'>
              Monthly Income
            </span>
            <div className='flex items-center'>
              <strong className='text-xl text-gray-700 font-semibold'>
                ${income}
              </strong>
              <span className='text-sm text-green-500 pl-2'>---</span>
            </div>
          </div>
        </BoxWrapper>
        <BoxWrapper>
          <div className='rounded-full h-12 w-12 flex items-center justify-center bg-yellow-400'>
            <ArrowTrendingUpIcon className='text-2xl text-white' />
          </div>
          <div className='pl-4'>
            <span className='text-sm text-gray-500 font-light'>
              Investment Profit
            </span>
            <div className='flex items-center'>
              <strong className='text-xl text-gray-700 font-semibold'>
                $<InvestmentProfit type='profit' />
              </strong>
              <span className='text-sm text-red-500 pl-2'>---</span>
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
                ---
              </strong>
              <span className='text-sm text-red-500 pl-2'>---</span>
            </div>
          </div>
        </BoxWrapper>
      </div>

      <div className='h-[35rem] mt-3 bg-white p-4 rounded-sm border border-gray-200 flex flex-col flex-1'>
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart
            width={1000}
            height={550}
            data={processedData}
            margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray='3 3' />
            {/* <CartesianGrid strokeDasharray='3 3'>
              <Label value='My Chart Title' position='top' />
            </CartesianGrid> */}
            <XAxis dataKey='date' />
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
