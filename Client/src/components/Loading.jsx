import React from 'react';
import { useLoading } from '../context/loadingContext';

const Loading = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
    </div>
  );
};

export default Loading;