import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'
import MyCampaigns from './components/MyCampaigns'
import CreateCampaign from './components/CreateCampaign'
import Home from './components/Home'

export default function App() {
  return (
    <>
     <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateCampaign />} />
        <Route path="/my-campaigns" element={<MyCampaigns/>} />
      </Routes>
    </div>
    </>
  )
}
