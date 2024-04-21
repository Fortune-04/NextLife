import React, { useState, useEffect } from 'react'
import { PlusCircleIcon } from '@heroicons/react/24/outline'

const Goal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('#tab1')

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

  return (
    <>
      {/* <div className="bg-[url('./src/assets/Cloud.jpeg')] m-auto grid place-items-center"> */}
      {/* <div className="bg-[url('bg.jpg')] m-auto grid place-items-center min-h-screen"> */}
      <div className='tab-section bg-gray-100 p-5 rounded-lg backdrop-filter backdrop-blur-lg bg-opacity-40 min-h-[650px] border-2 border-indigo-200'>
        {/* <div className='tab-section bg-gray-100 p-5 rounded-lg backdrop-filter backdrop-blur-lg bg-opacity-40 w-[1000px] min-h-[400px] border-2 border-indigo-200'> */}
        <div className='flex flex-wrap gap-1'>
          <button
            className={`p-4 rounded-lg text-gray-700 font-bold hover:bg-gray-300 hover:bg-opacity-40 flex-grow w-80 ${
              activeTab === '#tab1' ? 'bg-indigo-200' : ''
            }`}
            data-tab-target='#tab1'>
            Ultimate
          </button>
          <button
            className={`p-4 rounded-lg font-bold hover:bg-gray-300 hover:bg-opacity-40 text-gray-700 flex-grow w-80 ${
              activeTab === '#tab2' ? 'bg-indigo-200' : ''
            }`}
            data-tab-target='#tab2'>
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
              <div className='w-300 h-60 bg-gray-300 rounded-xl'>
                <div className='bg-white rounded-lg overflow-hidden shadow-md flex'>
                  {/* Image Section */}
                  <div className='w-1/2 p-2'>
                    <img
                      src='./src/assets/Cloud.jpeg'
                      alt='Your Image'
                      className='object-cover h-full w-full'
                    />
                  </div>

                  {/* Content Section */}
                  <div className='p-4 flex flex-col justify-between'>
                    <div>
                      <h2 className='text-lg font-semibold mb-1'>
                        Buy a house
                      </h2>
                      <h2 className='text-lg font-semibold mb-1'>Target</h2>
                      <p className='text-gray-700 mb-2'>50000</p>
                      <h2 className='text-lg font-semibold mb-1'>Current</h2>
                      <p className='text-gray-700 mb-2'>2000</p>
                    </div>
                    <div className='mt-4'>
                      <button className='bg-green-500 text-white px-4 py-2 rounded-lg'>
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className='w-300 h-60 bg-gray-300 rounded-xl'>
                <div className='bg-white rounded-lg overflow-hidden shadow-md flex'>
                  {/* Image Section */}
                  <div className='w-1/2 p-2'>
                    <img
                      src='./src/assets/Cloud.jpeg'
                      alt='Your Image'
                      className='object-cover h-full w-full'
                    />
                  </div>

                  {/* Content Section */}
                  <div className='p-4 flex flex-col justify-between'>
                    <div>
                      <h2 className='text-lg font-semibold mb-1'>Buy a car</h2>
                      <h2 className='text-lg font-semibold mb-1'>Target</h2>
                      <p className='text-gray-700 mb-2'>50000</p>
                      <h2 className='text-lg font-semibold mb-1'>Current</h2>
                      <p className='text-gray-700 mb-2'>2000</p>
                    </div>
                    <div className='mt-4'>
                      <button className='bg-green-500 text-white px-4 py-2 rounded-lg'>
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className='w-300 h-60 bg-gray-300 rounded-xl'>
                <div className='bg-white rounded-lg overflow-hidden shadow-md flex'>
                  {/* Image Section */}
                  <div className='w-1/2 p-2'>
                    <img
                      src='./src/assets/Cloud.jpeg'
                      alt='Your Image'
                      className='object-cover h-full w-full'
                    />
                  </div>

                  {/* Content Section */}
                  <div className='p-4 flex flex-col justify-between'>
                    <div>
                      <h2 className='text-lg font-semibold mb-1'>Marriage</h2>
                      <h2 className='text-lg font-semibold mb-1'>Target</h2>
                      <p className='text-gray-700 mb-2'>50000</p>
                      <h2 className='text-lg font-semibold mb-1'>Current</h2>
                      <p className='text-gray-700 mb-2'>2000</p>
                    </div>
                    <div className='mt-4'>
                      <button className='bg-green-500 text-white px-4 py-2 rounded-lg'>
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className='w-300 h-60 bg-gray-300 rounded-xl'>
                <div className='bg-white rounded-lg overflow-hidden shadow-md flex'>
                  {/* Image Section */}
                  <div className='w-1/2 p-2'>
                    <img
                      src='./src/assets/Cloud.jpeg'
                      alt='Your Image'
                      className='object-cover h-full w-full'
                    />
                  </div>

                  {/* Content Section */}
                  <div className='p-4 flex flex-col justify-between'>
                    <div>
                      <h2 className='text-lg font-semibold mb-1'>Retirement</h2>
                      <h2 className='text-lg font-semibold mb-1'>Target</h2>
                      <p className='text-gray-700 mb-2'>50000</p>
                      <h2 className='text-lg font-semibold mb-1'>Current</h2>
                      <p className='text-gray-700 mb-2'>2000</p>
                    </div>
                    <div className='mt-4'>
                      <button className='bg-green-500 text-white px-4 py-2 rounded-lg'>
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            id='tab2'
            className={`tab-content text-gray-700 ${
              activeTab === '#tab2' ? '' : 'hidden'
            }`}>
            <div className='grid grid-cols-1 xl:grid-cols-1 gap-4 py-3  '>
              <div className='flex items-center space-x-4 w-1400 h-12 bg-gray-300 rounded-xl'>
                {/* Checkbox */}
                <input
                  type='checkbox'
                  className='h-4 w-4 text-blue-600 border-gray-300 rounded'
                />

                {/* Sentence */}
                <span className='text-gray-800'>
                  Agree to terms and conditions
                </span>

                {/* Icon */}
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6 text-gray-600'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M5 13l4 4L19 7'
                  />
                </svg>
              </div>
              <div className='w-1400 h-12 bg-gray-300 rounded-xl'></div>
              <div className='w-1400 h-12 bg-gray-300 rounded-xl'></div>
              <div className='w-1400 h-12 bg-indigo-100 rounded-xl'>
                You can do it!
                <button className='flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 focus:outline-none'>
                  <PlusCircleIcon className='w-6 h-6' />
                </button>
              </div>
            </div>
            {/* <h4 className='font-bold mt-9 mb-4 text-2xl'>Settings Info</h4>
            <p className='text-xl'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias
              aspernatur rem itaque doloribus culpa similique rerum provident id
              quos sed.
            </p> */}
          </div>
        </div>
      </div>
      {/* </div> */}
    </>
  )
}

export default Goal
