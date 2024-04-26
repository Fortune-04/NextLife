import { useEffect, useState } from 'react'
import NetworthFinder from '../../Apis/NetworthFinder'

interface Data {
  goal_ultimate_id: number
  value: number
}

interface CalculationProps {
  id: number
}

const Calculation: React.FC<CalculationProps> = ({ id }) => {
  const [datas, setDatas] = useState<Data[]>([])
  const [totalCurrentValue, setTotalCurrentValue] = useState(0)
  let value = 0

  const calc = () => {
    for (let i = 0; i < datas.length; i++) {
      value = value + datas[i].value
    }
    setTotalCurrentValue(value)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await NetworthFinder.get('/')
        if (response.data.data.networth.length !== 0) {
          // Filter and update datas state with only invest true data
          const filteredData: Data[] = response.data.data.networth.filter(
            (data: Data) => data.goal_ultimate_id === id
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

  if (datas) {
    return <>{totalCurrentValue}</>
  }
}

export default Calculation
