import { HashRouter as Router, Routes, Route } from 'react-router-dom'

import Layout from './Components/Layout'
import Dashboard from './Components/Dashboard'
import Investment from './Components/Investment'
import Networth from './Components/Networth'
import Goal from './Components/Goal'
import Business from './Components/Business'
import Trading from './Components/Trading'
import Asset from './Components/Asset'
import Settings from './Components/Settings'

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
            <Route path='trading' element={<Trading />} />
            <Route path='business' element={<Business />} />
            <Route path='asset' element={<Asset />} />
            <Route path='goal' element={<Goal />} />
            <Route path='settings' element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
