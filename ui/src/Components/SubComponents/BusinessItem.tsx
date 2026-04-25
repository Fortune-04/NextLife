import { useState, useEffect } from 'react'
import BusinessFinder from '../../Apis/BusinessFinder'
import { PlusIcon, BuildingStorefrontIcon, TrashIcon, PencilSquareIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
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
  error: string
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onChange,
  title,
  error,
}) => {
  if (!isOpen) return null

  return (
    <ModalPortal>
      <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-[9999] p-4'>
        <div className='bg-white rounded-2xl shadow-2xl w-full max-w-md relative animate-in fade-in zoom-in-95'>
          {/* Header */}
          <div className='flex items-center justify-between px-6 pt-6 pb-2'>
            <h2 className='text-lg font-bold text-gray-900'>{title}</h2>
            <button
              onClick={onClose}
              className='w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors'>
              <svg className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
          </div>

          <form onSubmit={onSubmit} className='px-6 pb-6'>
            <div className='space-y-4 mb-6'>
              <div>
                <label htmlFor='name' className='block text-sm font-medium text-gray-600 mb-1.5'>Name</label>
                <input
                  type='text'
                  id='name'
                  name='name'
                  value={formData.name}
                  onChange={onChange}
                  className={`w-full px-3.5 py-2.5 bg-gray-50 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                    error ? 'border-red-400 focus:ring-red-500/20 focus:border-red-400' : 'border-gray-200 focus:ring-indigo-500/20 focus:border-indigo-400'
                  }`}
                  placeholder='Business name'
                />
                {error && (
                  <p className='text-xs text-red-500 mt-1'>{error}</p>
                )}
              </div>

              <div className='grid grid-cols-2 gap-3'>
                <div>
                  <label htmlFor='revenue' className='block text-sm font-medium text-gray-600 mb-1.5'>Revenue (RM)</label>
                  <input
                    type='number'
                    id='revenue'
                    name='revenue'
                    value={formData.revenue}
                    onChange={onChange}
                    className='w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-colors'
                    placeholder='0.00'
                  />
                </div>
                <div>
                  <label htmlFor='capital' className='block text-sm font-medium text-gray-600 mb-1.5'>Capital (RM)</label>
                  <input
                    type='number'
                    id='capital'
                    name='capital'
                    value={formData.capital}
                    onChange={onChange}
                    className='w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-colors'
                    placeholder='0.00'
                  />
                </div>
              </div>

              <div>
                <label htmlFor='status' className='block text-sm font-medium text-gray-600 mb-1.5'>Operating Status</label>
                <select
                  id='status'
                  name='status'
                  value={formData.status ? 'true' : 'false'}
                  onChange={onChange}
                  className='w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-colors'>
                  <option value=''>Select status</option>
                  <option value='true'>Active</option>
                  <option value='false'>Inactive</option>
                </select>
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
                onClick={onClose}
                className='flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors'>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </ModalPortal>
  )
}

interface DeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  businessName: string
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  businessName,
}) => {
  if (!isOpen) return null

  return (
    <ModalPortal>
      <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-[9999] p-4'>
        <div className='bg-white rounded-2xl shadow-2xl w-full max-w-sm relative animate-in fade-in zoom-in-95'>
          <div className='p-6 text-center'>
            <div className='w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4'>
              <ExclamationTriangleIcon className='h-6 w-6 text-red-500' />
            </div>
            <h3 className='text-lg font-bold text-gray-900 mb-1'>Delete Business</h3>
            <p className='text-sm text-gray-500'>
              Are you sure you want to delete <span className='font-medium text-gray-700'>"{businessName}"</span>? This action cannot be undone.
            </p>
          </div>
          <div className='flex gap-3 px-6 pb-6'>
            <button
              onClick={onConfirm}
              className='flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-sm'>
              Delete
            </button>
            <button
              onClick={onClose}
              className='flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors'>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  )
}

