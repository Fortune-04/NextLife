import { useState, useEffect } from 'react'
import BusinessFinder from '../../Apis/BusinessFinder'
import { PlusIcon } from '@heroicons/react/24/solid'
import ModalPortal from './ModalPortal'

interface FormData {
  id: number
  name: string
  revenue: number
  capital: number
  status: boolean
}

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
  formData: FormData
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  title: string
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onChange,
  title,
}) => {
  if (!isOpen) return null

  return (
    <ModalPortal>
      <div className='fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center z-[9999]'>
        <div className='bg-white p-6 rounded-lg shadow-xl w-96 relative'>
          {/* Close Button */}
          <button
            onClick={onClose}
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

          <h2 className='text-lg font-bold mb-4'>{title}</h2>

          <form onSubmit={onSubmit}>
            <label htmlFor='name'>Name:</label>
            <input
              type='text'
              id='name'
              name='name'
              value={formData.name}
              onChange={onChange}
              className='border border-gray-300 rounded-md p-2 mb-4 w-full'
            />

            <label htmlFor='revenue'>Revenue:</label>
            <input
              type='number'
              id='revenue'
              name='revenue'
              value={formData.revenue}
              onChange={onChange}
              className='border border-gray-300 rounded-md p-2 mb-4 w-full'
            />

            <label htmlFor='capital'>Capital:</label>
            <input
              type='number'
              id='capital'
              name='capital'
              value={formData.capital}
              onChange={onChange}
              className='border border-gray-300 rounded-md p-2 mb-4 w-full'
            />

            <label htmlFor='status'>Operate?</label>
            <select
              id='status'
              name='status'
              value={formData.status ? 'true' : 'false'}
              onChange={onChange}
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
                onClick={onClose}
                className='bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded'>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </ModalPortal>
  )
}

const BusinessItem: React.FC = () => {
  const [datas, setDatas] = useState<any[]>([])
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    id: 0,
    name: '',
    revenue: 0,
    capital: 0,
    status: false,
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'status' ? value === 'true' : value,
    }))
  }

  const openAddModal = () => {
    setFormData({
      id: 0,
      name: '',
      revenue: 0,
      capital: 0,
      status: false,
    })
    setIsAddOpen(true)
  }

  const closeAddModal = () => setIsAddOpen(false)

  const openUpdateModal = (
    id: number,
    name: string,
    revenue: number,
    capital: number,
    status: boolean
  ) => {
    setFormData({ id, name, revenue, capital, status })
    setIsUpdateOpen(true)
  }

  const closeUpdateModal = () => setIsUpdateOpen(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { name, revenue, capital, status } = formData
      await BusinessFinder.post('/', { name, revenue, capital, status })
      fetchData()
    } catch (error) {
      console.log(error)
    }
    closeAddModal()
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await BusinessFinder.put(`/`, formData)
      fetchData()
    } catch (error) {
      console.log(error)
    }
    closeUpdateModal()
  }

  const handleDelete = async (id: number) => {
    try {
      await BusinessFinder.delete(`/${id}`)
      setDatas((prev) => prev.filter((d) => d.id !== id))
    } catch (err) {
      console.log(err)
    }
  }

  const fetchData = async () => {
    try {
      const res = await BusinessFinder.get('/')
      if (res.data.data.business.length !== 0) {
        setDatas(res.data.data.business)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <>
      <div className='h-[35rem] overflow-auto bg-white rounded-sm flex flex-col flex-1'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {datas.map((data) => (
            <div
              key={data.id}
              className='bg-white rounded-lg overflow-hidden shadow-md border border-gray-200'>
              <div className='p-6'>
                <h2 className='text-lg font-semibold mb-4'>{data.name}</h2>
                <p className='text-gray-700'>Revenue : RM{data.revenue}</p>
              </div>
              <div className='flex'>
                <button
                  className='flex-1 bg-white text-black px-4 py-2 border border-gray-200'
                  onClick={() =>
                    openUpdateModal(
                      data.id,
                      data.name,
                      data.revenue,
                      data.capital,
                      data.status
                    )
                  }>
                  Edit
                </button>
                <button
                  className='flex-1 bg-red-500 text-white px-4 py-2 border border-gray-200'
                  onClick={() => handleDelete(data.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
          <div
            className='bg-white shadow-md rounded-lg p-6 flex flex-col border border-gray-200 items-center justify-center w-70 h-40 cursor-pointer'
            onClick={openAddModal}>
            <PlusIcon className='h-10 w-10 text-gray-500' />
          </div>
        </div>
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={closeAddModal}
        onSubmit={handleSubmit}
        formData={formData}
        onChange={handleChange}
        title='Add Business'
      />

      {/* Update Modal */}
      <Modal
        isOpen={isUpdateOpen}
        onClose={closeUpdateModal}
        onSubmit={handleUpdate}
        formData={formData}
        onChange={handleChange}
        title='Update Business'
      />
    </>
  )
}

export default BusinessItem
