import { useEffect, useState } from 'react'
import BusinessFinder from '../../Apis/BusinessFinder'

interface Data {
  id: number
  name: string
  revenue: number
  capital: number
  status: boolean
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
      value = value + datas[i].revenue
      capital = capital + datas[i].capital
    }
    setTotalProfit(value - capital)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await BusinessFinder.get('/')
        if (response.data.data.business.length !== 0) {
          setDatas(response.data.data.business)
        }
      } catch (error) {
        console.log(error)
      }
    }

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