const BusinessItem: React.FC<{ onDataChange?: () => void }> = ({ onDataChange }) => {
  const [datas, setDatas] = useState<any[]>([])
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null)
  const [formData, setFormData] = useState<FormData>({
    id: 0,
    name: '',
    revenue: 0,
    capital: 0,
    status: false,
  })
  const [nameError, setNameError] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    if (name === 'name') setNameError('')
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

  const closeAddModal = () => {
    setNameError('')
    setIsAddOpen(false)
  }

  const openUpdateModal = (
    id: number,
    name: string,
    revenue: number,
    capital: number,
    status: boolean
  ) => {
    setFormData({ id, name, revenue, capital, status: String(status) === 'true' })
    setIsUpdateOpen(true)
  }

  const closeUpdateModal = () => {
    setNameError('')
    setIsUpdateOpen(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      setNameError('Business name is required')
      return
    }
    try {
      const { name, revenue, capital, status } = formData
      await BusinessFinder.post('/', { name, revenue, capital, status })
      fetchData()
      onDataChange?.()
    } catch (error) {
      console.log(error)
    }
    closeAddModal()
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      setNameError('Business name is required')
      return
    }
    try {
      await BusinessFinder.put(`/`, formData)
      fetchData()
      onDataChange?.()
    } catch (error) {
      console.log(error)
    }
    closeUpdateModal()
  }

  const openDeleteConfirm = (id: number, name: string) => {
    setDeleteTarget({ id, name })
  }

  const closeDeleteConfirm = () => setDeleteTarget(null)

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await BusinessFinder.delete(`/${deleteTarget.id}`)
      setDatas((prev) => prev.filter((d) => d.id !== deleteTarget.id))
      onDataChange?.()
    } catch (err) {
      console.log(err)
    }
    setDeleteTarget(null)
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

  const fmtRM = (v: number) =>
    `RM ${Number(v).toLocaleString('en-MY', { minimumFractionDigits: 2 })}`

  return (
    <>
      {datas.length === 0 ? (
        <div className='flex-1 h-full flex flex-col items-center justify-center'>
          <div className='w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4'>
            <BuildingStorefrontIcon className='h-8 w-8 text-gray-300' />
          </div>
          <p className='text-gray-400 text-lg mb-1'>No business data yet</p>
          <p className='text-gray-300 text-sm mb-6'>Add your first business to get started</p>
          <button
            onClick={openAddModal}
            className='inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2.5 px-5 rounded-xl transition-colors shadow-sm'>
            <PlusIcon className='h-4 w-4' />
            Add Business
          </button>
        </div>
      ) : (
      <div className='overflow-auto flex flex-col flex-1'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {datas.map((data) => {
            const profit = data.revenue - data.capital
            const isProfit = profit >= 0
            return (
              <div
                key={data.id}
                className='bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow'>
                {/* Header */}
                <div className='px-5 pt-5 pb-3 flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center'>
                      <span className='text-indigo-600 font-bold text-sm'>
                        {data.name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <h2 className='text-base font-semibold text-gray-800'>{data.name}</h2>
                  </div>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      String(data.status) === 'true'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                    {String(data.status) === 'true' ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Revenue & Capital */}
                <div className='px-5 pb-2'>
                  <p className='text-xs text-gray-400 uppercase tracking-wider mb-1'>Revenue</p>
                  <p className='text-2xl font-bold text-gray-900'>{fmtRM(data.revenue)}</p>
                </div>

                <div className='px-5 pb-3 flex items-center gap-4'>
                  <div className='flex-1'>
                    <p className='text-xs text-gray-400'>Capital</p>
                    <p className='text-sm font-medium text-gray-600'>{fmtRM(data.capital)}</p>
                  </div>
                  <div className='flex-1'>
                    <p className='text-xs text-gray-400'>Profit / Loss</p>
                    <p
                      className={`text-sm font-semibold ${
                        isProfit ? 'text-emerald-600' : 'text-red-500'
                      }`}>
                      {isProfit ? '+' : '-'} {fmtRM(Math.abs(profit))}
                    </p>
                  </div>
                </div>

                {/* Divider + Actions */}
                <div className='border-t border-gray-100 flex'>
                  <button
                    className='flex-1 inline-flex items-center justify-center gap-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 py-2.5 transition-colors'
                    onClick={() =>
                      openUpdateModal(
                        data.id,
                        data.name,
                        data.revenue,
                        data.capital,
                        data.status
                      )
                    }>
                    <PencilSquareIcon className='h-4 w-4' />
                    Edit
                  </button>
                  <div className='w-px bg-gray-100' />
                  <button
                    className='flex-1 inline-flex items-center justify-center gap-1.5 text-sm font-medium text-red-500 hover:bg-red-50 py-2.5 transition-colors'
                    onClick={() => openDeleteConfirm(data.id, data.name)}>
                    <TrashIcon className='h-4 w-4' />
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
          <div
            className='rounded-xl p-6 flex flex-col border border-dashed border-gray-200 items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-colors'
            onClick={openAddModal}>
            <PlusIcon className='h-8 w-8 text-gray-300' />
            <span className='text-sm text-gray-400 mt-2'>Add Business</span>
          </div>
        </div>
      </div>
      )}

      {/* Add Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={closeAddModal}
        onSubmit={handleSubmit}
        formData={formData}
        onChange={handleChange}
        title='Add Business'
        error={nameError}
      />

      {/* Update Modal */}
      <Modal
        isOpen={isUpdateOpen}
        onClose={closeUpdateModal}
        onSubmit={handleUpdate}
        formData={formData}
        onChange={handleChange}
        title='Update Business'
        error={nameError}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteTarget !== null}
        onClose={closeDeleteConfirm}
        onConfirm={handleDelete}
        businessName={deleteTarget?.name ?? ''}
      />
    </>
  )
}

export default BusinessItem
