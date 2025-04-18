import React, { useState } from 'react';
import { useContract } from '../context/contractContext.jsx';
import { parseEther } from 'ethers';
import fundingImage from '../assets/image.png';
import { toast, Toaster } from 'react-hot-toast';

const CreateCampaign = () => {
  const { contract } = useContract();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [target, setTarget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!title || !description || !target || !deadline || !image) {
        setError('All fields are required.');
        toast.error('All fields are required.');
        setLoading(false);
        return;
      }

      const targetInWei = parseEther(target);
      const deadlineInSeconds = parseInt(deadline) * 24 * 60 * 60;

      const [ownerAddress] = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      const createPromise = contract.createCampaign(
        ownerAddress,
        title,
        description,
        targetInWei,
        deadlineInSeconds,
        image
      ).then(tx => tx.wait());

      toast.promise(createPromise, {
        loading: 'Creating campaign...',
        success: 'Campaign created successfully!',
        error: 'Failed to create campaign',
      });

      await createPromise;
      
      // Reset form fields on success
      setTitle('');
      setDescription('');
      setTarget('');
      setDeadline('');
      setImage('');
      
    } catch (err) {
      console.error(err);
      setError('Failed to create campaign.');
      toast.error('Failed to create campaign.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <Toaster position="top-center" toastOptions={{ duration: 5000 }} />
      <div className="w-full max-w-6xl bg-gradient-to-br from-white to-blue-100 rounded-2xl shadow-xl flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Side Image with Animated Gradient Background */}
        <div className="md:w-1/2 relative overflow-hidden">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-white animate-gradient overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-transparent animate-gradient-slow opacity-70"></div>
            <div className="absolute inset-0 bg-gradient-to-bl from-blue-300 to-transparent animate-gradient-reverse opacity-60"></div>
          </div>
          
          {/* Image centered on the animated background */}
          <div className="relative z-10 p-6 flex items-center justify-center h-full">
            <img
              src={fundingImage}
              alt="Crowdfunding Illustration"
              className="w-full h-auto object-contain max-h-[450px]"
            />
          </div>
        </div>

        {/* Right Side Form */}
        <div className="md:w-1/2 p-6 md:p-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Launch a New Campaign 🚀
          </h2>

          {error && (
            <p className="text-red-600 text-center mb-4 font-medium">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Campaign Title
              </label>
              <input
                type="text"
                placeholder="E.g. Save the Rainforest"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Description
              </label>
              <textarea
                placeholder="Tell people what this campaign is about..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Target Amount (ETH)
                </label>
                <input
                  type="number"
                  placeholder="E.g. 2.5"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Deadline (in days)
                </label>
                <input
                  type="number"
                  placeholder="E.g. 30"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Image URL
              </label>
              <input
                type="text"
                placeholder="https://example.com/image.png"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 mt-4 text-lg font-semibold rounded-md text-white bg-blue-500 hover:bg-blue-600 transition duration-300 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Creating Campaign...' : 'Create Campaign'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Add these animations to your tailwind.config.js
// module.exports = {
//   theme: {
//     extend: {
//       animation: {
//         'gradient': 'gradient 8s ease infinite',
//         'gradient-slow': 'gradient 12s ease infinite',
//         'gradient-reverse': 'gradient-reverse 10s ease infinite',
//       },
//       keyframes: {
//         gradient: {
//           '0%, 100%': { backgroundPosition: '0% 50%' },
//           '50%': { backgroundPosition: '100% 50%' },
//         },
//         'gradient-reverse': {
//           '0%, 100%': { backgroundPosition: '100% 50%' },
//           '50%': { backgroundPosition: '0% 50%' },
//         },
//       },
//     },
//   },
//   plugins: [],
// }

export default CreateCampaign;