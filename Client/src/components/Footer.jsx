import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} CrowdFundX. All rights reserved.</p>
        <p className="text-sm">Built with ❤️ by the CrowdFundX Team</p>
      </div>
    </footer>
  );
};

export default Footer;