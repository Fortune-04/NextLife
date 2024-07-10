import { useState } from 'react'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'

const Layout = () => {
  const history = useNavigate()
  const location = useLocation()

  const [open, setOpen] = useState(true)
  const Menus = [
    { title: 'Dashboard', src: 'Chart_fill', path: '/' },
    { title: 'Investment', src: 'User', path: 'investment' },
    { title: 'Trading', src: 'Folder', path: 'trading' },
    { title: 'Business', src: 'Chart', path: 'business' },
    { title: 'Networth', src: 'Chat', path: 'networth' },
    { title: 'Goal', src: 'Calendar', gap: true, path: 'goal' },
    { title: 'Skill', src: 'Search', path: 'skill' },
    { title: 'Settings', src: 'Setting', gap: true, path: '#' },
  ]

  return (
    <div className='flex'>
      <div
        className={` ${
          open ? 'w-72' : 'w-20 '
        } bg-dark-purple h-screen p-5  pt-8 relative duration-300`}>
        <img
          src='./src/assets/control.png'
          className={`absolute cursor-pointer -right-3 top-9 w-7 border-dark-purple
           border-2 rounded-full  ${!open && 'rotate-180'}`}
          onClick={() => setOpen(!open)}
        />
        <div className='flex gap-x-4 items-center'>
          <img
            src='./src/assets/logo.png'
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
            <li
              key={index}
              onClick={() => history(Menu.path)}
              className={`flex  rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 
              ${Menu.gap ? 'mt-9' : 'mt-2'} ${
                index === 0 && 'bg-light-white'
              } `}>
              <img src={`./src/assets/${Menu.src}.png`} />
              <span className={`${!open && 'hidden'} origin-left duration-200`}>
                {Menu.title}
              </span>
              {/* <div className='w-full'>
                <hr className='border-t border-gray-300' />
              </div> */}
            </li>
          ))}
        </ul>
      </div>
      <div className='h-screen flex-1 p-7'>
        {/* <h1 className="text-2xl font-semibold ">Home Page</h1> */}
        <Outlet />
      </div>
    </div>
  )
}

export default Layout
