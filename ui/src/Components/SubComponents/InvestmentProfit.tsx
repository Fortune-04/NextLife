import { useEffect, useState } from 'react'
import NetworthFinder from '../../Apis/NetworthFinder'

interface Data {
  id: number
  names: string
  values: number
  exvalue: number
  invest: boolean
  created_at: Date
  updated_at: Date
}

interface CalculationProps {
  type: string
}

const Calculation: React.FC<CalculationProps> = ({ type }) => {
  const [datas, setDatas] = useState<Data[]>([])
  const [totalProfit, setTotalProfit] = useState(0)
  let value = 0
  let capital = 0

  const calc = () => {
    for (let i = 0; i < datas.length; i++) {
      value = value + datas[i].values
      capital = capital + datas[i].exvalue
    }
    setTotalProfit(value - capital)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await NetworthFinder.get('/')
        if (response.data.length !== 0) {
          // Filter and update datas state with only invest true data
          const filteredData: Data[] = response.data.filter(
            (data: Data) => data.invest
          )
          setDatas(filteredData)
        }
      } catch (error) {
        console.log(error)
      }
    }

    // Call fetchData only once after initial render
    fetchData()
  }, [])

  useEffect(() => {
    calc()
  }, [datas])

  if (datas && type === 'profit') {
    return <>{totalProfit}</>
  }
}

export default Calculation
