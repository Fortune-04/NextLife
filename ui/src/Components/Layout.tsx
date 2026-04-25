import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'

import ChartFillIcon from '../assets/Chart_fill.png'
import UserIcon from '../assets/User.png'
import FolderIcon from '../assets/Folder.png'
import ChartIcon from '../assets/Chart.png'
import ChatIcon from '../assets/Chat.png'
import CalendarIcon from '../assets/Calendar.png'
import SettingIcon from '../assets/Setting.png'
import ControlIcon from '../assets/control.png'
import LogoIcon from '../assets/logo.png'

const Layout = () => {
  const history = useNavigate()
  const location = useLocation()
  const isNetworth = location.pathname === '/networth'
  const isGoal = location.pathname === '/goal'

  const [open, setOpen] = useState(window.innerWidth >= 768)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  const Menus = [
    { title: 'Dashboard', src: ChartFillIcon, path: '/' },
    { title: 'Investment', src: UserIcon, path: '/investment' },
    { title: 'Trading', src: FolderIcon, path: '/trading' },
    { title: 'Business', src: ChartIcon, path: '/business' },
    { title: 'Networth', src: ChatIcon, path: '/networth' },
    { title: 'Goal', src: CalendarIcon, gap: true, path: '/goal' },
    { title: 'Asset', src: FolderIcon, path: '/asset' },
    { title: 'Settings', src: SettingIcon, gap: true, path: '/settings' },
  ]

  return (
    <div className='flex flex-col h-screen overflow-hidden'>
      {/* Custom Title Bar */}
      <div className='titlebar flex items-center justify-between bg-dark-purple select-none shrink-0'
        style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}>
        <div className='flex items-center gap-2 pl-3'>
          <img src={LogoIcon} className='w-4 h-4' />
          <span className='text-white/70 text-xs font-medium tracking-wide'>Next-Life</span>
        </div>
        <div className='flex items-center h-full' style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
          {/* Minimize */}
          <button
            onClick={() => window.windowControls.minimize()}
            className='titlebar-btn group flex items-center justify-center w-11 h-8 hover:bg-white/10 transition-colors duration-150'
            aria-label='Minimize'>
            <svg width='12' height='12' viewBox='0 0 12 12'>
              <rect y='5' width='12' height='1.5' rx='0.75' fill='currentColor' className='text-white/60 group-hover:text-white transition-colors' />
            </svg>
          </button>
          {/* Maximize */}
          <button
            onClick={() => window.windowControls.maximize()}
            className='titlebar-btn group flex items-center justify-center w-11 h-8 hover:bg-white/10 transition-colors duration-150'
            aria-label='Maximize'>
            <svg width='12' height='12' viewBox='0 0 12 12'>
              <rect x='1' y='1' width='10' height='10' rx='2' stroke='currentColor' strokeWidth='1.5' fill='none' className='text-white/60 group-hover:text-white transition-colors' />
            </svg>
          </button>
          {/* Close */}
          <button
            onClick={() => window.windowControls.close()}
            className='titlebar-btn group flex items-center justify-center w-11 h-8 hover:bg-red-500 transition-colors duration-150'
            aria-label='Close'>
            <svg width='12' height='12' viewBox='0 0 12 12'>
              <path d='M1 1L11 11M11 1L1 11' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' className='text-white/60 group-hover:text-white transition-colors' />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className='flex flex-1 relative overflow-hidden'>
        {/* Mobile overlay */}
        {open && (
          <div
            className='fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden'
            onClick={() => setOpen(false)}
          />
        )}
        <div
          className={` ${
            open ? 'w-72' : 'w-0 md:w-20'
          } h-full fixed md:relative z-30 duration-300`}>
          <img
            src={ControlIcon}
            className={`absolute cursor-pointer -right-3 top-[4.5rem] w-7 border-dark-purple
             border-2 rounded-full z-50 ${!open && 'rotate-180'}`}
            onClick={() => setOpen(!open)}
          />
          <div className='bg-dark-purple h-full p-5 pt-8 overflow-hidden'>
            <div className='flex gap-x-4 items-center'>
              <img
                src={LogoIcon}
                className={`cursor-pointer duration-500 ${
                  open && 'rotate-[360deg]'
                }`}
              />
              <h1
                className={`text-white origin-left font-medium text-xl duration-200 ${
                  !open && 'scale-0'
                }`}>
                Next-Life
              </h1>
            </div>
            <ul className='pt-6'>
              {Menus.map((Menu, index) => (
                <div key={index}>
                  {Menu.gap && (
                    <hr className='border-gray-500/30 mt-5 mb-3 mx-1' />
                  )}
                  <li
                    onClick={() => history(Menu.path)}
                    className={`flex  rounded-md p-2 text-sm items-center gap-x-4 
                    mt-2 cursor-pointer hover:bg-light-white ${
                    location.pathname === Menu.path ? 'bg-light-white' : ''
                    } text-gray-300`}>
                    <img src={Menu.src} />
                    <span className={`${!open && 'hidden'} origin-left duration-200`}>
                      {Menu.title}
                    </span>
                  </li>
                </div>
              ))}
            </ul>
          </div>
        </div>
        <div
          className='flex-1 flex flex-col p-3 sm:p-5 md:p-7 overflow-hidden'>
          {/* Mobile menu button */}
          <button
            className='md:hidden mb-3 p-2 rounded-md bg-gray-200 hover:bg-gray-300 shrink-0'
            onClick={() => setOpen(!open)}>
            <svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
            </svg>
          </button>
          <div className='flex-1 min-h-0 overflow-auto scrollbar-hide'>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout
