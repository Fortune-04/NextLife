import { useState, useEffect } from 'react'
import BusinessFinder from '../../Apis/BusinessFinder'

import { PlusIcon } from '@heroicons/react/24/solid'

interface FormData {
  id: number
  name: string
  revenue: number
  capital: number
  status: boolean
}

const BusinessItem: React.FC = () => {
  //Temporary data
  const [datas, setDatas] = useState<any[]>([])
  //Modal
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)
  //FormData
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
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }))
  }

  const openAddModal = () => {
    setIsAddOpen(true)
  }

  const closeAddModal = () => {
    setIsAddOpen(false)
  }

  const openUpdateModal = (
    id: number,
    name: string,
    revenue: number,
    capital: number,
    status: boolean
  ) => {
    setFormData({
      ...formData,
      id: id,
      name: name,
      revenue: revenue,
      capital: capital,
      status: status,
    })
    setIsUpdateOpen(true)
  }

  const closeUpdateModal = () => {
    setFormData({
      ...formData, // Keep existing state for other fields
      id: 0,
      name: '',
      revenue: 0,
      capital: 0,
      status: false,
    })
    setIsUpdateOpen(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const body = {
        name: formData.name,
        revenue: formData.revenue,
        capital: formData.capital,
        status: formData.status,
      }
      const response = await BusinessFinder.post('/', body)
      fetchData()
    } catch (error) {
      console.log(error)
    }
    closeAddModal() // Close the modal after form submission
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await BusinessFinder.delete(`/${id}`)
      setDatas(
        datas.filter((data) => {
          return data.id !== id
        })
      )
      console.log(response)
      // setOpenDelModal(false);
      // setOpenSnackDel(true);
    } catch (err) {
      console.log(err)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      const body = {
        id: formData.id,
        name: formData.name,
        revenue: formData.revenue,
        capital: formData.capital,
        status: formData.status,
      }
      const response = await BusinessFinder.put(`/`, body)
      setDatas([])
      fetchData()
    } catch (error) {
      console.log(error)
    }
    setIsUpdateOpen(false)
  }

  const fetchData = async () => {
    try {
      const response = await BusinessFinder.get('/')
      if (response.data.data.business.length !== 0) {
        // Update state once with all the data
        setDatas(response.data.data.business)
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
      <div className='h-[35rem] overflow-auto bg-white p-4 rounded-sm flex flex-col flex-1'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {datas &&
            datas.map((data) => (
              <div
                key={data.id}
                className='bg-white rounded-lg overflow-hidden shadow-md border border-gray-200'>
                <div className='p-6'>
                  <h2 className='text-lg font-semibold mb-4'>{data.name}</h2>
                  <p className='text-gray-700'>Revenue : RM{data.revenue}</p>
                </div>
                <div className='flex flex-col h-full bg-gray-100'>
                  {/* <div className='p-6'></div>{' '} */}
                  {/* Placeholder to maintain space */}
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
              </div>
            ))}
          <div
            className='bg-white shadow-md rounded-lg p-6 flex flex-col border border-gray-200 items-center justify-center w-70 h-40'
            onClick={openAddModal}>
            <PlusIcon className='h-10 w-10 text-gray-500' />
            {/* <span className='mt-2'>Card Content</span> */}
          </div>
        </div>
      </div>
      {/* Modal for update networth*/}
      {isUpdateOpen && (
        <div className='fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center'>
          <div className='bg-white p-6 rounded-lg shadow-xl'>
            {/* Close Button */}
            <button
              onClick={closeAddModal}
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

                  <label htmlFor='revenue'>Revenue:</label>
                  <input
                    type='number'
                    id='revenue'
                    name='revenue'
                    value={formData.revenue}
                    onChange={handleChange}
                    className='border border-gray-300 rounded-md p-2 mb-4 w-full'
                  />

                  <label htmlFor='capital'>Capital:</label>
                  <input
                    type='number'
                    id='capital'
                    name='capital'
                    value={formData.capital}
                    onChange={handleChange}
                    className='border border-gray-300 rounded-md p-2 mb-4 w-full'
                  />

                  <label htmlFor='status'>Operate?</label>
                  <select
                    id='status'
                    name='status'
                    value={formData.status ? 'true' : 'false'}
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
      {/* Modal for add networth*/}
      {isAddOpen && (
        <div className='fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center'>
          <div className='bg-white p-6 rounded-lg shadow-xl'>
            {/* Close Button */}
            <button
              onClick={closeAddModal}
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

                <form onSubmit={handleSubmit}>
                  <label htmlFor='name'>Name:</label>
                  <input
                    type='text'
                    id='name'
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    className='border border-gray-300 rounded-md p-2 mb-4 w-full'
                  />

                  <label htmlFor='revenue'>Revenue:</label>
                  <input
                    type='number'
                    id='revenue'
                    name='revenue'
                    value={formData.revenue}
                    onChange={handleChange}
                    className='border border-gray-300 rounded-md p-2 mb-4 w-full'
                  />

                  <label htmlFor='capital'>Capital:</label>
                  <input
                    type='number'
                    id='capital'
                    name='capital'
                    value={formData.capital}
                    onChange={handleChange}
                    className='border border-gray-300 rounded-md p-2 mb-4 w-full'
                  />

                  <label htmlFor='status'>Operate?</label>
                  <select
                    id='status'
                    name='status'
                    value={formData.status ? 'true' : 'false'}
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
                      onClick={closeAddModal}
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

export default BusinessItem
