import React, { useEffect, useState } from 'react';
import { useContract } from '../context/contractContext.jsx';
import { ethers, formatEther } from 'ethers';

export default function MyCampaigns() {
  const { contract } = useContract();
  const [myCampaigns, setMyCampaigns] = useState([]);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);

  // Get connected wallet address
  useEffect(() => {
    const getWalletAddress = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();
        setAddress(userAddress);
      } else {
        console.error('Please install MetaMask!');
      }
    };

    getWalletAddress();
  }, []);

  // Fetch user's campaigns
  useEffect(() => {
    const fetchCampaigns = async () => {
      if (!contract || !address) return;

      try {
        const allCampaigns = await contract.getCampaigns();
        const filtered = allCampaigns.filter(
          (c) => c.owner.toLowerCase() === address.toLowerCase()
        );
        setMyCampaigns(filtered);
      } catch (err) {
        console.error('Error fetching campaigns:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [contract, address]);

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
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            My Campaigns
          </span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Manage and track the campaigns you've created
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
      ) : myCampaigns.length === 0 ? (
        <div className="text-center py-16">
          <div className="mx-auto flex justify-center mb-4">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No campaigns created yet</h3>
          <p className="text-gray-500 max-w-md mx-auto">You haven't launched any campaigns. Start your first fundraising campaign today!</p>
        </div>
      ) : (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {myCampaigns.map((campaign, index) => {
            const collected = Number(formatEther(campaign.amountCollected));
            const target = Number(formatEther(campaign.target));
            const daysLeft = calculateDaysLeft(Number(campaign.deadline));
            const status = isActive(Number(campaign.deadline)) ? 'Active' : 'Inactive';
            const progress = getProgress(collected, target);

            return (
              <div
                key={index}
                className="group bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-lg hover:border-indigo-100 transition-all duration-300 ease-in-out transform hover:-translate-y-1"
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
                        <p className="font-semibold text-gray-900">Ξ {collected.toFixed(2)}</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <p className="text-gray-500">Target</p>
                        <p className="font-semibold text-gray-900">Ξ {target.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}