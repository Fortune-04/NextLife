import { useState, useEffect } from 'react'

//API Finder
import SkillFinder from '../Apis/SkillFinder'
import Skill_TypeFinder from '../Apis/Skill_TypeFinder'

//Import icon
import { PlusIcon } from '@heroicons/react/24/solid'

//Import component
import SkillList from './SubComponents/SkillList'

interface FormData {
  skill_type_id: number
  name: string
  complete_status: boolean
}

const Skill: React.FC = () => {
  //Temporary Data
  const [skillTypeDatas, setSkillTypeDatas] = useState<any[]>([])
  //Modal
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false)
  //FormData
  const [formData, setFormData] = useState<FormData>({
    skill_type_id: 0,
    name: '',
    complete_status: false,
  })

  const handleChangeSkill = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }))
  }

  const openAddSkillModal = (skill_type_id: number) => {
    setFormData({
      ...formData,
      skill_type_id: skill_type_id,
    })
    setIsAddSkillOpen(true)
  }

  const closeAddSkillModal = () => {
    setIsAddSkillOpen(false)
  }

  const handleSubmitSkill = async (e) => {
    // e.preventDefault()
    try {
      const body = {
        skill_type_id: formData.skill_type_id,
        name: formData.name,
        complete_status: formData.complete_status,
      }
      const response = await SkillFinder.post(`/`, body)
      fetchData()
    } catch (error) {
      console.log(error)
    }
    setIsAddSkillOpen(false)
  }

  const fetchData = async () => {
    try {
      const response = await Skill_TypeFinder.get('/')
      if (response.data.data.skill_type.length !== 0) {
        console.log(response.data)
        // Update state once with all the data
        setSkillTypeDatas(response.data.data.skill_type)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <>
      <div className='flex flex-wrap gap-1'>
        <button className='p-4 rounded-lg text-gray-700 font-bold bg-indigo-200 flex-grow w-80 '>
          Technology
        </button>
        <button className='p-4 rounded-lg text-gray-700 font-bold bg-indigo-200 flex-grow w-80 '>
          Communication
        </button>
        <button className='p-4 rounded-lg text-gray-700 font-bold bg-indigo-200 flex-grow w-80 '>
          Other
        </button>
      </div>

      <div className='flex flex-wrap mt-2 gap-1'>
        <div className='p-2 rounded-lg text-gray-700 font-bold flex-grow w-80 grid grid-cols-1 xl:grid-cols-3 gap-2 px-2 py-2 border border-2'>
          {skillTypeDatas &&
            skillTypeDatas.map((data) => (
              <div
                key={data.id}
                className='grid grid-cols-1 xl:grid-cols-1 gap-2 px-2 py-2'>
                <SkillList id={data.id} />
                <div className='w-full h-24 bg-gray-300 rounded-xl flex items-center justify-center'>
                  <button
                    className='flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 focus:outline-none'
                    onClick={() => openAddSkillModal(data.id)}>
                    <PlusIcon className='w-6 h-6' />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Modal for add skill*/}
      {isAddSkillOpen && (
        <div className='fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center'>
          <div className='bg-white p-6 rounded-lg shadow-xl'>
            {/* Close Button */}
            <button
              onClick={closeAddSkillModal}
              className='absolute top-0 right-0 m-2 text-gray-700 hover:text-gray-900'>
              <svg
                className='h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
            {/* Form Content */}
            <div className='fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center'>
              <div className='bg-white p-6 rounded-lg shadow-xl w-96'>
                <button
                  // onClick={onClose}
                  className='absolute top-0 right-0 m-2 text-gray-700 hover:text-gray-900'>
                  <svg
                    className='h-6 w-6'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M6 18L18 6M6 6l12 12'
                    />
                  </svg>
                </button>

                <form onSubmit={handleSubmitSkill}>
                  <label htmlFor='name'>Skill :</label>
                  <input
                    type='text'
                    id='name'
                    name='name'
                    value={formData.name}
                    onChange={handleChangeSkill}
                    className='border border-gray-300 rounded-md p-2 mb-4 w-full'
                  />
                  <div className='flex justify-between'>
                    <button
                      type='submit'
                      className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded'>
                      Submit
                    </button>
                    <button
                      type='button'
                      onClick={closeAddSkillModal}
                      className='bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded'>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Skill
