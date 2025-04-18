import React, { useEffect, useState } from 'react';
import { useContract } from '../context/contractContext.jsx';
import { formatEther, BrowserProvider, parseEther } from 'ethers';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Explore() {
  const { contract } = useContract();
  const [owner, setOwner] = useState('');
  const [connectedAddress, setConnectedAddress] = useState('');
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [donationAmount, setDonationAmount] = useState('');

  useEffect(() => {
    const fetchOwner = async () => {
      try {
        if (contract) {
          const ownerAddress = await contract.getOwner();
          setOwner(ownerAddress);
        }
      } catch (error) {
        console.error('Failed to fetch contract owner:', error);
      }
    };

    fetchOwner();
  }, [contract]);

  useEffect(() => {
    const getConnectedAddress = async () => {
      if (window.ethereum) {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setConnectedAddress(address);
      }
    };

    getConnectedAddress();
  }, []);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        if (contract) {
          const allCampaigns = await contract.getCampaigns();
          setCampaigns(allCampaigns);
        }
      } catch (error) {
        console.error('Failed to fetch campaigns:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [contract]);

  const openModal = (campaignId) => {
    setSelectedCampaignId(campaignId);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setDonationAmount('');
  };

  const handleDonate = async () => {
    try {
      if (!donationAmount || isNaN(donationAmount) || Number(donationAmount) <= 0) {
        toast.warning('Please enter a valid donation amount.');
        return;
      }

      const parsedAmount = parseEther(donationAmount);

      if (contract) {
        const tx = await contract.donateCampaign(selectedCampaignId, {
          value: parsedAmount,
        });
        
        await tx.wait();

        toast.success(`✅ You donated Ξ${donationAmount} successfully!`);

        const updatedCampaigns = await contract.getCampaigns();
        setCampaigns(updatedCampaigns);
        closeModal();
      }
    } catch (error) {
      console.error('❌ Donation failed:', error);
      toast.error('Something went wrong while donating.');
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
      <ToastContainer />
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            Explore Campaigns
          </span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover and support inspiring fundraising campaigns
        </p>
      </div>

      {loading ? (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
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
              </div>
            </div>
          ))}
        </div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-16">
          <div className="mx-auto flex justify-center mb-4">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No campaigns available yet</h3>
          <p className="text-gray-500 max-w-md mx-auto">There are no active fundraising campaigns at the moment.</p>
        </div>
      ) : (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign, index) => {
            const collected = Number(formatEther(campaign.amountCollected));
            const target = Number(formatEther(campaign.target));
            const daysLeft = calculateDaysLeft(Number(campaign.deadline));
            const status = isActive(Number(campaign.deadline)) ? 'Active' : 'Inactive';
            const progress = getProgress(collected, target);
            const isCreator = connectedAddress.toLowerCase() === campaign.owner.toLowerCase();

            return (
              <div
                key={index}
                className="group bg-gradient-to-br from-white to-blue-100 rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-lg hover:border-indigo-100 transition-all duration-300 ease-in-out transform hover:-translate-y-1"
              >
                <div className="relative overflow-hidden h-60">
                  <img
                    src={campaign.image || 'https://images.unsplash.com/photo-1521791055366-0d553872125f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'}
                    alt={campaign.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {status}
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
                        <span>{daysLeft} days left</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <p className="text-gray-500">Raised</p>
                        <p className="font-semibold text-gray-900">Ξ {collected.toFixed(4)}</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <p className="text-gray-500">Target</p>
                        <p className="font-semibold text-gray-900">Ξ {target.toFixed(4)}</p>
                      </div>
                    </div>
                  </div>

                  {!isCreator && (
                    <button
                      onClick={() => openModal(index)}
                      disabled={status !== 'Active'}
                      className={`mt-4 w-full py-2 px-4 rounded-xl font-semibold text-sm transition-all ${
                        status === 'Active'
                          ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:shadow-md'
                          : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      }`}
                    >
                      {status === 'Active' ? 'Donate Now' : 'Campaign Ended'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal with Blur Background */}
      {modalOpen && (
        <div className="fixed inset-0 backdrop-blur-md bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-96 text-center space-y-6 border border-indigo-100">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Enter Donation Amount
            </h2>
            <input
              type="number"
              min="0"
              step="0.0001"
              placeholder="ETH amount"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
            />
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDonate}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:shadow-md transition"
              >
                Send Donation
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-100 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-200 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
