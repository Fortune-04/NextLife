import { useEffect, useState } from 'react'
import SkillFinder from '../../Apis/SkillFinder'

interface Data {
  id: number
  skill_type_id: number
  name: string
}

interface CalculationProps {
  id: number
}

const SkillList: React.FC<CalculationProps> = ({ id }) => {
  const [datas, setDatas] = useState<Data[]>([])

  const fetchData = async () => {
    try {
      const response = await SkillFinder.get('/')
      if (response.data.data.skill.length !== 0) {
        // Filter and update datas state with only invest true data
        const filteredData: Data[] = response.data.data.skill.filter(
          (data: Data) => data.skill_type_id === id
        )
        setDatas(filteredData)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (datas) {
    return (
      <>
        {datas &&
          datas.map((data) => (
            <div className='w-70 p-2 bg-gray-300 rounded-xl' key={data.id}>
              <p>{data.name}</p>
            </div>
          ))}
      </>
    )
  }
}

export default SkillList
