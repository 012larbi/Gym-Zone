import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(null);
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsValid(false);
        return;
      }
      try {
        await axios.get('http://localhost:5000/api/admin/verify', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsValid(true);
      } catch (err) {
        localStorage.removeItem('adminToken');
        setIsValid(false);
      }
    };
    verifyToken();
  }, [token]);

  if (isValid === null) {
    return (
      <div className="min-h-screen bg-[#0e141a] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-[#00f0ff]" size={40} />
        <p className="font-manrope text-[#b9cacb] animate-pulse">Vérification de l'accès...</p>
      </div>
    );
  }

  if (!isValid) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
