import { useState, useEffect, useMemo } from 'react'
import ModalPortal from './SubComponents/ModalPortal'

//API finder
import AssetFinder from '../Apis/AssetFinder'
import { NetworthFinder } from '../Apis/api'

//Import icon
import { PlusIcon, CubeIcon, TrashIcon, PencilSquareIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

interface FormData {
  id: number
  name: string
  value: number
  base_value: number
  value_mode: string
  networth_id?: number | undefined
}

interface NetworthData {
  id: number
  name: string
  value: number
  base_value: number
  type: string
}


const Asset: React.FC = () => {
  //Temporary data
  const [datas, setDatas] = useState<FormData[]>([])
  const [networthDatas, setNetworthDatas] = useState<NetworthData[]>([])
  //Modal
  const [isOpen, setIsOpen] = useState(false)
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)
  //FormData
  const [nameError, setNameError] = useState('')
  const [formData, setFormData] = useState<FormData>({
    id: 0,
    name: '',
    value: 0,
    base_value: 0,
    value_mode: 'rm',
    networth_id: 0,
  })

  const [deleteId, setDeleteId] = useState<number | null>(null)
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    if (name === 'name') setNameError('')
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]:
        name === 'networth_id' || name === 'value' || name === 'base_value'
          ? value === ''
            ? name === 'networth_id' ? undefined : 0
            : Number(value)
          : value,
    }))
  }

  const openModal = () => {
    setIsOpen(true)
  }

  const closeModal = () => {
    setNameError('')
    setFormData({
      ...formData,
      id: 0,
      name: '',
      value: 0,
      base_value: 0,
      value_mode: 'rm',
      networth_id: 0,
    })
    setIsOpen(false)
  }

  const openUpdateModal = (
    id: number,
    name: string,
    value: number,
    base_value: number,
    value_mode: string,
    networth_id: number | undefined
  ) => {
    setFormData({
      ...formData,
      id: id,
      name: name,
      value: value,
      base_value: base_value,
      value_mode: value_mode || 'rm',
      networth_id: networth_id,
    })
    setIsUpdateOpen(true)
  }

  const closeUpdateModal = () => {
    setNameError('')
    setFormData({
      ...formData,
      id: 0,
      name: '',
      value: 0,
      base_value: 0,
      value_mode: 'rm',
      networth_id: 0,
    })
    setIsUpdateOpen(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      setNameError('Name is required')
      return
    }

    try {
      const body = {
        name: formData.name,
        value: formData.value,
        base_value: formData.base_value,
        value_mode: formData.value_mode,
        networth_id: formData.networth_id || null,
      }
      const response = await AssetFinder.post('/', body)
      fetchData()
    } catch (error) {
      console.log(error)
    }
    closeModal()
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await AssetFinder.delete(`/${id}`)
      setDatas(
        datas.filter((data) => {
          return data.id !== id
        })
      )
    } catch (err) {
      console.log(err)
    }
    setDeleteId(null)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      setNameError('Name is required')
      return
    }
    try {
      const body = {
        id: formData.id,
        name: formData.name,
        value: formData.value,
        base_value: formData.base_value,
        value_mode: formData.value_mode,
        networth_id: formData.networth_id || null,
      }
      const response = await AssetFinder.put(`/`, body)
      setDatas([])
      fetchData()
    } catch (error) {
      console.log(error)
    }
    closeUpdateModal()
  }

  const fetchData = async () => {
    try {
      const response = await AssetFinder.get('/')
      const assetData = response.data.data.asset
      if (assetData.length > 0) {
        const sortedData = assetData.sort((a: FormData, b: FormData) =>
          a.name.localeCompare(b.name)
        )
        setDatas(sortedData)
      }
    } catch (error) {
      console.log(error)
    }
    try {
      const response = await NetworthFinder.get('/')
      const nwData = response.data.data.networth
      if (nwData.length > 0) {
        setNetworthDatas(nwData)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const networthMap = useMemo(() => {
    const map: Record<number, string> = {}
    networthDatas.forEach((nw) => {
      map[nw.id] = nw.name
    })
    return map
  }, [networthDatas])

  const networthValueMap = useMemo(() => {
    const map: Record<number, number> = {}
    networthDatas.forEach((nw) => {
      map[nw.id] = nw.value
    })
    return map
  }, [networthDatas])

  const fmtRM = (v: number) =>
    `RM ${Number(v).toLocaleString('en-MY', { minimumFractionDigits: 2 })}`

  const fmtUnit = (v: number) =>
    `${Number(v).toLocaleString('en-MY', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} unit${v !== 1 ? 's' : ''}`

  const fmtValue = (v: number, mode: string) =>
    mode === 'unit' ? fmtUnit(v) : fmtRM(v)


  return (
    <>
      {datas.length === 0 ? (
        <div className='flex-1 h-full flex flex-col items-center justify-center'>
          <div className='w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4'>
            <CubeIcon className='h-8 w-8 text-gray-300' />
          </div>
          <p className='text-gray-400 text-lg mb-1'>No asset data yet</p>
          <p className='text-gray-300 text-sm mb-6'>Add your first asset to get started</p>
          <button
            onClick={openModal}
            className='inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2.5 px-5 rounded-xl transition-colors shadow-sm'>
            <PlusIcon className='h-4 w-4' />
            Add Asset
          </button>
        </div>
      ) : (
      <div className='overflow-auto flex flex-col flex-1'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {datas.map((data) => {
            const currentValue = data.networth_id
              ? (networthValueMap[data.networth_id] ?? data.value)
              : data.value
            const remaining = data.base_value - currentValue
            const pct = data.base_value > 0 ? ((currentValue / data.base_value) * 100) : 0
            const progressWidth = Math.min(pct, 100)

            return (
              <div
                key={data.id}
                className='bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col'>
                {/* Header */}
                <div className='px-5 pt-5 pb-3 flex items-start justify-between gap-2'>
                  <div className='flex items-center gap-3 min-w-0'>
                    <div className='w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0'>
                      <span className='text-emerald-600 font-bold text-sm'>
                        {data.name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <div className='min-w-0'>
                      <h2 className='text-base font-semibold text-gray-800 truncate'>{data.name}</h2>
                      {networthMap[data.networth_id ?? 0] && (
                        <p className='text-xs text-indigo-500 truncate'>
                          Linked: {networthMap[data.networth_id ?? 0]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Target */}
                <div className='px-5 pb-2'>
                  <p className='text-xs text-gray-400 uppercase tracking-wider mb-1'>Target</p>
                  <p className='text-2xl font-bold text-gray-900'>{fmtValue(data.base_value, data.value_mode)}</p>
                </div>

                {/* Current & Remaining */}
                <div className='px-5 pb-2 flex items-center gap-4'>
                  <div className='flex-1 min-w-0'>
                    <p className='text-xs text-gray-400'>Current</p>
                    <p className='text-sm font-medium text-gray-600 truncate'>{fmtValue(currentValue, data.value_mode)}</p>
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-xs text-gray-400'>Remaining</p>
                    <p
                      className={`text-sm font-semibold truncate ${
                        remaining <= 0 ? 'text-emerald-600' : 'text-gray-600'
                      }`}>
                      {fmtValue(Math.max(remaining, 0), data.value_mode)}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className='px-5 pb-4'>
                  <div className='flex items-center justify-between mb-1'>
                    <p className='text-xs text-gray-400'>Progress</p>
                    <p className='text-xs font-medium text-gray-500'>{pct.toFixed(1)}%</p>
                  </div>
                  <div className='w-full h-1.5 bg-gray-100 rounded-full overflow-hidden'>
                    <div
                      className={`h-full rounded-full transition-all ${
                        pct >= 100 ? 'bg-emerald-500' : 'bg-indigo-500'
                      }`}
                      style={{ width: `${progressWidth}%` }}
                    />
                  </div>
                </div>

                {/* Divider + Actions */}
                <div className='border-t border-gray-100 flex mt-auto'>
                  <button
                    className='flex-1 inline-flex items-center justify-center gap-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 py-2.5 transition-colors'
                    onClick={() =>
                      openUpdateModal(
                        data.id,
                        data.name,
                        data.value,
                        data.base_value,
                        data.value_mode,
                        data.networth_id
                      )
                    }>
                    <PencilSquareIcon className='h-4 w-4' />
                    Edit
                  </button>
                  <div className='w-px bg-gray-100' />
                  <button
                    className='flex-1 inline-flex items-center justify-center gap-1.5 text-sm font-medium text-red-500 hover:bg-red-50 py-2.5 transition-colors'
                    onClick={() => setDeleteId(data.id)}>
                    <TrashIcon className='h-4 w-4' />
                    Delete
                  </button>
                </div>
              </div>
            )
          })}

          <div
            className='rounded-xl p-6 flex flex-col border border-dashed border-gray-200 items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-colors'
            onClick={openModal}>
            <PlusIcon className='h-8 w-8 text-gray-300' />
            <span className='text-sm text-gray-400 mt-2'>Add Asset</span>
          </div>
        </div>
      </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId !== null && (
        <ModalPortal>
          <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-[9999] p-4'>
            <div className='bg-white rounded-2xl shadow-2xl w-full max-w-sm relative animate-in fade-in zoom-in-95'>
              <div className='p-6 text-center'>
                <div className='w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4'>
                  <ExclamationTriangleIcon className='h-6 w-6 text-red-500' />
                </div>
                <h3 className='text-lg font-bold text-gray-900 mb-1'>Delete Asset</h3>
                <p className='text-sm text-gray-500'>
                  Are you sure you want to delete <span className='font-medium text-gray-700'>"{datas.find(d => d.id === deleteId)?.name}"</span>? This action cannot be undone.
                </p>
              </div>
              <div className='flex gap-3 px-6 pb-6'>
                <button
                  onClick={() => deleteId && handleDelete(deleteId)}
                  className='flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-sm'>
                  Delete
                </button>
                <button
                  onClick={() => setDeleteId(null)}
                  className='flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors'>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
      {/* Modal for update asset*/}
      {isUpdateOpen && (
        <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4'>
          <div className='bg-white rounded-2xl shadow-2xl w-full max-w-md'>
            <div className='flex items-center justify-between px-6 pt-6 pb-2'>
              <h2 className='text-lg font-bold text-gray-900'>Update Asset</h2>
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
                  <label htmlFor='name' className='block text-sm font-medium text-gray-600 mb-1.5'>Name</label>
                  <input
                    type='text'
                    id='name'
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 bg-gray-50 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                      nameError ? 'border-red-400 focus:ring-red-500/20 focus:border-red-400' : 'border-gray-200 focus:ring-indigo-500/20 focus:border-indigo-400'
                    }`}
                    placeholder='Asset name'
                  />
                  {nameError && (
                    <p className='text-xs text-red-500 mt-1'>{nameError}</p>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-600 mb-1.5'>Value Mode</label>
                  <div className='flex rounded-xl overflow-hidden border border-gray-200'>
                    <button
                      type='button'
                      onClick={() => setFormData((prev) => ({ ...prev, value_mode: 'rm' }))}
                      className={`flex-1 py-2 text-sm font-medium transition-colors ${
                        formData.value_mode === 'rm'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}>
                      RM
                    </button>
                    <button
                      type='button'
                      onClick={() => setFormData((prev) => ({ ...prev, value_mode: 'unit', networth_id: 0 }))}
                      className={`flex-1 py-2 text-sm font-medium transition-colors ${
                        formData.value_mode === 'unit'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}>
                      Unit
                    </button>
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-3'>
                  <div>
                    <label htmlFor='value' className='block text-sm font-medium text-gray-600 mb-1.5'>
                      Value {formData.value_mode === 'rm' ? '(RM)' : '(Units)'}
                    </label>
                    <input
                      type='number'
                      id='value'
                      name='value'
                      min={0}
                      step={formData.value_mode === 'unit' ? '0.01' : 'any'}
                      value={formData.value}
                      onChange={handleChange}
                      disabled={!!formData.networth_id}
                      className={`w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-colors ${formData.networth_id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      placeholder={formData.value_mode === 'rm' ? '0.00' : '0'}
                    />
                    {!!formData.networth_id && (
                      <p className='text-xs text-indigo-500 mt-1'>Linked to networth</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor='base_value' className='block text-sm font-medium text-gray-600 mb-1.5'>
                      Target {formData.value_mode === 'rm' ? '(RM)' : '(Units)'}
                    </label>
                    <input
                      type='number'
                      id='base_value'
                      name='base_value'
                      min={0}
                      step={formData.value_mode === 'unit' ? '0.01' : 'any'}
                      value={formData.base_value}
                      onChange={handleChange}
                      className='w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-colors'
                      placeholder={formData.value_mode === 'rm' ? '0.00' : '0'}
                    />
                  </div>
                </div>

                {formData.value_mode === 'rm' && (
                <div>
                  <label htmlFor='networth_id' className='block text-sm font-medium text-gray-600 mb-1.5'>Link to Networth</label>
                  <select
                    id='networth_id'
                    name='networth_id'
                    value={formData.networth_id?.toString() || ''}
                    onChange={handleChange}
                    className='w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-colors'>
                    <option value=''>None</option>
                    {networthDatas.map((nw) => (
                      <option key={nw.id} value={nw.id.toString()}>
                        {nw.name}
                      </option>
                    ))}
                  </select>
                </div>
                )}
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
      {/* Modal for add asset*/}
      {isOpen && (
        <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4'>
          <div className='bg-white rounded-2xl shadow-2xl w-full max-w-md'>
            <div className='flex items-center justify-between px-6 pt-6 pb-2'>
              <h2 className='text-lg font-bold text-gray-900'>Add Asset</h2>
              <button
                onClick={closeModal}
                className='w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors'>
                <svg className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className='px-6 pb-6'>
              <div className='space-y-4 mb-6'>
                <div>
                  <label htmlFor='name' className='block text-sm font-medium text-gray-600 mb-1.5'>Name</label>
                  <input
                    type='text'
                    id='name'
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 bg-gray-50 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                      nameError ? 'border-red-400 focus:ring-red-500/20 focus:border-red-400' : 'border-gray-200 focus:ring-indigo-500/20 focus:border-indigo-400'
                    }`}
                    placeholder='Asset name'
                  />
                  {nameError && (
                    <p className='text-xs text-red-500 mt-1'>{nameError}</p>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-600 mb-1.5'>Value Mode</label>
                  <div className='flex rounded-xl overflow-hidden border border-gray-200'>
                    <button
                      type='button'
                      onClick={() => setFormData((prev) => ({ ...prev, value_mode: 'rm' }))}
                      className={`flex-1 py-2 text-sm font-medium transition-colors ${
                        formData.value_mode === 'rm'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}>
                      RM
                    </button>
                    <button
                      type='button'
                      onClick={() => setFormData((prev) => ({ ...prev, value_mode: 'unit', networth_id: 0 }))}
                      className={`flex-1 py-2 text-sm font-medium transition-colors ${
                        formData.value_mode === 'unit'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}>
                      Unit
                    </button>
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-3'>
                  <div>
                    <label htmlFor='value' className='block text-sm font-medium text-gray-600 mb-1.5'>
                      Value {formData.value_mode === 'rm' ? '(RM)' : '(Units)'}
                    </label>
                    <input
                      type='number'
                      id='value'
                      name='value'
                      min={0}
                      step={formData.value_mode === 'unit' ? '0.01' : 'any'}
                      value={formData.value}
                      onChange={handleChange}
                      disabled={!!formData.networth_id}
                      className={`w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-colors ${formData.networth_id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      placeholder={formData.value_mode === 'rm' ? '0.00' : '0'}
                    />
                    {!!formData.networth_id && (
                      <p className='text-xs text-indigo-500 mt-1'>Linked to networth</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor='base_value' className='block text-sm font-medium text-gray-600 mb-1.5'>
                      Target {formData.value_mode === 'rm' ? '(RM)' : '(Units)'}
                    </label>
                    <input
                      type='number'
                      id='base_value'
                      name='base_value'
                      min={0}
                      step={formData.value_mode === 'unit' ? '0.01' : 'any'}
                      value={formData.base_value}
                      onChange={handleChange}
                      className='w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-colors'
                      placeholder={formData.value_mode === 'rm' ? '0.00' : '0'}
                    />
                  </div>
                </div>

                {formData.value_mode === 'rm' && (
                <div>
                  <label htmlFor='networth_id' className='block text-sm font-medium text-gray-600 mb-1.5'>Link to Networth</label>
                  <select
                    id='networth_id'
                    name='networth_id'
                    value={formData.networth_id?.toString() || ''}
                    onChange={handleChange}
                    className='w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-colors'>
                    <option value=''>None</option>
                    {networthDatas.map((nw) => (
                      <option key={nw.id} value={nw.id.toString()}>
                        {nw.name}
                      </option>
                    ))}
                  </select>
                </div>
                )}
              </div>

              <div className='flex gap-3'>
                <button
                  type='submit'
                  className='flex-1 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm'>
                  Save
                </button>
                <button
                  type='button'
                  onClick={closeModal}
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

export default Asset
