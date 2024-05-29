import { useState, useEffect } from 'react'

//API finder
import NetworthFinder from '../Apis/NetworthFinder'

//Import icon
import { PlusIcon } from '@heroicons/react/24/solid'

interface FormData {
  id: number
  name: string
  value: number
  base_value: number
  investment: boolean
}

const Networth: React.FC = () => {
  //Temporary data
  const [datas, setDatas] = useState<FormData[]>([])
  //Modal
  const [isOpen, setIsOpen] = useState(false)
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)
  //FormData
  const [formData, setFormData] = useState<FormData>({
    id: 0,
    name: '',
    value: 0,
    base_value: 0,
    investment: false,
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

  const openModal = () => {
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  const openUpdateModal = (
    id: number,
    name: string,
    value: number,
    base_value: number,
    investment: boolean
  ) => {
    setFormData({
      ...formData,
      id: id,
      name: name,
      value: value,
      base_value: base_value,
      investment: investment,
    })
    setIsUpdateOpen(true)
  }

  const closeUpdateModal = () => {
    setFormData({
      ...formData, // Keep existing state for other fields
      id: 0,
      name: '',
      value: 0,
      base_value: 0,
      investment: false,
    })
    setIsUpdateOpen(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const body = {
        name: formData.name,
        value: formData.value,
        base_value: formData.base_value,
        investment: formData.investment,
      }
      console.log(body)
      const response = await NetworthFinder.post('/', body)
      fetchData()
    } catch (error) {
      console.log(error)
    }
    closeModal() // Close the modal after form submission
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await NetworthFinder.delete(`/${id}`)
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
        value: formData.value,
        base_value: formData.base_value,
        investment: formData.investment,
      }
      const response = await NetworthFinder.put(`/`, body)
      setDatas([])
      fetchData()
    } catch (error) {
      console.log(error)
    }
    setIsUpdateOpen(false)
  }

  const fetchData = async () => {
    try {
      const response = await NetworthFinder.get('/')
      console.log(response.data)
      const networthData = response.data.data.networth
      if (networthData.length > 0) {
        const sortedData = networthData.sort((a: FormData, b: FormData) =>
          a.name.localeCompare(b.name)
        )
        setDatas(sortedData)
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
      {/* <div className='h-[41rem] overflow-auto bg-white p-4 rounded-sm flex flex-col flex-1'> */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {datas &&
          datas.map((data) => (
            <div
              key={data.id}
              className='bg-white rounded-lg overflow-hidden shadow-md border border-gray-200'>
              <div className='p-6'>
                <h2 className='text-lg font-semibold mb-4'>{data.name}</h2>
                <p className='text-gray-700'>{data.value}</p>
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
                        data.value,
                        data.base_value,
                        data.investment
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
          onClick={openModal}>
          <PlusIcon className='h-10 w-10 text-gray-500' />
          {/* <span className='mt-2'>Card Content</span> */}
        </div>
      </div>
      {/* </div> */}
      {/* Modal for update networth*/}
      {isUpdateOpen && (
        <div className='fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center'>
          <div className='bg-white p-6 rounded-lg shadow-xl'>
            {/* Close Button */}
            <button
              onClick={closeModal}
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

                  <label htmlFor='value'>Value:</label>
                  <input
                    type='number'
                    id='value'
                    name='value'
                    value={formData.value}
                    onChange={handleChange}
                    className='border border-gray-300 rounded-md p-2 mb-4 w-full'
                  />

                  <label htmlFor='target_value'>Target value:</label>
                  <input
                    type='number'
                    id='base_value'
                    name='base_value'
                    value={formData.base_value}
                    onChange={handleChange}
                    className='border border-gray-300 rounded-md p-2 mb-4 w-full'
                  />

                  <label htmlFor='investment'>Investment?</label>
                  <select
                    id='investment'
                    name='investment'
                    value={formData.investment ? 'true' : 'false'}
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
      {isOpen && (
        <div className='fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center'>
          <div className='bg-white p-6 rounded-lg shadow-xl'>
            {/* Close Button */}
            <button
              onClick={closeModal}
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

                  <label htmlFor='value'>Value:</label>
                  <input
                    type='number'
                    id='value'
                    name='value'
                    value={formData.value}
                    onChange={handleChange}
                    className='border border-gray-300 rounded-md p-2 mb-4 w-full'
                  />

                  <label htmlFor='target_value'>Target value:</label>
                  <input
                    type='number'
                    id='base_value'
                    name='base_value'
                    value={formData.base_value}
                    onChange={handleChange}
                    className='border border-gray-300 rounded-md p-2 mb-4 w-full'
                  />

                  <label htmlFor='investment'>Investment?</label>
                  <select
                    id='investment'
                    name='investment'
                    value={formData.investment ? 'true' : 'false'}
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
                      onClick={closeModal}
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

export default Networth
