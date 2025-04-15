import React, { useState } from 'react';
import { useContract } from '../context/contractContext.jsx';
import { parseEther } from 'ethers';

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
        setLoading(false);
        return;
      }
  
      const targetInWei = parseEther(target);
      const deadlineInSeconds = parseInt(deadline) * 24 * 60 * 60;
  
      // ✅ Get current connected address from MetaMask
      const [ownerAddress] = await window.ethereum.request({ method: 'eth_requestAccounts' });
  
      const tx = await contract.createCampaign(
        ownerAddress,
        title,
        description,
        targetInWei,
        deadlineInSeconds,
        image
      );
  
      await tx.wait();
      alert('Campaign created successfully!');
    } catch (err) {
      console.error(err);
      setError('Failed to create campaign.');
    }
  
    setLoading(false);
  };
  

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Create a Campaign</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Campaign Title"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Campaign Description"
              rows="4"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Target (ETH)</label>
            <input
              type="number"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="Target in ETH"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Deadline (in days)</label>
            <input
              type="number"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              placeholder="Deadline in Days"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Image URL</label>
            <input
              type="text"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="Image URL"
            />
          </div>
          <button
            type="submit"
            className={`w-full p-3 bg-blue-500 text-white rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Campaign'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCampaign;
