import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'
import MyCampaigns from './components/MyCampaigns'
import CreateCampaign from './components/CreateCampaign'
import Explore from './components/Explore'
import Home from './components/Home';
import Footer from './components/Footer';

export default function App() {
  return (
    <>
     <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/create" element={<CreateCampaign />} />
        <Route path="/my-campaigns" element={<MyCampaigns/>} />
      </Routes>
      <Footer />
    </div>
    </>
  );
}
