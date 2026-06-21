import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const BusinessContext = createContext();

export const BusinessProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [businesses, setBusinesses] = useState([]);
  const [activeBusiness, setActiveBusiness] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBusinesses = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      const response = await api.get('/usaha');
      if (response.data.success) {
        setBusinesses(response.data.data);
        
        // Restore from localStorage or pick first
        const savedBusinessId = localStorage.getItem('active_business_id');
        const found = response.data.data.find(b => b.id.toString() === savedBusinessId);
        
        if (found) {
          setActiveBusiness(found);
        } else if (response.data.data.length > 0) {
          const first = response.data.data[0];
          setActiveBusiness(first);
          localStorage.setItem('active_business_id', first.id.toString());
        }
      }
    } catch (error) {
      console.error('Failed to fetch businesses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBusinesses();
    } else {
      setBusinesses([]);
      setActiveBusiness(null);
      localStorage.removeItem('active_business_id');
    }
  }, [isAuthenticated]);

  const changeActiveBusiness = (business) => {
    setActiveBusiness(business);
    localStorage.setItem('active_business_id', business.id.toString());
  };

  return (
    <BusinessContext.Provider value={{ 
      businesses, 
      activeBusiness, 
      loading, 
      fetchBusinesses, 
      changeActiveBusiness 
    }}>
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusiness = () => useContext(BusinessContext);
