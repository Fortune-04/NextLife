import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Layout from './Components/Layout'
import Dashboard from './Components/Dashboard'
import Investment from './Components/Investment'
import Networth from './Components/Networth'
import Skill from './Components/Skill'
import Goal from './Components/Goal'
import Business from './Components/Business'

import './App.css'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path='networth' element={<Networth />} />
            <Route path='investment' element={<Investment />} />
            <Route path='business' element={<Business />} />
            <Route path='goal' element={<Goal />} />
            <Route path='skill' element={<Skill />} />
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
