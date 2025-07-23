import React, { useState, useEffect } from 'react'

//Import icon
import { PlusCircleIcon } from '@heroicons/react/24/outline'

//Import components
import CurrentValueCalculation from '../Components/SubComponents/CurrentValueCalculation'

//API Finder
import Goal_UltimateFinder from '../Apis/Goal_UltimateFinder'
import Goal_OtherFinder from '../Apis/Goal_OtherFinder'
import NetworthFinder from '@/Apis/NetworthFinder'

import CustomAlert from '../Components/ui/custom-alert'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../Components/ui/alert-dialog"


interface FormData {
  id: number
  name: string
  target_value: number
  current_value: number
  image_source: string
  status: boolean
}

interface NetworthData {
  id: number
  name: string
  value: number
  base_value: number
  goal_ultimate_id: number
  type: string
}

const Goal: React.FC = () => {
  //Temporary data
  const [networthDatas, setNetworthDatas] = useState<NetworthData[]>([])
  const [goalUltimateDatas, setGoalUltimateDatas] = useState<any[]>([])
  const [goalOtherDatas, setGoalOtherDatas] = useState<any[]>([])
  //Tab
  const [activeTab, setActiveTab] = useState<string>('#tab1')
  //Goal Ultimate Modal
  const [isUltiOpen, setIsUltiOpen] = useState(false)
  const [isUltiUpdateOpen, setIsUltiUpdateOpen] = useState(false)
  //Goal Other Modal
  const [isOpen, setIsOpen] = useState(false)
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)

  const [alertMessage, setAlertMessage] = useState<string>('');
  const [showAlert, setShowAlert] = useState<boolean>(false);

  //FormData
  const [goalOther, setGoalOther] = useState('')
  const [formData, setFormData] = useState<FormData>({
    id: 0,
    name: '',
    target_value: 0,
    current_value: 0,
    image_source: '',
    status: false,
  })
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const handleChangeGoalOther = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    // Update the state with the new value entered by the user
    setGoalOther(event.target.value)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }))
  }

  const openUltimateModal = () => {
    setIsUltiOpen(true)
  }

  const closeUltimateModal = () => {
    setFormData({
      ...formData,
      id: 0,
      name: '',
      target_value: 0,
      current_value: 0,
      image_source: '',
      status: false,
    })
    setIsUltiOpen(false)
  }

  const openModal = () => {
    setIsOpen(true)
  }

  const closeOtherModal = () => {
    setGoalOther('')
    setIsOpen(false)
  }

  const openUpdateModal = (
    id: number,
    name: string,
    target_value: number,
    current_value: number,
    image_source: string,
    status: boolean
  ) => {
    setFormData({
      ...formData,
      id: id,
      name: name,
      target_value: target_value,
      current_value: current_value,
      image_source: image_source,
      status: status,
    })
    setIsUpdateOpen(true)
  }

  const closeUpdateModal = () => {
    setFormData({
      ...formData,
      id: 0,
      name: '',
      target_value: 0,
      current_value: 0,
      image_source: '',
      status: false,
    })
    setIsUpdateOpen(false)
  }

  useEffect(() => {
    const tabs = document.querySelectorAll('[data-tab-target]')
    const activeClass = 'bg-indigo-200'

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const tabTarget = tab.getAttribute('data-tab-target')
        if (tabTarget) {
          const targetContent = document.querySelector(tabTarget)
          if (targetContent) {
            document
              .querySelectorAll('.tab-content')
              .forEach((content) => content.classList.add('hidden'))
            targetContent.classList.remove('hidden')

            document
              .querySelectorAll('.bg-indigo-200')
              .forEach((activeTab) => activeTab.classList.remove(activeClass))
            tab.classList.add(activeClass)

            setActiveTab(tabTarget)
          }
        }
      })
    })

    // Select first tab by default
    tabs[0].classList.add(activeClass)
    document.querySelector('#tab1')?.classList.remove('hidden')
  }, []) // Empty dependency array to run once on mount

  const handleUpdate = async (e) => {
    // e.preventDefault()
    // try {
    //   const body = {
    //     id: formData.id,
    //     name: formData.name,
    //     target_value: formData.tavalue,
    //     curent_value: formData.base_value,
    //     investment: formData.investment,
    //   }
    //   const response = await NetworthFinder.put(`/`, body)
    //   setDatas([])
    //   fetchData()
    // } catch (error) {
    //   console.log(error)
    // }
    // setIsUpdateOpen(false)
  }

  const handleSubmitGoalUltimate = async (e) => {
    e.preventDefault()
    if(!formData.name){
      setAlertMessage('Name Cannot Be Empty');
      setShowAlert(true);
      return
    }
    if(formData.target_value<0){
      setAlertMessage('Value Cannot Be Less Than 0');
      setShowAlert(true);
      return
    }
    try {
      const body = {
        name: formData.name,
        target_value: formData.target_value,
        status: false,
      }
      const response = await Goal_UltimateFinder.post(`/`, body)
      fetchData()
    } catch (error) {
      console.log(error)
    }
    closeUltimateModal()
  }

  const handleSubmitGoalOther = async (e) => {
    e.preventDefault()
    if(!formData.name){
      setAlertMessage('Name Cannot Be Empty');
      setShowAlert(true);
      return
    }
    
    try {
      const body = {
        name: goalOther,
        complete_status: false,
      }
      const response = await Goal_OtherFinder.post(`/`, body)
      fetchData()
    } catch (error) {
      console.log(error)
    }
    closeOtherModal()
  }

  const handleDeleteGoalUltimate = async (id: number) => {
    try {
      const response = await Goal_UltimateFinder.delete(`/${id}`)
      setGoalUltimateDatas(
        goalUltimateDatas.filter((data) => {
          return data.id !== id
        })
      )
    } catch (error) {
      console.log(error)
    }
    setDeleteId(null) 
  }

  const handleDeleteGoalOther = async (id: number) => {
    try {
      const response = await Goal_OtherFinder.delete(`/${id}`)
      setGoalOtherDatas(
        goalOtherDatas.filter((data) => {
          return data.id !== id
        })
      )
      // setOpenDelModal(false);
      // setOpenSnackDel(true);
    } catch (err) {
      console.log(err)
    }
    setDeleteId(null) 
  }

  const fetchData = async () => {
    try {
      const response = await NetworthFinder.get('/')
      if (response.data.data.networth.length !== 0) {
        // Update state once with all the data
        setNetworthDatas(response.data.data.networth)
      }
    } catch (error) {
      console.log(error)
    }

    try {
      const response = await Goal_UltimateFinder.get('/')
      console.log(response.data)
      if (response.data.data.goal_ultimate.length !== 0) {
        // Update state once with all the data
        setGoalUltimateDatas(response.data.data.goal_ultimate)
      }
    } catch (error) {
      console.log(error)
    }

    try {
      const response = await Goal_OtherFinder.get('/')
      console.log(response.data)
      if (response.data.data.goal_other.length !== 0) {
        // Update state once with all the data
        setGoalOtherDatas(response.data.data.goal_other)
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
    {showAlert && <CustomAlert message={alertMessage} onClose={() => setShowAlert(false)} />}
      {/* <div className="bg-[url('./src/assets/Cloud.jpeg')] m-auto grid place-items-center"> */}
      {/* <div className="bg-[url('bg.jpg')] m-auto grid place-items-center min-h-screen"> */}
      <div className='tab-section bg-gray-100 p-4 rounded-lg backdrop-filter backdrop-blur-lg bg-opacity-40 min-h-[650px] border-2 border-indigo-200'>
        <div className='flex flex-wrap gap-2 mb-4'>
          <button
            className={`p-4 rounded-lg text-gray-700 font-bold hover:bg-gray-300 hover:bg-opacity-40 flex-grow ${
              activeTab === '#tab1' ? 'bg-indigo-200' : ''
            }`}
            data-tab-target='#tab1'
            onClick={() => setActiveTab('#tab1')}>
            Ultimate
          </button>
          <button
            className={`p-4 rounded-lg text-gray-700 font-bold hover:bg-gray-300 hover:bg-opacity-40 flex-grow ${
              activeTab === '#tab2' ? 'bg-indigo-200' : ''
            }`}
            data-tab-target='#tab2'
            onClick={() => setActiveTab('#tab2')}>
            Other
          </button>
        </div>

        <div className='mt-4'>
          <div
            id='tab1'
            className={`tab-content text-gray-700 ${
              activeTab === '#tab1' ? '' : 'hidden'
            }`}>
            <div className='grid grid-cols-1 xl:grid-cols-2 gap-4 py-4'>
              {goalUltimateDatas &&
                goalUltimateDatas.map((data) => (
                  <div
                    key={data.id}
                    className='w-full bg-gray-300 rounded-xl shadow-md'>
                    <div className='bg-white rounded-lg overflow-hidden shadow-md flex'>
                      {/* Image Section */}
                      <div className='w-1/2 p-2'>
                        <img
                          src={data.image_source || './src/assets/Cloud.jpeg'}
                          alt={data.name}
                          className='object-cover h-full w-full'
                        />
                      </div>

                      {/* Content Section */}
                      <div className='p-4 flex flex-col justify-between w-1/2'>
                        <div>
                          <h2 className='text-2xl font-extrabold mb-2'>
                            {data.name}
                          </h2>
                          <h3 className='text-md font-semibold mb-1'>Target</h3>
                          <p className='text-gray-700 mb-2'>
                            {data.target_value}
                          </p>
                          <h3 className='text-md font-semibold mb-1'>
                            Current
                          </h3>
                          <p className='text-gray-700 mb-2'>
                            <CurrentValueCalculation id={data.id} />
                          </p>
                          {/* <h3 className='text-md font-semibold mb-1'>To Go</h3>
                          <p className='text-gray-700 mb-2'>
                            {data.target_value} -{' '}
                            <CurrentValueCalculation id={data.id} />
                          </p> */}
                        </div>
                        <div className='mt-4 flex justify-between'>
                          <button
                            className='bg-green-500 text-white px-4 py-1 rounded-lg hover:bg-green-600'
                            onClick={() =>
                              openUpdateModal(
                                data.id,
                                data.name,
                                data.target_value,
                                data.current_value,
                                data.image_source,
                                data.status
                              )
                            }>
                            Update
                          </button>
                          <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              className='bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600'
                              onClick={() => setDeleteId(data.id)}
                            >
                              Delete
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure you want to delete?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the item.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setDeleteId(null)}>Cancel</AlertDialogCancel>
                              <AlertDialogAction  onClick={() => handleDeleteGoalUltimate(data.id)}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              <div
                className='w-full h-60 border-4 border-gray-200 rounded-xl flex items-center justify-center cursor-pointer'
                onClick={openUltimateModal}>
                <span className='text-gray-500'>Add New Goal</span>
              </div>
            </div>
          </div>
          <div
            id='tab2'
            className={`tab-content text-gray-700 ${
              activeTab === '#tab2' ? '' : 'hidden'
            }`}>
            <div className='grid grid-cols-1 gap-4 py-3'>
              {goalOtherDatas &&
                goalOtherDatas.map((data) => (
                  <div
                    key={data.id}
                    className='flex items-center justify-between space-x-4 w-full bg-gray-300 rounded-xl p-4'>
                    <span className='text-gray-800'>{data.name}</span>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-6 w-6 text-gray-600 cursor-pointer'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      onClick={() => handleDeleteGoalOther(data.id)}>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M5 13l4 4L19 7'
                      />
                    </svg>
                  </div>
                ))}
              <div className='flex items-center justify-between w-full bg-indigo-100 rounded-xl p-4'>
                <div className='flex-1 text-center'>
                  <h2 className='text-2xl font-extrabold mb-2'>
                    You can do it!
                  </h2>
                </div>
                <button
                  className='flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 focus:outline-none'
                  onClick={openModal}>
                  <PlusCircleIcon className='w-6 h-6' />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for update goal_ultimate*/}
      {isUpdateOpen && (
        <div className='fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center'>
          <div className='bg-white p-6 rounded-lg shadow-xl'>
            {/* Close Button */}
            <button
              // onClick={closeModal}
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

                <form onSubmit={handleUpdate}>
                  <label htmlFor='name'>Name:</label>
                  <input
                    type='text'
                    id='name'
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    className='border border-gray-300 rounded-md p-2 mb-4 w-full'
                  />

                  <label htmlFor='target_value'>Target value:</label>
                  <input
                    type='number'
                    id='target_value'
                    name='target_value'
                    value={formData.target_value}
                    onChange={handleChange}
                    className='border border-gray-300 rounded-md p-2 mb-4 w-full'
                  />

                  <label htmlFor='investment'>Current</label>
                  <select
                    id='investment'
                    name='investment'
                    value={formData.current_value}
                    onChange={handleChange}
                    className='border border-gray-300 rounded-md p-2 mb-4 w-full'>
                    <option value=''>Select Type</option>
                    <option value='true'>Yes</option>
                    <option value='false'>No</option>
                  </select>

                  <div className='flex justify-between'>
                    <button
                      type='submit'
                      className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded'>
                      Submit
                    </button>
                    <button
                      type='button'
                      onClick={closeUpdateModal}
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

      {/* Modal for add goal ultimate*/}
      {isUltiOpen && (
        <div className='fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center'>
          <div className='bg-white p-6 rounded-lg shadow-xl'>
            {/* Close Button */}
            <button
              onClick={closeUltimateModal}
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

                <form onSubmit={handleSubmitGoalUltimate}>
                  <label htmlFor='name'>Goal :</label>
                  <input
                    type='text'
                    id='name'
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    className='border border-gray-300 rounded-md p-2 mb-4 w-full'
                  />

                  <label htmlFor='target_value'>Target :</label>
                  <input
                    type='number'
                    id='target_value'
                    name='target_value'
                    value={formData.target_value}
                    onChange={handleChange}
                    className='border border-gray-300 rounded-md p-2 mb-4 w-full'
                  />

                  <label htmlFor='fund'>Fund :</label>
                  <select
                    id='fund'
                    name='fund'
                    onChange={handleChange}
                    className='border border-gray-300 rounded-md p-2 mb-4 w-full'>
                    <option value=''>Select</option>
                    {networthDatas &&
                      networthDatas.map((data) => (
                        <option key={data.id} value='saving'>
                          {data.name}
                        </option>
                      ))}
                  </select>

                  <div className='flex justify-between'>
                    <button
                      type='submit'
                      className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded'>
                      Submit
                    </button>
                    <button
                      type='button'
                      onClick={closeUltimateModal}
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

      {/* Modal for add goal_other*/}
      {isOpen && (
        <div className='fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center'>
          <div className='bg-white p-6 rounded-lg shadow-xl'>
            {/* Close Button */}
            <button
              onClick={closeOtherModal}
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

                <form onSubmit={handleSubmitGoalOther}>
                  <label htmlFor='name'>Goal :</label>
                  <textarea
                    placeholder='Enter your text here'
                    id='name'
                    name='name'
                    value={goalOther}
                    onChange={handleChangeGoalOther}
                    rows={3}
                    className='border border-gray-300 rounded-md p-2 mb-2 w-full'
                  />
                  <div className='flex justify-between'>
                    <button
                      type='submit'
                      className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded'>
                      Submit
                    </button>
                    <button
                      type='button'
                      onClick={closeOtherModal}
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

export default Goal
