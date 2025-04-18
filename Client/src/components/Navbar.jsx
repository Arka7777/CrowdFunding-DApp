import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Wallet, Home, TrendingUp, PlusCircle, FolderOpen } from 'lucide-react';
import { ethers } from 'ethers';

const Navbar = () => {
  const [address, setAddress] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Check for existing wallet connection on mount
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            setAddress(accounts[0].address);
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error);
        }
      }
    };

    checkWalletConnection();
  }, []);

  // Handle wallet connection
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setAddress(address);
      
      // Close mobile menu if open
      if (mobileMenuOpen) setMobileMenuOpen(false);
    } catch (error) {
      console.error("Wallet connection error:", error);
      alert("Failed to connect wallet. Please try again.");
    }
  };

  // Handle wallet disconnection
  const disconnectWallet = () => {
    setAddress('');
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const navLinks = [
    { label: 'Home', path: '/', icon: <Home className="w-4 h-4" /> },
    { label: 'Explore', path: '/explore', icon: <TrendingUp className="w-4 h-4" /> },
    { label: 'Create', path: '/create', icon: <PlusCircle className="w-4 h-4" /> },
    { label: 'My Campaigns', path: '/my-campaigns', icon: <FolderOpen className="w-4 h-4" /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="backdrop-blur-lg bg-white/80 shadow-sm sticky top-0 z-50 border-b border-blue-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text text-2xl font-bold tracking-tight group-hover:scale-105 transition-transform duration-300">
              Crowd<span className="text-gray-800">FundX</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'bg-blue-100/50 text-blue-700'
                      : 'text-gray-700 hover:bg-blue-50/50 hover:text-blue-600'
                  }`}
                >
                  {React.cloneElement(link.icon, { className: "w-5 h-5 mr-2" })}
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Wallet Connection */}
            {address ? (
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl shadow-xs border border-gray-100 hover:border-blue-100 transition-all">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-xs font-mono text-gray-700">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </span>
                <button
                  onClick={disconnectWallet}
                  className="p-1.5 rounded-md hover:bg-gray-50 text-gray-400 hover:text-red-500 transition-colors"
                  title="Disconnect"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:shadow-md hover:from-blue-600 hover:to-indigo-600 active:scale-95 transition-all text-sm"
              >
                <Wallet className="w-4 h-4" />
                <span>Connect Wallet</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-blue-50/50 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-sm shadow-lg border-t border-blue-100/50">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  onClick={toggleMenu}
                  className={`flex items-center px-3 py-3 rounded-lg text-base font-medium ${
                    isActive(link.path)
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-blue-50/50 hover:text-blue-600'
                  }`}
                >
                  {React.cloneElement(link.icon, { className: "w-5 h-5 mr-3" })}
                  {link.label}
                </Link>
              ))}
              
              <div className="pt-2 px-3 pb-3">
                {address ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-xs text-gray-500">Connected Wallet</span>
                      <button
                        onClick={disconnectWallet}
                        className="text-xs text-red-500 font-medium hover:text-red-700"
                      >
                        Disconnect
                      </button>
                    </div>
                    <div className="text-sm font-mono bg-blue-50 px-3 py-2 rounded-lg text-blue-800 break-all">
                      {address.slice(0, 6)}...{address.slice(-4)}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={connectWallet}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 hover:shadow-md text-sm"
                  >
                    <Wallet className="w-4 h-4" />
                    Connect Wallet
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;