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

  const handleDeleteSkill = async (id: number) => {
    try {
      const response = await SkillFinder.delete(`/${id}`)
      setDatas(
        datas.filter((data) => {
          return data.id !== id
        })
      )
      // setOpenDelModal(false);
      // setOpenSnackDel(true);
    } catch (err) {
      console.log(err)
    }
  }

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
            <div
              className='flex items-center justify-between w-70 p-4 bg-gray-300 rounded-xl'
              key={data.id}>
              <p>{data.name}</p>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6 text-gray-600 cursor-pointer'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                onClick={() => handleDeleteSkill(data.id)}>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M5 13l4 4L19 7'
                />
              </svg>
            </div>
          ))}
      </>
    )
  }
}

export default SkillList
