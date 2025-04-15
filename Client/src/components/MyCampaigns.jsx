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
    <div className="px-6 py-10">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
        🎯 My Campaigns
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading your campaigns...</p>
      ) : myCampaigns.length === 0 ? (
        <p className="text-center text-gray-500">You haven't created any campaigns yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {myCampaigns.map((campaign, index) => {
            const collected = Number(formatEther(campaign.amountCollected));
            const target = Number(formatEther(campaign.target));
            const daysLeft = calculateDaysLeft(Number(campaign.deadline));
            const status = isActive(Number(campaign.deadline)) ? 'Active' : 'Inactive';
            const progress = getProgress(collected, target);

            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md border hover:shadow-xl transition-all"
              >
                <img
                  src={campaign.image}
                  alt={campaign.title}
                  className="w-full h-52 object-cover rounded-t-xl"
                />
                <div className="p-5">
                  <h2 className="text-xl font-semibold text-gray-800">{campaign.title}</h2>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{campaign.description}</p>

                  <div className="mt-3 flex justify-between text-sm">
                    <span
                      className={`px-2 py-0.5 rounded-full text-white text-xs ${
                        status === 'Active' ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    >
                      {status}
                    </span>
                    <span className="text-gray-500">{daysLeft} days left</span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2 mt-3 mb-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>

                  <p className="text-sm text-gray-700">
                    Raised <strong>Ξ {collected}</strong> of <strong>Ξ {target}</strong>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
