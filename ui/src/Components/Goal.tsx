import React, { useState, useEffect } from 'react'

//Import icon
import { PlusCircleIcon } from '@heroicons/react/24/outline'

//Import components
import CurrentValueCalculation from '../Components/SubComponents/CurrentValueCalculation'
import ImageCropper from '../Components/SubComponents/ImageCropper'

//API Finder
import Goal_UltimateFinder from '../Apis/Goal_UltimateFinder'
import Goal_OtherFinder from '../Apis/Goal_OtherFinder'
import NetworthFinder from '@/Apis/NetworthFinder'

import CloudImage from '../assets/Cloud.jpeg'
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
} from '../Components/ui/alert-dialog'

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

  const [nameError, setNameError] = useState('')

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
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const handleChangeGoalOther = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setNameError('')
    // Update the state with the new value entered by the user
    setGoalOther(event.target.value)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    if (name === 'name') setNameError('')
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }))
  }

  const openUltimateModal = () => {
    setIsUltiOpen(true)
  }

  const closeUltimateModal = () => {
    setNameError('')
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
    setNameError('')
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
    setNameError('')
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
    e.preventDefault()
    if (!formData.name.trim()) {
      setNameError('Goal name is required')
      return
    }
    try {
      const body = {
        id: formData.id,
        name: formData.name,
        target_value: formData.target_value,
        image_source: formData.image_source || null,
        status: false,
      }
      const response = await Goal_UltimateFinder.put(`/target`, body)
      fetchData()
    } catch (error) {
      console.log(error)
    }
    closeUpdateModal()
  }

  const handleSubmitGoalUltimate = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      setNameError('Goal name is required')
      return
    }
    try {
      const body = {
        name: formData.name,
        target_value: formData.target_value,
        image_source: formData.image_source || null,
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
    if (!goalOther.trim()) {
      setNameError('Goal description is required')
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
      <div className='min-h-[650px]'>
        {/* Tabs */}
        <div className='flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit'>
          <button
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === '#tab1'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            data-tab-target='#tab1'
            onClick={() => setActiveTab('#tab1')}>
            Ultimate Goals
          </button>
          <button
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === '#tab2'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            data-tab-target='#tab2'
            onClick={() => setActiveTab('#tab2')}>
            Other Goals
          </button>
        </div>

        {/* Tab 1: Ultimate Goals */}
        <div
          id='tab1'
          className={`tab-content ${activeTab === '#tab1' ? '' : 'hidden'}`}>
          <div className='grid grid-cols-1 xl:grid-cols-2 gap-5'>
            {goalUltimateDatas &&
              goalUltimateDatas.map((data) => {
                const linkedNetworth = networthDatas.filter(
                  (nw) => nw.goal_ultimate_id === data.id
                )
                const currentValue = linkedNetworth.reduce(
                  (sum, nw) => sum + nw.value,
                  0
                )
                const pct =
                  data.target_value > 0
                    ? (currentValue / data.target_value) * 100
                    : 0
                const progressWidth = Math.min(pct, 100)
                const remaining = Math.max(data.target_value - currentValue, 0)

                return (
                  <div
                    key={data.id}
                    className='bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow'>
                    {/* Image Banner */}
                    <div className='relative h-44 overflow-hidden'>
                      <img
                        src={data.image_source || CloudImage}
                        alt={data.name}
                        className='object-cover w-full h-full'
                      />
                      <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent' />
                      <div className='absolute bottom-3 left-4 right-4 flex items-end justify-between'>
                        <h2 className='text-lg font-bold text-white drop-shadow-md'>
                          {data.name}
                        </h2>
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm backdrop-blur-sm ${
                            pct >= 100
                              ? 'bg-emerald-500/90 text-white'
                              : 'bg-black/40 text-white border border-white/20'
                          }`}>
                          {pct >= 100 ? 'Achieved' : `${pct.toFixed(1)}%`}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className='px-5 pt-4 pb-2'>
                      <div className='w-full h-2.5 bg-gray-100 rounded-full overflow-hidden'>
                        <div
                          className={`h-full rounded-full transition-all ${
                            pct >= 100 ? 'bg-emerald-500' : 'bg-indigo-500'
                          }`}
                          style={{ width: `${Math.max(progressWidth, 1.5)}%` }}
                        />
                      </div>
                    </div>

                    {/* Values */}
                    <div className='px-5 pb-3 grid grid-cols-3 gap-3'>
                      <div>
                        <p className='text-[10px] text-gray-500 uppercase tracking-wider font-medium'>Target</p>
                        <p className='text-sm font-bold text-gray-900'>
                          RM {Number(data.target_value).toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div>
                        <p className='text-[10px] text-gray-500 uppercase tracking-wider font-medium'>Current</p>
                        <p className='text-sm font-bold text-indigo-600'>
                          RM {Number(currentValue).toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div>
                        <p className='text-[10px] text-gray-500 uppercase tracking-wider font-medium'>Remaining</p>
                        <p className='text-sm font-bold text-gray-500'>
                          RM {Number(remaining).toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>

                    {/* Linked Assets */}
                    <div className='px-5 pb-3 border-t border-gray-50 pt-2.5'>
                      <p className='text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-1.5'>Linked Assets</p>
                      <div className='flex flex-wrap gap-1.5'>
                        {linkedNetworth.length > 0 ? (
                          linkedNetworth.map((nw) => (
                            <span
                              key={nw.id}
                              className='text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md border border-indigo-100 font-medium'>
                              {nw.name}
                            </span>
                          ))
                        ) : (
                          <span className='text-xs text-gray-300 italic'>No linked assets</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className='border-t border-gray-100 flex'>
                      <button
                        className='flex-1 text-sm font-medium text-indigo-600 hover:bg-indigo-50 py-2.5 transition-colors flex items-center justify-center gap-1.5'
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
                        <svg xmlns='http://www.w3.org/2000/svg' className='h-3.5 w-3.5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                          <path strokeLinecap='round' strokeLinejoin='round' d='m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125' />
                        </svg>
                        Edit
                      </button>
                      <div className='w-px bg-gray-100' />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button
                            className='flex-1 text-sm font-medium text-red-500 hover:bg-red-50 py-2.5 transition-colors'
                            onClick={() => setDeleteId(data.id)}>
                            Delete
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className='sm:rounded-2xl p-0 gap-0 max-w-sm border-0 shadow-2xl'>
                          <div className='flex flex-col items-center text-center px-6 pt-8 pb-4'>
                            <div className='w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-4'>
                              <svg xmlns='http://www.w3.org/2000/svg' className='h-7 w-7 text-red-500' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}>
                                <path strokeLinecap='round' strokeLinejoin='round' d='m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0' />
                              </svg>
                            </div>
                            <AlertDialogHeader className='space-y-1.5'>
                              <AlertDialogTitle className='text-lg font-bold text-gray-900'>
                                Delete "{data.name}"?
                              </AlertDialogTitle>
                              <AlertDialogDescription className='text-sm text-gray-500 leading-relaxed'>
                                This goal and all its linked data will be permanently removed. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                          </div>
                          <div className='border-t border-gray-100 px-6 py-4 flex gap-3'>
                            <AlertDialogAction
                              onClick={() =>
                                handleDeleteGoalUltimate(data.id)
                              }
                              className='flex-1 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium shadow-sm border-0'>
                              Delete
                            </AlertDialogAction>
                            <AlertDialogCancel
                              onClick={() => setDeleteId(null)}
                              className='flex-1 rounded-xl border-gray-200 hover:bg-gray-50 font-medium'>
                              Cancel
                            </AlertDialogCancel>
                          </div>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                )
              })}

            {/* Add Card */}
            <div
              className='bg-white shadow-sm rounded-xl p-6 flex flex-col border border-dashed border-gray-300 items-center justify-center min-h-[12rem] cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-colors'
              onClick={openUltimateModal}>
              <PlusCircleIcon className='h-8 w-8 text-gray-400' />
              <span className='text-sm text-gray-400 mt-2'>Add Ultimate Goal</span>
            </div>
          </div>
        </div>

        {/* Tab 2: Other Goals */}
        <div
          id='tab2'
          className={`tab-content ${activeTab === '#tab2' ? '' : 'hidden'}`}>
          <div className='space-y-2'>
            {goalOtherDatas &&
              goalOtherDatas.map((data, index) => (
                <div
                  key={data.id}
                  className='flex items-center gap-3 bg-white rounded-xl px-4 py-3.5 border border-gray-100 shadow-sm hover:shadow-md transition-all group'>
                  <span className='w-6 h-6 rounded-md bg-indigo-50 text-indigo-500 text-xs font-bold flex items-center justify-center flex-shrink-0'>
                    {index + 1}
                  </span>
                  <span className='flex-1 text-sm font-medium text-gray-800 leading-snug'>
                    {data.name}
                  </span>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        className='w-7 h-7 rounded-full flex items-center justify-center text-emerald-500 hover:bg-emerald-50 transition-colors opacity-0 group-hover:opacity-100'
                        title='Mark as done'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-4.5 w-4.5'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                          strokeWidth={2.5}>
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='M5 13l4 4L19 7'
                          />
                        </svg>
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className='sm:rounded-2xl p-0 gap-0 max-w-sm border-0 shadow-2xl'>
                      <div className='flex flex-col items-center text-center px-6 pt-8 pb-4'>
                        <div className='w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-4'>
                          <svg xmlns='http://www.w3.org/2000/svg' className='h-7 w-7 text-emerald-500' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}>
                            <path strokeLinecap='round' strokeLinejoin='round' d='M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z' />
                          </svg>
                        </div>
                        <AlertDialogHeader className='space-y-1.5'>
                          <AlertDialogTitle className='text-lg font-bold text-gray-900'>
                            Complete this goal?
                          </AlertDialogTitle>
                          <AlertDialogDescription className='text-sm text-gray-500 leading-relaxed'>
                            "{data.name}" will be marked as done and removed from your list.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                      </div>
                      <div className='border-t border-gray-100 px-6 py-4 flex gap-3'>
                        <AlertDialogAction
                          onClick={() => handleDeleteGoalOther(data.id)}
                          className='flex-1 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium shadow-sm border-0'>
                          Yes, complete
                        </AlertDialogAction>
                        <AlertDialogCancel className='flex-1 rounded-xl border-gray-200 hover:bg-gray-50 font-medium'>
                          Cancel
                        </AlertDialogCancel>
                      </div>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}

            {/* Add Other Goal */}
            <button
              className='w-full flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 border-2 border-dashed border-gray-300 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-colors'
              onClick={openModal}>
              <PlusCircleIcon className='h-5 w-5 text-indigo-400' />
              <span className='text-sm font-medium text-indigo-400'>Add a new goal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal for update goal_ultimate*/}
      {isUpdateOpen && (
        <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4'>
          <div className='bg-white rounded-2xl shadow-2xl w-full max-w-md'>
            <div className='flex items-center justify-between px-6 pt-6 pb-2'>
              <h2 className='text-lg font-bold text-gray-900'>Update Goal</h2>
              <button
                onClick={closeUpdateModal}
                className='w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors'>
                <svg className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>

            <form onSubmit={handleUpdate} className='px-6 pb-6'>
              <div className='space-y-4 mb-6'>
                <div>
                  <label htmlFor='name' className='block text-sm font-medium text-gray-600 mb-1.5'>Goal Name</label>
                  <input
                    type='text'
                    id='name'
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 bg-gray-50 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                      nameError ? 'border-red-400 focus:ring-red-500/20 focus:border-red-400' : 'border-gray-200 focus:ring-indigo-500/20 focus:border-indigo-400'
                    }`}
                    placeholder='e.g. House, Car'
                  />
                  {nameError && (
                    <p className='text-xs text-red-500 mt-1'>{nameError}</p>
                  )}
                </div>
                <div>
                  <label htmlFor='target_value' className='block text-sm font-medium text-gray-600 mb-1.5'>Target Value (RM)</label>
                  <input
                    type='number'
                    id='target_value'
                    name='target_value'
                    value={formData.target_value}
                    onChange={handleChange}
                    className='w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-colors'
                    placeholder='0.00'
                  />
                </div>
                <ImageCropper
                  currentImage={formData.image_source}
                  onImageCropped={(base64) =>
                    setFormData((prev) => ({ ...prev, image_source: base64 }))
                  }
                  onImageRemoved={() =>
                    setFormData((prev) => ({ ...prev, image_source: '' }))
                  }
                />
              </div>

              <div className='flex gap-3'>
                <button
                  type='submit'
                  className='flex-1 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm'>
                  Save
                </button>
                <button
                  type='button'
                  onClick={closeUpdateModal}
                  className='flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors'>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for add goal ultimate*/}
      {isUltiOpen && (
        <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4'>
          <div className='bg-white rounded-2xl shadow-2xl w-full max-w-md'>
            <div className='flex items-center justify-between px-6 pt-6 pb-2'>
              <h2 className='text-lg font-bold text-gray-900'>Add Ultimate Goal</h2>
              <button
                onClick={closeUltimateModal}
                className='w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors'>
                <svg className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmitGoalUltimate} className='px-6 pb-6'>
              <div className='space-y-4 mb-6'>
                <div>
                  <label htmlFor='name' className='block text-sm font-medium text-gray-600 mb-1.5'>Goal Name</label>
                  <input
                    type='text'
                    id='name'
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 bg-gray-50 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                      nameError ? 'border-red-400 focus:ring-red-500/20 focus:border-red-400' : 'border-gray-200 focus:ring-indigo-500/20 focus:border-indigo-400'
                    }`}
                    placeholder='e.g. House, Car'
                  />
                  {nameError && (
                    <p className='text-xs text-red-500 mt-1'>{nameError}</p>
                  )}
                </div>
                <div>
                  <label htmlFor='target_value' className='block text-sm font-medium text-gray-600 mb-1.5'>Target Value (RM)</label>
                  <input
                    type='number'
                    id='target_value'
                    name='target_value'
                    value={formData.target_value}
                    onChange={handleChange}
                    className='w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-colors'
                    placeholder='0.00'
                  />
                </div>
                <ImageCropper
                  currentImage={formData.image_source}
                  onImageCropped={(base64) =>
                    setFormData((prev) => ({ ...prev, image_source: base64 }))
                  }
                  onImageRemoved={() =>
                    setFormData((prev) => ({ ...prev, image_source: '' }))
                  }
                />
              </div>

              <div className='flex gap-3'>
                <button
                  type='submit'
                  className='flex-1 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm'>
                  Save
                </button>
                <button
                  type='button'
                  onClick={closeUltimateModal}
                  className='flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors'>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for add goal_other*/}
      {isOpen && (
        <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4'>
          <div className='bg-white rounded-2xl shadow-2xl w-full max-w-md'>
            <div className='flex items-center justify-between px-6 pt-6 pb-2'>
              <h2 className='text-lg font-bold text-gray-900'>Add Goal</h2>
              <button
                onClick={closeOtherModal}
                className='w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors'>
                <svg className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmitGoalOther} className='px-6 pb-6'>
              <div className='space-y-4 mb-6'>
                <div>
                  <label htmlFor='name' className='block text-sm font-medium text-gray-600 mb-1.5'>What do you want to achieve?</label>
                  <textarea
                    placeholder='Describe your goal...'
                    id='name'
                    name='name'
                    value={goalOther}
                    onChange={handleChangeGoalOther}
                    rows={3}
                    className={`w-full px-3.5 py-2.5 bg-gray-50 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors resize-none ${
                      nameError ? 'border-red-400 focus:ring-red-500/20 focus:border-red-400' : 'border-gray-200 focus:ring-indigo-500/20 focus:border-indigo-400'
                    }`}
                  />
                  {nameError && (
                    <p className='text-xs text-red-500 mt-1'>{nameError}</p>
                  )}
                </div>
              </div>

              <div className='flex gap-3'>
                <button
                  type='submit'
                  className='flex-1 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm'>
                  Save
                </button>
                <button
                  type='button'
                  onClick={closeOtherModal}
                  className='flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors'>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default Goal
