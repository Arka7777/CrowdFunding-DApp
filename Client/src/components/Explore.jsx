import React, { useEffect, useState, useMemo } from 'react';
import { useContract } from '../context/contractContext.jsx';
import { formatEther, BrowserProvider } from 'ethers';
import { parseEther } from 'ethers';
import { FiSearch, FiClock, FiDollarSign, FiAlertCircle } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Explore() {
  const { contract } = useContract();
  const [connectedAddress, setConnectedAddress] = useState('');
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [donationAmount, setDonationAmount] = useState('');
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewCampaign, setPreviewCampaign] = useState(null);

  const openPreviewModal = (campaign) => {
    setPreviewCampaign(campaign);
    setShowPreviewModal(true);
  };

  const closePreviewModal = () => {
    setShowPreviewModal(false);
    setPreviewCampaign(null);
  };

  // Get connected wallet address
  useEffect(() => {
    const getConnectedAddress = async () => {
      if (window.ethereum) {
        try {
          const provider = new BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          setConnectedAddress(address);
        } catch (error) {
          console.error("Error connecting wallet:", error);
          toast.error("Failed to connect wallet. Please make sure MetaMask is installed and unlocked.");
        }
      }
    };

    getConnectedAddress();
  }, []);

  // Fetch campaigns
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        if (contract) {
          const allCampaigns = await contract.getCampaigns();
          setCampaigns(allCampaigns);
        }
      } catch (error) {
        console.error('Failed to fetch campaigns:', error);
        toast.error('Failed to load campaigns. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [contract]);

  // Effect to handle body scroll lock
  useEffect(() => {
    if (showDonationModal) {
      // Prevent scrolling on the body when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable scrolling when modal is closed
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to ensure we re-enable scrolling if component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showDonationModal]);

  // Optimized search function using useMemo
  const filteredCampaigns = useMemo(() => {
    if (!searchTerm) return campaigns;
    
    const term = searchTerm.toLowerCase();
    return campaigns.filter(campaign => 
      campaign.title.toLowerCase().includes(term) || 
      campaign.description.toLowerCase().includes(term)
    );
  }, [campaigns, searchTerm]);

  const openDonationModal = (campaignId) => {
    setSelectedCampaignId(campaignId);
    setSelectedCampaign(campaigns[campaignId]);
    setShowDonationModal(true);
  };

  const closeDonationModal = () => {
    setShowDonationModal(false);
    setDonationAmount('');
    setSelectedCampaignId(null);
    setSelectedCampaign(null);
  };

  const handleDonationAmountChange = (e) => {
    const value = e.target.value;
    // Only allow numbers and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setDonationAmount(value);
    }
  };

  const handleDonate = async (campaignId) => {
    try {
      if (!donationAmount || isNaN(donationAmount) || Number(donationAmount) <= 0) {
        toast.error("Please enter a valid donation amount.");
        return;
      }
  
      const parsedAmount = parseEther(donationAmount);
  
      if (contract) {
        toast.info("Processing your donation...", { autoClose: false, toastId: "donation-processing" });
        
        const tx = await contract.donateCampaign(campaignId, {
          value: parsedAmount,
        });
  
        toast.update("donation-processing", { 
          render: "Transaction submitted. Waiting for confirmation...",
          autoClose: false
        });
        
        await tx.wait();
        
        toast.dismiss("donation-processing");
        toast.success(`You donated Ξ${donationAmount} successfully!`);
        
        closeDonationModal();
  
        // Refresh campaigns
        const updatedCampaigns = await contract.getCampaigns();
        setCampaigns(updatedCampaigns);
      }
    } catch (error) {
      console.error("Donation failed:", error);
      toast.dismiss("donation-processing");
      toast.error("Something went wrong while donating. Please try again.");
      closeDonationModal();
    }
  };

  const calculateDaysLeft = (deadline) => {
    const now = Math.floor(Date.now() / 1000);
    const diff = deadline - now;
    return diff > 0 ? Math.floor(diff / (60 * 60 * 24)) : 0;
  };

  const isActive = (deadline) => deadline > Math.floor(Date.now() / 1000);

  const getProgress = (collected, target) => {
    if (target === 0) return 0;
    return Math.min((collected / target) * 100, 100).toFixed(2);
  };

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Toast Container */}
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            Explore Campaigns
          </span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Support meaningful causes and make a difference through decentralized funding
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8 max-w-2xl mx-auto">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search campaigns by title or description..."
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
              <div className="animate-pulse bg-gray-200 h-60 w-full"></div>
              <div className="p-6 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
                <div className="h-2 bg-gray-200 rounded-full w-full"></div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-16 bg-gray-200 rounded-lg"></div>
                  <div className="h-16 bg-gray-200 rounded-lg"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredCampaigns.length > 0 ? (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCampaigns.map((campaign, index) => {
            const collected = Number(formatEther(campaign.amountCollected));
            const target = Number(formatEther(campaign.target));
            const daysLeft = calculateDaysLeft(Number(campaign.deadline));
            const status = isActive(Number(campaign.deadline)) ? 'Active' : 'Inactive';
            const progress = getProgress(collected, target);
            const isCreator = connectedAddress.toLowerCase() === campaign.owner.toLowerCase();

            return (
              <div
                key={index}
                className="group bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-lg hover:border-indigo-100 transition-all duration-300 ease-in-out transform hover:-translate-y-1 cursor-pointer"
                onClick={() => openPreviewModal(campaign)}
              >
                <div className="relative overflow-hidden h-60">
                  <img
                    src={campaign.image || 'https://images.unsplash.com/photo-1521791055366-0d553872125f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'}
                    alt={campaign.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {status}
                    </span>
                    <span className="inline-flex items-center text-xs text-white bg-black/50 px-2 py-1 rounded-full">
                      <FiClock className="mr-1" /> {daysLeft} days left
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col h-[calc(100%-15rem)]">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{campaign.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {campaign.description}
                    </p>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-500 mb-1">
                        <span>Progress ({progress}%)</span>
                        <span>{((collected / target) * 100).toFixed(2)}% funded</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-gray-50 p-3 rounded-lg flex items-center">
                        <FiDollarSign className="text-indigo-500 mr-2" />
                        <div>
                          <p className="text-gray-500 text-xs">Raised</p>
                          <p className="font-semibold text-gray-900">Ξ {collected.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg flex items-center">
                        <FiDollarSign className="text-indigo-500 mr-2" />
                        <div>
                          <p className="text-gray-500 text-xs">Target</p>
                          <p className="font-semibold text-gray-900">Ξ {target.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {!isCreator && (
                    <button
                      className={`mt-6 w-full py-3 px-4 rounded-lg font-medium text-sm transition-all flex items-center justify-center ${
                        status === 'Active'
                          ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 shadow-md hover:shadow-lg'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {status === 'Active' ? (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          View Campaign
                        </>
                      ) : (
                        <>
                          <FiAlertCircle className="mr-2" />
                          Campaign Ended
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="mx-auto flex justify-center mb-4">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            {searchTerm ? 'No matching campaigns found' : 'No campaigns available yet'}
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {searchTerm 
              ? 'Try adjusting your search query'
              : 'There are currently no active campaigns. Check back later or create your own.'}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {/* Donation Modal with improved backdrop */}
      {showDonationModal && (
        <>
          {/* Backdrop overlay with blur */}
          <div 
            className="fixed inset-0 z-50 bg-gray-900/30 backdrop-blur-sm transition-opacity"
            onClick={closeDonationModal}
            aria-hidden="true"
          ></div>
          
          {/* Modal container */}
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            {/* Modal content */}
            <div 
              className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-auto transform transition-all animate-fade-in-up"
              onClick={e => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              {/* Header with campaign info */}
              {selectedCampaign && (
                <div className="relative h-36 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-t-2xl overflow-hidden">
                  {selectedCampaign.image && (
                    <img
                      src={selectedCampaign.image || 'https://images.unsplash.com/photo-1521791055366-0d553872125f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'}
                      alt={selectedCampaign.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay"
                    />
                  )}
                  <button 
                    onClick={closeDonationModal}
                    className="absolute top-4 right-4 bg-white/20 rounded-full p-2 text-white hover:bg-white/30 transition-all"
                    aria-label="Close modal"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div className="absolute bottom-4 left-6 right-6">
                    <h3 className="text-xl font-bold text-white line-clamp-1" id="modal-headline">
                      {selectedCampaign.title}
                    </h3>
                    <p className="text-white/80 text-sm line-clamp-1">
                      Support this campaign with ETH
                    </p>
                  </div>
                </div>
              )}
              
              {/* Body content */}
              <div className="p-6">
                <div className="mb-6">
                  <label htmlFor="donationAmount" className="block text-sm font-medium text-gray-700 mb-2">
                    Donation Amount
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">Ξ</span>
                    </div>
                    <input
                      type="text"
                      name="donationAmount"
                      id="donationAmount"
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 py-3 sm:text-sm border-gray-300 rounded-lg"
                      placeholder="0.00"
                      value={donationAmount}
                      onChange={handleDonationAmountChange}
                      autoFocus
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">ETH</span>
                    </div>
                  </div>

                  {/* Quick amount buttons */}
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {['0.01', '0.05', '0.1'].map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        className="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={() => setDonationAmount(amount)}
                      >
                        Ξ {amount}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gas fee notice */}
                <div className="bg-gray-50 rounded-lg p-3 mb-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3 text-sm text-gray-500">
                      <p>You'll need to confirm this transaction in your wallet and pay gas fees.</p>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex justify-between space-x-4">
                  <button
                    type="button"
                    className="w-full py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={closeDonationModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="w-full py-3 px-4 rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => handleDonate(selectedCampaignId)}
                  >
                    Confirm Donation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Campaign Preview Modal */}
      {showPreviewModal && previewCampaign && (
        <>
          {/* Backdrop overlay with blur */}
          <div 
            className="fixed inset-0 z-50 bg-gray-900/30 backdrop-blur-sm transition-opacity"
            onClick={closePreviewModal}
            aria-hidden="true"
          ></div>
          
          {/* Modal container - note the max-w-3xl which makes it larger than the donation modal */}
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            {/* Modal content */}
            <div 
              className="bg-white rounded-2xl shadow-xl max-w-3xl w-full mx-auto transform transition-all animate-fade-in-up"
              onClick={e => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              {/* Header with larger image */}
              <div className="relative h-64 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-t-2xl overflow-hidden">
                <img
                  src={previewCampaign.image || 'https://images.unsplash.com/photo-1521791055366-0d553872125f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'}
                  alt={previewCampaign.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <button 
                  onClick={closePreviewModal}
                  className="absolute top-4 right-4 bg-white/20 rounded-full p-2 text-white hover:bg-white/30 transition-all"
                  aria-label="Close modal"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="absolute bottom-6 left-6 right-6">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {previewCampaign.title}
                  </h2>
                  <div className="flex space-x-4 items-center text-white">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      isActive(Number(previewCampaign.deadline)) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {isActive(Number(previewCampaign.deadline)) ? 'Active' : 'Inactive'}
                    </span>
                    <span className="inline-flex items-center text-xs text-white/80">
                      <FiClock className="mr-1" /> {calculateDaysLeft(Number(previewCampaign.deadline))} days left
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Body content */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">About this campaign</h3>
                    <p className="text-gray-600 mb-6">
                      {previewCampaign.description}
                    </p>
                    
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Campaign owner</h3>
                    <div className="flex items-center mb-6">
                      <div className="bg-gray-100 rounded-full p-2 mr-3">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="text-sm">
                        <p className="text-gray-900 font-medium">Owner</p>
                        <p className="text-gray-500 truncate">{previewCampaign.owner}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:col-span-1">
                    <div className="bg-gray-50 rounded-xl p-5">
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-500 mb-1">
                          <span>Progress</span>
                          <span>{getProgress(Number(formatEther(previewCampaign.amountCollected)), Number(formatEther(previewCampaign.target)))}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-indigo-500 to-blue-500 h-2 rounded-full"
                            style={{ width: `${getProgress(Number(formatEther(previewCampaign.amountCollected)), Number(formatEther(previewCampaign.target)))}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <p className="text-xs text-gray-500">Raised</p>
                          <p className="text-gray-900 font-semibold">
                            Ξ {Number(formatEther(previewCampaign.amountCollected)).toFixed(2)}
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <p className="text-xs text-gray-500">Target</p>
                          <p className="text-gray-900 font-semibold">
                            Ξ {Number(formatEther(previewCampaign.target)).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      
                      {connectedAddress.toLowerCase() !== previewCampaign.owner.toLowerCase() && isActive(Number(previewCampaign.deadline)) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            closePreviewModal();
                            openDonationModal(filteredCampaigns.findIndex(c => c.pId === previewCampaign.pId));
                          }}
                          className="w-full py-3 px-4 rounded-lg font-medium text-sm transition-all flex items-center justify-center bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 shadow-md hover:shadow-lg"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Donate Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Add some CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translate3d(0, 20px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}