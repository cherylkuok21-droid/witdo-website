
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';

const OwnerPortal: React.FC = () => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(false);

  // You can change this password here
  const SECRET_PASSWORD = 'witdo2026';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === SECRET_PASSWORD) {
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-linen-100 flex items-center justify-center px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white p-12 shadow-xl border border-linen-200 text-center space-y-8"
        >
          <div className="space-y-2">
            <h2 className="text-2xl serif italic text-linen-900">Owner Access</h2>
            <p className="text-[10px] uppercase tracking-[0.3em] text-linen-400">Restricted Area</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className="w-full bg-linen-50 border border-linen-200 px-4 py-3 text-center text-sm focus:outline-none focus:border-linen-900 transition-colors"
            />
            <button 
              type="submit"
              className="w-full bg-linen-900 text-linen-50 py-3 text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-linen-800 transition-all"
            >
              Verify Identity
            </button>
          </form>
          
          {error && (
            <p className="text-red-500 text-[9px] uppercase tracking-widest animate-pulse">Access Denied</p>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linen-50 p-8 md:p-16 space-y-16">
      <div className="flex justify-between items-end border-b border-linen-200 pb-8">
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-linen-400">Management Portal</span>
          <h1 className="text-4xl md:text-6xl serif italic text-linen-900">Welcome, Owner</h1>
        </div>
        <button 
          onClick={() => setIsAuthenticated(false)}
          className="text-[9px] font-bold uppercase tracking-[0.2em] text-linen-400 hover:text-linen-900 transition-colors"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 border border-linen-200 shadow-sm space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-linen-800">Quick Actions</h3>
          <div className="flex flex-col gap-3">
            <a href="https://www.instagram.com/witdo.macau/" target="_blank" className="text-sm serif italic text-linen-600 hover:text-linen-900">Check Instagram DMs</a>
            <button className="text-left text-sm serif italic text-linen-600 hover:text-linen-900">View Booking Calendar</button>
          </div>
        </div>
        
        <div className="bg-white p-8 border border-linen-200 shadow-sm space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-linen-800">Studio Status</h3>
          <p className="text-2xl serif italic text-linen-900">Open</p>
          <p className="text-[9px] text-linen-400 uppercase tracking-widest">Next Appointment: 2:00 PM</p>
        </div>

        <div className="bg-white p-8 border border-linen-200 shadow-sm space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-linen-800">System</h3>
          <p className="text-sm text-linen-600">All systems operational.</p>
          <p className="text-[9px] text-linen-400 uppercase tracking-widest">Last Update: Just now</p>
        </div>
      </div>

      <div className="bg-white p-12 border border-linen-200 shadow-sm">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-linen-900 mb-8">Owner Notes</h3>
        <textarea 
          className="w-full h-64 bg-linen-50/50 border border-linen-100 p-6 text-linen-800 serif italic focus:outline-none"
          placeholder="Write your private notes here..."
        ></textarea>
      </div>
    </div>
  );
};

export default OwnerPortal;
