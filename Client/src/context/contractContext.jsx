import React, { createContext, useContext, useEffect, useState } from 'react';
import { BrowserProvider, Contract } from 'ethers';
import contractABI from '../abi/contractABI.json';

const ContractContext = createContext();

export const ContractProvider = ({ children }) => {
  const [contract, setContract] = useState(null);
  const [address, setAddress] = useState(null);
  const [provider, setProvider] = useState(null);

  const contractAddress = '0xad8112a1703a6e269ed4e3100ee62e48c4972aaf';

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const ethProvider = new BrowserProvider(window.ethereum);
        setProvider(ethProvider);

        const signer = await ethProvider.getSigner();
        const userAddress = await signer.getAddress();
        setAddress(userAddress);

        const instance = new Contract(contractAddress, contractABI, signer);
        setContract(instance);
      } else {
        console.error('MetaMask not detected');
      }
    };

    init();
  }, []);

  return (
    <ContractContext.Provider value={{ contract, address, provider }}>
      {children}
    </ContractContext.Provider>
  );
};

export const useContract = () => useContext(ContractContext);
