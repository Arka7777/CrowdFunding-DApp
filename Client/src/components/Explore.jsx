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
        
// problem caused here

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
    <div className="px-6 py-10 relative">
      <ToastContainer />
      <h1 className="text-4xl font-bold text-center text-indigo-700 mb-4">
        🌍 Explore Campaigns
      </h1>

      <section>
        {loading ? (
          <p className="text-gray-500 text-center">Loading campaigns...</p>
        ) : campaigns.length > 0 ? (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign, index) => {
              const collected = Number(formatEther(campaign.amountCollected));
              const target = Number(formatEther(campaign.target));
              const daysLeft = calculateDaysLeft(Number(campaign.deadline));
              const status = isActive(Number(campaign.deadline)) ? 'Active' : 'Inactive';
              const progress = getProgress(collected, target);
              const isCreator =
                connectedAddress.toLowerCase() === campaign.owner.toLowerCase();

              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-md overflow-hidden border hover:shadow-xl transition-all duration-300"
                >
                  <img
                    src={campaign.image || 'https://via.placeholder.com/400'}
                    alt={campaign.title}
                    className="w-full h-52 object-cover"
                  />
                  <div className="p-5 flex flex-col justify-between h-[270px]">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{campaign.title}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                        {campaign.description}
                      </p>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-white text-xs ${
                            status === 'Active' ? 'bg-green-500' : 'bg-red-500'
                          }`}
                        >
                          {status}
                        </span>
                        <span className="text-gray-500">{daysLeft} days left</span>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                        <div
                          className="bg-indigo-600 h-2.5 rounded-full"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>

                      <p className="text-sm text-gray-700">
                        <strong>Ξ {collected}</strong> raised of <strong>Ξ {target}</strong>
                      </p>
                    </div>

                    {!isCreator && (
                      <button
                        onClick={() => openModal(index)}
                        disabled={status !== 'Active'}
                        className={`mt-4 w-full py-2 px-4 rounded-xl font-semibold text-sm transition-all ${
                          status === 'Active'
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
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
        ) : (
          <p className="text-center text-gray-500">No campaigns available yet.</p>
        )}
      </section>

      {/* Modal with Blur Background */}
      {modalOpen && (
        <div className="fixed inset-0 backdrop-blur-md bg-transparent flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96 text-center space-y-4">
            <h2 className="text-xl font-semibold text-indigo-700">Enter Donation Amount</h2>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="ETH amount"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
            />
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDonate}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Send
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
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
