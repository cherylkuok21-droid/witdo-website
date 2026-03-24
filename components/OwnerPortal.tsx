
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, db } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot, where, Timestamp, deleteDoc, doc } from 'firebase/firestore';
import WorkOrderForm from './WorkOrderForm';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';

const OwnerPortal: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState<any | null>(null);
  const [workOrders, setWorkOrders] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
      setError(null);
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error('Login error:', err);
      // Provide more descriptive error messages
      if (err.code === 'auth/unauthorized-domain') {
        setError(`Domain not authorized (${window.location.hostname}). Please add this URL to Firebase Console > Auth > Settings > Authorized Domains.`);
      } else if (err.code === 'auth/popup-blocked') {
        setError('Popup blocked by browser. Please allow popups for this site.');
      } else {
        setError(`Login failed: ${err.message || 'Please try again.'}`);
      }
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'workOrders', id));
      setDeletingId(null);
    } catch (err) {
      console.error('Error deleting order:', err);
      setError('Failed to delete order.');
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Witdo Studio - Work Orders', 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Exported on: ${new Date().toLocaleString()}`, 14, 30);

    const tableColumn = ["ID", "Date", "Customer", "WeChat", "Style", "Status"];
    const tableRows = workOrders.map(order => [
      order.workOrderId || 'N/A',
      order.orderDate?.toDate ? order.orderDate.toDate().toLocaleDateString() : 'N/A',
      order.customerName,
      order.wechatId || 'N/A',
      order.style || 'N/A',
      order.status
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      styles: { font: 'helvetica', fontSize: 9 },
      headStyles: { fillColor: [20, 20, 20] }
    });

    doc.save(`witdo-orders-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const exportToJPG = async () => {
    const element = document.getElementById('orders-table');
    if (!element) return;
    
    const canvas = await html2canvas(element);
    const dataUrl = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.download = `witdo-orders-${new Date().toISOString().split('T')[0]}.jpg`;
    link.href = dataUrl;
    link.click();
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="bg-white p-8 border border-linen-200 shadow-sm space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-linen-800">Quick Actions</h3>
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => {
                setEditingOrder(null);
                setShowForm(true);
              }}
              className="text-left text-sm serif italic text-linen-600 hover:text-linen-900"
            >
              + Create New Work Order
            </button>
            <a href="https://www.instagram.com/witdo.macau/" target="_blank" className="text-sm serif italic text-linen-600 hover:text-linen-900">Check Instagram DMs</a>
          </div>
        </div>

        <div className="bg-white p-8 border border-linen-200 shadow-sm space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-linen-800">Export Records</h3>
          <div className="flex flex-col gap-3">
            <button 
              onClick={exportToPDF}
              className="text-left text-sm serif italic text-linen-600 hover:text-linen-900"
            >
              ↓ Download PDF Report
            </button>
            <button 
              onClick={exportToJPG}
              className="text-left text-sm serif italic text-linen-600 hover:text-linen-900"
            >
              ↓ Save Table as Image
            </button>
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
              initialData={editingOrder}
              onSuccess={() => {
                setShowForm(false);
                setEditingOrder(null);
              }} 
              onCancel={() => {
                setShowForm(false);
                setEditingOrder(null);
              }} 
            />
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deletingId && (
          <div className="fixed inset-0 bg-linen-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-12 border border-linen-200 shadow-xl max-w-md w-full text-center space-y-8"
            >
              <div className="space-y-2">
                <h3 className="text-xl serif italic text-linen-900">Delete Order?</h3>
                <p className="text-[10px] uppercase tracking-widest text-linen-400">This action cannot be undone.</p>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setDeletingId(null)}
                  className="flex-1 border border-linen-200 py-3 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-linen-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleDelete(deletingId)}
                  className="flex-1 bg-red-600 text-white py-3 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-red-700 transition-all"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="bg-white p-12 border border-linen-200 shadow-sm">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-linen-900 mb-8">Recent Work Orders</h3>
        <div className="overflow-x-auto" id="orders-table">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-linen-100">
                <th className="py-4 text-[9px] uppercase tracking-widest text-linen-400">Order ID</th>
                <th className="py-4 text-[9px] uppercase tracking-widest text-linen-400">Date</th>
                <th className="py-4 text-[9px] uppercase tracking-widest text-linen-400">Customer</th>
                <th className="py-4 text-[9px] uppercase tracking-widest text-linen-400">WeChat</th>
                <th className="py-4 text-[9px] uppercase tracking-widest text-linen-400">Style</th>
                <th className="py-4 text-[9px] uppercase tracking-widest text-linen-400">Status</th>
                <th className="py-4 text-[9px] uppercase tracking-widest text-linen-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-linen-50">
              {workOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm serif italic text-linen-400">No work orders found.</td>
                </tr>
              ) : (
                workOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-linen-50/50 transition-colors group">
                    <td className="py-4 text-[10px] font-mono text-linen-500">{order.workOrderId}</td>
                    <td className="py-4 text-[10px] text-linen-600">
                      {order.orderDate?.toDate ? order.orderDate.toDate().toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-4 text-sm serif italic text-linen-900">{order.customerName}</td>
                    <td className="py-4 text-sm text-linen-600">{order.wechatId}</td>
                    <td className="py-4 text-sm text-linen-600">{order.style}</td>
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
                    <td className="py-4 text-right space-x-4">
                      <button 
                        onClick={() => {
                          setEditingOrder(order);
                          setShowForm(true);
                        }}
                        className="text-[9px] font-bold uppercase tracking-widest text-linen-400 hover:text-linen-900 transition-colors"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => setDeletingId(order.id)}
                        className="text-[9px] font-bold uppercase tracking-widest text-red-300 hover:text-red-600 transition-colors"
                      >
                        Delete
                      </button>
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
