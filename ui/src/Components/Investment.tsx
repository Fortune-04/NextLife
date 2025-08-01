import { useState, useEffect, ReactNode } from 'react'

//API finder
import NetworthFinder from '../Apis/NetworthFinder'
import Investment_TimeFinder from '../Apis/Investment_TimeFinder'

//import icon
import { BuildingLibraryIcon } from '@heroicons/react/24/solid'
import { CreditCardIcon } from '@heroicons/react/24/solid'
import { ChevronDoubleUpIcon } from '@heroicons/react/24/solid'
import { ChevronDoubleDownIcon } from '@heroicons/react/24/solid'

//import shadcn component
import { DataTable } from '@/Components/ui/data-table'
import { columns } from '@/Components/ui/columns'
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

interface InvestData {
  id: number
  name: string
  value: number
  base_value: number
  investment: boolean
  profit_myr: number
  profit_percentage: number
  type: string
  date: Date
}

interface InvestTimeData {
  id: number
  investment_profit: number
  date: Date
}

const Investment = () => {
  const [datas, setDatas] = useState<InvestData[]>([])
  const [investTimeDatas, setInvestTimeDatas] = useState<InvestTimeData[]>([])

  //to insert into database
  const [profit, setProfit] = useState(0)
  const [total, setTotal] = useState(0)
  const [capital, setCapital] = useState(0)
  const [profitPercentage, setProfitPercentage] = useState(0)

  //to display
  const [totalValue, setTotalValue] = useState(0)
  const [totalValueIncrement, setTotalValueIncrement] = useState(0)
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
        investment_profit: profit,
        total: total,
        capital: capital,
        profit_percentage: profitPercentage,
      }
      const response = await Investment_TimeFinder.post('/time', body)
      fetchData()
    } catch (error) {
      console.log(error)
    }
  }

  const processedData = investTimeDatas.map((item) => ({
    // Extracting date
    date: new Date(item.date).toLocaleDateString(),
    value: item.investment_profit,
  }))

  const page = [
    <div key='1' style={{ width: '100%', height: '550px' }}>
      <h2 className='text-lg font-semibold text-gray-700 mb-4 text-center'>
        Profit vs Time
      </h2>
      <ResponsiveContainer width='100%' height='100%'>
        <LineChart
          data={processedData}
          margin={{ top: 20, right: 20, left: 20, bottom: 35 }}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='date' />
          <YAxis />
          <Tooltip />
          <Line type='monotone' dataKey='value' stroke='#8884d8' />
        </LineChart>
      </ResponsiveContainer>
    </div>,
    <div key='2'>
      <DataTable columns={columns} data={datas} />
    </div>,
  ]

  const calc = () => {
    let value = 0
    let capital = 0

    for (let i = 0; i < datas.length; i++) {
      value = value + datas[i].value
      capital = capital + datas[i].base_value
    }

    setTotal(value)
    setCapital(capital)
    setProfit(value - capital)
    setProfitPercentage(((value - capital) / capital) * 100)
  }

  const fetchData = async () => {
    try {
      const response = await NetworthFinder.get('/')
      if (response.data.data.networth.length !== 0) {
        // Filter and update datas state with only invest true data
        const filteredData: InvestData[] = response.data.data.networth.filter(
          (data: InvestData) => data.type === 'invest'
        )
        const updatedData: InvestData[] = filteredData.map(
          (data: InvestData) => ({
            ...data,
            profit_myr: data.value - data.base_value, // Calculate initial profit_myr
            profit_percentage: parseFloat(
              (
                ((data.value - data.base_value) / data.base_value) *
                100
              ).toFixed(2)
            ), // Calculate initial profit_percentage
          })
        )
        setDatas(updatedData)
      }
    } catch (error) {
      console.log(error)
    }

    try {
      const response = await Investment_TimeFinder.get('/time')
      console.log(response.data.data.investment_time)
      if (response.data.data.investment_time.length !== 0) {
        setInvestTimeDatas(response.data.data.investment_time)
        setTotalValue(
          response.data.data.investment_time[
            response.data.data.investment_time.length - 1
          ].total
        )
        setTotalValueIncrement(
          response.data.data.investment_time[
            response.data.data.investment_time.length - 1
          ].total -
            response.data.data.investment_time[
              response.data.data.investment_time.length - 2
            ].total
        )
        setTotalCapital(
          response.data.data.investment_time[
            response.data.data.investment_time.length - 1
          ].capital
        )
        setTotalCapitalIncrement(
          response.data.data.investment_time[
            response.data.data.investment_time.length - 1
          ].capital -
            response.data.data.investment_time[
              response.data.data.investment_time.length - 2
            ].capital
        )
        setTotalProfit(
          response.data.data.investment_time[
            response.data.data.investment_time.length - 1
          ].investment_profit
        )
        setTotalProfitIncrement(
          response.data.data.investment_time[
            response.data.data.investment_time.length - 1
          ].investment_profit -
            response.data.data.investment_time[
              response.data.data.investment_time.length - 2
            ].investment_profit
        )
        setTotalProfitPercentage(
          response.data.data.investment_time[
            response.data.data.investment_time.length - 1
          ].profit_percentage
        )
        setTotalProfitPercentageIncrement(
          response.data.data.investment_time[
            response.data.data.investment_time.length - 1
          ].profit_percentage -
            response.data.data.investment_time[
              response.data.data.investment_time.length - 2
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
            <span className='text-sm text-gray-500 font-light'>Total</span>
            <div className='flex items-center'>
              <strong className='text-xl text-gray-700 font-semibold'>
                ${totalValue}
              </strong>
              {totalValueIncrement > 0 ? (
                <span className='text-sm text-green-500 pl-2'>
                  +{totalValueIncrement}
                </span>
              ) : (
                <span className='text-sm text-red-500 pl-2'>
                  {totalValueIncrement}
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
                ${totalCapital}
              </strong>
              {totalCapitalIncrement > 0 ? (
                <span className='text-sm text-green-500 pl-2'>
                  +{totalCapitalIncrement}
                </span>
              ) : (
                <span className='text-sm text-red-500 pl-2'>
                  {totalCapitalIncrement}
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
                ${totalProfit}
              </strong>
              {totalProfitIncrement > 0 ? (
                <span className='text-sm text-green-500 pl-2'>
                  +{totalProfitIncrement}
                </span>
              ) : (
                <span className='text-sm text-red-500 pl-2'>
                  {totalProfitIncrement}
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
      {/* <div className='h-[35rem] mt-3 overflow-auto p-2 rounded-sm border border-gray-200 flex flex-col flex-1'>
        <Table> */}
      {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
      {/* <TableHeader>
            <TableRow>
              <TableHead className='w-[100px]'>Investment</TableHead>
              <TableHead className='text-right'>Total (MYR)</TableHead>
              <TableHead className='text-right'>Capital (MYR)</TableHead>
              <TableHead className='text-right'>Profit (MYR)</TableHead>
              <TableHead className='text-right'>Profit (%)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {datas &&
              datas.map((data) => (
                <TableRow key={data.id}>
                  <TableCell className='font-medium'>{data.name}</TableCell>
                  <TableCell className='text-right'>{data.value}</TableCell>
                  <TableCell className='text-right'>
                    {data.base_value}
                  </TableCell>
                  <TableCell className='text-right'>
                    {data.value - data.base_value}
                  </TableCell>
                  <TableCell className='text-right'>
                    {(
                      ((data.value - data.base_value) / data.base_value) *
                      100
                    ).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div> */}

      <div className='h-[38rem] mt-3 p-3 rounded-sm border border-gray-200 flex flex-col flex-1'>
        {/* <div className='h-[35rem] mt-3 bg-white p-3 rounded-sm border border-gray-200 flex flex-col flex-1'> */}
        {/* <Carousel className='w-full max-w-xs'> */}
        <Carousel className='w-full'>
          <CarouselContent>
            {page.map((content, index) => (
              <CarouselItem key={index}>
                {/* <div className='h-[34rem] mt-3 overflow-auto p-2 rounded-sm border border-gray-200 flex flex-col flex-1'> */}
                {content}
                {/* </div> */}
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className='carousel-button previous' />
          <CarouselNext className='carousel-button next' />
        </Carousel>
      </div>
      {/* <div className='h-[35rem] mt-3 overflow-auto p-2 rounded-sm border border-gray-200 flex flex-col flex-1'>
        <DataTable columns={columns} data={datas} />
      </div> */}
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

export default Investment
