
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, db } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot, where, Timestamp } from 'firebase/firestore';
import WorkOrderForm from './WorkOrderForm';

const OwnerPortal: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [workOrders, setWorkOrders] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const OWNER_EMAIL = 'mo.witdo@gmail.com';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.email === OWNER_EMAIL) {
        setUser(currentUser);
      } else {
        setUser(null);
        if (currentUser) {
          setError('Unauthorized access. Only the owner can enter.');
          signOut(auth);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const q = query(
        collection(db, 'workOrders'),
        where('ownerUid', '==', user.uid),
        orderBy('orderDate', 'desc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const orders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setWorkOrders(orders);
      }, (err) => {
        console.error('Error fetching work orders:', err);
      });

      return () => unsubscribe();
    }
  }, [user]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error('Login error:', err);
      setError('Failed to login. Please try again.');
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linen-100 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-linen-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
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
          
          <div className="space-y-6">
            <button 
              onClick={handleLogin}
              className="w-full bg-linen-900 text-linen-50 py-3 text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-linen-800 transition-all flex items-center justify-center gap-3"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign in with Google
            </button>
            <p className="text-[9px] text-linen-400 uppercase tracking-widest">Authorized Personnel Only</p>
          </div>
          
          {error && (
            <p className="text-red-500 text-[9px] uppercase tracking-widest animate-pulse">{error}</p>
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
          <h1 className="text-4xl md:text-6xl serif italic text-linen-900">Welcome, {user.displayName?.split(' ')[0]}</h1>
        </div>
        <button 
          onClick={handleLogout}
          className="text-[9px] font-bold uppercase tracking-[0.2em] text-linen-400 hover:text-linen-900 transition-colors"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 border border-linen-200 shadow-sm space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-linen-800">Quick Actions</h3>
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => setShowForm(true)}
              className="text-left text-sm serif italic text-linen-600 hover:text-linen-900"
            >
              + Create New Work Order
            </button>
            <a href="https://www.instagram.com/witdo.macau/" target="_blank" className="text-sm serif italic text-linen-600 hover:text-linen-900">Check Instagram DMs</a>
          </div>
        </div>
        
        <div className="bg-white p-8 border border-linen-200 shadow-sm space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-linen-800">Order Stats</h3>
          <p className="text-2xl serif italic text-linen-900">{workOrders.length} Total Orders</p>
          <p className="text-[9px] text-linen-400 uppercase tracking-widest">
            {workOrders.filter(o => o.status === 'pending').length} Pending
          </p>
        </div>

        <div className="bg-white p-8 border border-linen-200 shadow-sm space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-linen-800">System</h3>
          <p className="text-sm text-linen-600">Database Connected.</p>
          <p className="text-[9px] text-linen-400 uppercase tracking-widest">Last Sync: Just now</p>
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 bg-linen-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <WorkOrderForm 
              onSuccess={() => setShowForm(false)} 
              onCancel={() => setShowForm(false)} 
            />
          </div>
        )}
      </AnimatePresence>

      <div className="bg-white p-12 border border-linen-200 shadow-sm">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-linen-900 mb-8">Recent Work Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-linen-100">
                <th className="py-4 text-[9px] uppercase tracking-widest text-linen-400">Date</th>
                <th className="py-4 text-[9px] uppercase tracking-widest text-linen-400">Customer</th>
                <th className="py-4 text-[9px] uppercase tracking-widest text-linen-400">Baby</th>
                <th className="py-4 text-[9px] uppercase tracking-widest text-linen-400">Type</th>
                <th className="py-4 text-[9px] uppercase tracking-widest text-linen-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-linen-50">
              {workOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-sm serif italic text-linen-400">No work orders found.</td>
                </tr>
              ) : (
                workOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-linen-50/50 transition-colors">
                    <td className="py-4 text-[10px] text-linen-600">
                      {order.orderDate?.toDate ? order.orderDate.toDate().toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-4 text-sm serif italic text-linen-900">{order.customerName}</td>
                    <td className="py-4 text-sm text-linen-600">{order.babyName}</td>
                    <td className="py-4 text-[10px] uppercase tracking-widest text-linen-500">{order.castingType}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 text-[9px] uppercase tracking-widest rounded-full ${
                        order.status === 'pending' ? 'bg-yellow-50 text-yellow-700' :
                        order.status === 'in-progress' ? 'bg-blue-50 text-blue-700' :
                        order.status === 'completed' ? 'bg-green-50 text-green-700' :
                        'bg-linen-100 text-linen-600'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OwnerPortal;
