import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Wallet, TrendingUp, PlusCircle, FolderOpen } from 'lucide-react';

const Navbar = () => {
  const [address, setAddress] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (window.ethereum && window.ethereum.selectedAddress) {
      setAddress(window.ethereum.selectedAddress);
    }
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAddress(accounts[0]);
      } catch (error) {
        console.error('Wallet connection failed:', error);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  const disconnectWallet = () => {
    setAddress('');
  };

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const navLinks = [
    { label: 'Explore', path: '/', icon: <TrendingUp className="w-4 h-4" /> },
    { label: 'Create', path: '/create', icon: <PlusCircle className="w-4 h-4" /> },
    { label: 'My Campaigns', path: '/my-campaigns', icon: <FolderOpen className="w-4 h-4" /> },
  ];

  return (
    <nav className="backdrop-blur-xl bg-gradient-to-r from-blue-50/90 to-indigo-50/90 shadow-lg sticky top-0 z-50 border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text text-3xl font-extrabold tracking-tight group-hover:scale-105 transition-transform duration-300">
              Crowd<span className="text-gray-800">FundX</span>
            </div>
            <div className="ml-1 w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-100/50 text-gray-700 font-medium hover:text-blue-700 transition duration-300"
              >
                {link.icon}
                {link.label}
              </Link>
            ))}

            {address ? (
              <div className="flex items-center gap-3 ml-4 bg-white/80 px-4 py-2 rounded-xl shadow-sm border border-blue-100">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Connected</span>
                  <span className="bg-blue-50 text-blue-800 text-sm font-mono px-3 py-1 rounded-md">
                    {address.slice(0, 6)}...{address.slice(-4)}
                  </span>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="ml-2 text-sm text-red-500 hover:text-red-700 font-medium"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="ml-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 hover:shadow-lg hover:shadow-blue-200 transition transform hover:-translate-y-1"
              >
                <Wallet className="w-4 h-4" />
                Connect Wallet
              </button>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="p-2 rounded-lg hover:bg-blue-100/50 text-gray-700"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 py-3 px-2 bg-white/90 rounded-xl shadow-lg border border-blue-50 divide-y divide-blue-100">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                onClick={toggleMenu}
                className="flex items-center gap-3 py-3 px-2 text-gray-700 font-medium hover:text-blue-600 transition"
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
            <div className="pt-3">
              {address ? (
                <div className="flex flex-col gap-2 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Wallet Connected</span>
                    <button
                      onClick={() => {
                        disconnectWallet();
                        toggleMenu();
                      }}
                      className="text-sm text-red-500 font-medium"
                    >
                      Disconnect
                    </button>
                  </div>
                  <span className="text-sm font-mono bg-blue-50 px-3 py-2 rounded-lg text-blue-800 break-all">
                    {address.slice(0, 6)}...{address.slice(-4)}
                  </span>
                </div>
              ) : (
                <button
                  onClick={() => {
                    connectWallet();
                    toggleMenu();
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 hover:shadow-md"
                >
                  <Wallet className="w-4 h-4" />
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;