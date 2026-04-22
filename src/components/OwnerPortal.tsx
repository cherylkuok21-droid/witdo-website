
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, db } from '@/firebase';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot, where, deleteDoc, doc } from 'firebase/firestore';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';

import WorkOrderForm from './WorkOrderForm';
import ProductSettings from './ProductSettings';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const OwnerPortal: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState<any | null>(null);
  const [workOrders, setWorkOrders] = useState<any[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [printingOrder, setPrintingOrder] = useState<any | null>(null);

  const DEFAULT_FONTS = [
    { name: '名牌字型 1', imageUrl: 'https://lh3.googleusercontent.com/d/1ZSP4Y30AIIr3RM3-Y_AocKL9xfvYOimj' },
    { name: '名牌字型 2', imageUrl: 'https://lh3.googleusercontent.com/d/1USRIUHR_fNR_Pzbo1tToHOzClZkBgG7T' },
    { name: '名牌字型 3', imageUrl: 'https://lh3.googleusercontent.com/d/1a_ThiLXFprrJ-Ao3YAiDphWVf1Azuudc' },
    { name: '名牌字型 4', imageUrl: 'https://lh3.googleusercontent.com/d/16MTsK3i_HelpWQ3lQHbjx_Tzfrqj8Y1d' },
    { name: '名牌字型 5', imageUrl: 'https://lh3.googleusercontent.com/d/1Q6K70SC4JY-8yNFZ0n5IsS8QkoMLjaYC' },
    { name: '名牌字型 6', imageUrl: 'https://lh3.googleusercontent.com/d/1VwSh0SH4myrF1EGdts8kR1k4YJ2jY2M8' },
    { name: '名牌字型 7', imageUrl: 'https://lh3.googleusercontent.com/d/1g19O6VjEW_GxEUtfqVxT0jnejPSn2mbC' },
    { name: '名牌字型 8', imageUrl: 'https://lh3.googleusercontent.com/d/1gF2NQo3K8nY05Ii35o_0OjcTx7SfIE51' },
    { name: '名牌字型 9', imageUrl: 'https://lh3.googleusercontent.com/d/1r4NrMpCmhI6PTJOoL6CzImk3wu_xAAdn' }
  ];

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
        where('ownerUid', '==', user.uid)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const orders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as any[];
        
        // Sort client-side to avoid Index requirement errors
        orders.sort((a: any, b: any) => {
          const dateA = a.orderDate?.toDate ? a.orderDate.toDate().getTime() : 0;
          const dateB = b.orderDate?.toDate ? b.orderDate.toDate().getTime() : 0;
          return dateB - dateA;
        });

        setWorkOrders(orders);
      }, (err) => {
        handleFirestoreError(err, OperationType.LIST, 'workOrders');
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
      handleFirestoreError(err, OperationType.DELETE, 'workOrders');
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Witdo Studio - Work Orders', 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Exported on: ${new Date().toLocaleString()}`, 14, 30);

    const tableColumn = ["ID", "Date", "Customer", "WeChat", "Style", "Price", "Status"];
    const tableRows = workOrders.map(order => [
      order.workOrderId || 'N/A',
      order.orderDate?.toDate ? order.orderDate.toDate().toLocaleDateString() : 'N/A',
      order.customerName,
      order.wechatId || 'N/A',
      order.style || 'N/A',
      `MOP ${order.totalPrice || 0}`,
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

  const exportSingleOrderToPDF = (order: any) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(20, 20, 20);
    doc.text('造白美學館 - 訂單', 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text('Witdo Studio Work Order', 105, 26, { align: 'center' });

    // Order Info
    doc.setFontSize(12);
    doc.setTextColor(50);
    doc.text(`Order ID: ${order.workOrderId}`, 14, 40);
    doc.text(`Date: ${order.orderDate?.toDate ? order.orderDate.toDate().toLocaleDateString() : 'N/A'}`, 14, 48);

    // Customer Info Table
    autoTable(doc, {
      startY: 55,
      head: [['Customer Info', 'Details']],
      body: [
        ['Name (姓名)', order.customerName],
        ['WeChat (微信號)', order.wechatId],
        ['Est. Completion (預計完成日)', order.estimatedCompletionDate],
      ],
      theme: 'striped',
      headStyles: { fillColor: [40, 40, 40] }
    });

    const tableBody = [
      ['Style (款式)', order.style],
      ['Font (名牌字型)', order.nameplateFont || '-'],
      ['Content (名牌內容)', order.nameplateContent || '-'],
    ];

    if (order.couponCode) {
      tableBody.push(['Coupon (優惠碼)', order.couponCode]);
    }

    tableBody.push(['Total Price (總價)', `MOP ${order.totalPrice}`]);

    // Order Details Table
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [['Order Details', 'Value']],
      body: tableBody,
      theme: 'grid',
      headStyles: { fillColor: [40, 40, 40] }
    });

    // Signature
    let finalY = (doc as any).lastAutoTable.finalY + 10;
    
    // Remarks & Terms
    autoTable(doc, {
      startY: finalY,
      head: [['備註 (Remarks) & 條款及細則 (Terms & Conditions)']],
      body: [
        ['備註:\n1. 請把照片4:3 原圖 傳送到造白美學館之微信或電郵;\n2. 資料齊全後方可進行下一工序，其製作時間約 3 個月；\n3. 作品完成後，本館會立刻安排交收。'],
        ['條款及細則:\n1. 本訂單一經簽名確認，即表示客戶已閱讀、瞭解並同意接受本服務條款之所有內容；\n2. 基於客製化作品訂單的特性，訂單一經確認，即無法中途取消或變更製作內容；\n3. 客製化作品一律不接受退換，恕不退款；\n4. 如因原料有延長或縮短製作期，仍以實際情況為主，不便之處敬請見諒；\n5. 如作品有任何瑕疵，客戶必須在收貨後的7天內以文字形式通知造白美學館；\n6. 本司保留一切權利，可於任何時間及不時更改、增加、減少及／或修改本條款及細則，無需作出通知。']
      ],
      styles: { fontSize: 8, cellPadding: 2 },
      theme: 'plain'
    });

    finalY = (doc as any).lastAutoTable.finalY + 15;

    if (order.signatureData) {
      doc.text('Client Signature:', 14, finalY);
      doc.addImage(order.signatureData, 'PNG', 14, finalY + 5, 50, 20);
      doc.setFontSize(8);
      doc.text(`Signed at: ${order.signatureTime}`, 14, finalY + 30);
    }

    doc.save(`Order-${order.workOrderId}.pdf`);
  };

  const exportSingleOrderToJPG = async (order: any) => {
    setPrintingOrder(order);
    // Wait longer for images to load
    setTimeout(async () => {
      const element = document.getElementById('printable-order');
      if (!element) return;
      const canvas = await html2canvas(element, { 
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        allowTaint: true
      });
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      const link = document.createElement('a');
      link.download = `Order-${order.workOrderId}.jpg`;
      link.href = dataUrl;
      link.click();
      setPrintingOrder(null);
    }, 1500);
  };

  const printOrder = (order: any) => {
    setPrintingOrder(order);
    setTimeout(() => {
      window.print();
      setPrintingOrder(null);
    }, 500);
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
            <button 
              onClick={() => setShowSettings(true)}
              className="text-left text-sm serif italic text-linen-600 hover:text-linen-900"
            >
              ⚙ Product & Option Settings
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
        {showSettings && (
          <div className="fixed inset-0 bg-linen-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <ProductSettings onClose={() => setShowSettings(false)} />
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 bg-linen-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-2 md:p-6">
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
                <th className="py-4 text-[9px] uppercase tracking-widest text-linen-400">Price</th>
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
                    <td className="py-4 text-sm font-bold text-linen-900">MOP {order.totalPrice}</td>
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
                    <td className="py-4 text-right space-x-3">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => exportSingleOrderToPDF(order)}
                          className="p-1.5 hover:bg-linen-100 rounded-full transition-colors group/btn"
                          title="Export PDF"
                        >
                          <svg className="w-4 h-4 text-linen-400 group-hover/btn:text-linen-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => exportSingleOrderToJPG(order)}
                          className="p-1.5 hover:bg-linen-100 rounded-full transition-colors group/btn"
                          title="Export JPG"
                        >
                          <svg className="w-4 h-4 text-linen-400 group-hover/btn:text-linen-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => printOrder(order)}
                          className="p-1.5 hover:bg-linen-100 rounded-full transition-colors group/btn"
                          title="Print"
                        >
                          <svg className="w-4 h-4 text-linen-400 group-hover/btn:text-linen-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => {
                            setEditingOrder(order);
                            setShowForm(true);
                          }}
                          className="p-1.5 hover:bg-linen-100 rounded-full transition-colors group/btn"
                          title="Edit"
                        >
                          <svg className="w-4 h-4 text-linen-400 group-hover/btn:text-linen-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => setDeletingId(order.id)}
                          className="p-1.5 hover:bg-red-50 rounded-full transition-colors group/btn"
                          title="Delete"
                        >
                          <svg className="w-4 h-4 text-red-300 group-hover/btn:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hidden Printable Order */}
      {printingOrder && (
        <div className="fixed left-[-9999px] top-0">
          <div id="printable-order" className="w-[1080px] h-[1920px] bg-white p-20 text-neutral-800 font-sans flex flex-col">
            {/* Header with Minimalist Logo */}
            <div className="flex justify-between items-center mb-16">
              <div className="flex items-center gap-6">
                <img 
                  src="https://lh3.googleusercontent.com/d/1B1FyUmmR92prZmcurZrLoEuxwe1r0HfN" 
                  alt="Witdo Studio Logo" 
                  className="h-24 w-24 object-contain"
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                />
                <div>
                  <h2 className="text-4xl serif italic font-bold tracking-tight">造白美學館</h2>
                  <p className="text-lg uppercase tracking-[0.4em] text-neutral-400">Witdo Studio</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-2">Receipt No.</p>
                <p className="text-3xl font-mono font-medium">#{printingOrder.workOrderId}</p>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 space-y-20">
              {/* Date & Status */}
              <div className="flex justify-between border-b-2 border-neutral-100 pb-10">
                <div>
                  <label className="text-sm font-bold uppercase tracking-widest text-neutral-400 block mb-3">Order Date</label>
                  <p className="text-2xl">{printingOrder.orderDate?.toDate ? printingOrder.orderDate.toDate().toLocaleDateString() : new Date().toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <label className="text-sm font-bold uppercase tracking-widest text-neutral-400 block mb-3">Status</label>
                  <p className="text-2xl font-bold text-neutral-900">{printingOrder.status?.toUpperCase() || 'PENDING'}</p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="space-y-8">
                <h3 className="text-sm font-bold uppercase tracking-[0.4em] text-neutral-300">Customer Details</h3>
                <div className="grid grid-cols-2 gap-16">
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-widest text-neutral-400">Client Name</label>
                    <p className="text-3xl border-b-2 border-neutral-50 pb-3">{printingOrder.customerName}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-widest text-neutral-400">WeChat ID</label>
                    <p className="text-3xl border-b-2 border-neutral-50 pb-3">{printingOrder.wechatId}</p>
                  </div>
                </div>
              </div>

              {/* Order Info */}
              <div className="space-y-10">
                <h3 className="text-sm font-bold uppercase tracking-[0.4em] text-neutral-300">Product Selection</h3>
                <div className="bg-neutral-50 p-12 rounded-3xl space-y-12">
                   <div className="space-y-3">
                    <label className="text-sm font-bold uppercase tracking-widest text-neutral-400">Style</label>
                    <p className="text-5xl font-bold leading-tight">{printingOrder.style}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-16">
                    <div className="space-y-6">
                      <label className="text-sm font-bold uppercase tracking-widest text-neutral-400">Font Style Image</label>
                      {printingOrder.nameplateFont && DEFAULT_FONTS.find(f => f.name === printingOrder.nameplateFont) ? (
                        <div className="bg-white p-6 border-2 border-neutral-100 inline-block shadow-sm">
                          <img 
                            src={DEFAULT_FONTS.find(f => f.name === printingOrder.nameplateFont)?.imageUrl} 
                            alt="Font style" 
                            className="h-32 object-contain"
                            referrerPolicy="no-referrer"
                            crossOrigin="anonymous"
                          />
                          <p className="text-xs text-neutral-400 text-center mt-3 font-bold uppercase tracking-widest">{printingOrder.nameplateFont}</p>
                        </div>
                      ) : (
                        <p className="text-lg italic text-neutral-400">No font style selected</p>
                      )}
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-bold uppercase tracking-widest text-neutral-400">Engraving Content</label>
                      <p className="text-3xl italic serif border-l-4 border-neutral-200 pl-6 py-2">{printingOrder.nameplateContent || '-'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price & Coupon */}
              <div className="flex justify-between items-end pt-12 pb-12 border-b-2 border-neutral-100">
                <div className="space-y-6">
                   <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-widest text-neutral-400">Estimated Delivery</label>
                    <p className="text-3xl font-medium">{printingOrder.estimatedCompletionDate}</p>
                  </div>
                  {printingOrder.couponCode && (
                    <div className="inline-flex items-center gap-3 bg-neutral-900 text-white px-5 py-2 rounded-full">
                      <span className="text-xs font-bold tracking-widest uppercase">Discount Applied</span>
                      <span className="text-xs font-mono">{printingOrder.couponCode}</span>
                    </div>
                  )}
                </div>
                <div className="text-right space-y-2">
                  <label className="text-sm font-bold uppercase tracking-widest text-neutral-400">Total Investment</label>
                  <p className="text-8xl font-bold tracking-tighter">MOP {printingOrder.totalPrice}</p>
                </div>
              </div>

              {/* Enhanced Remarks & Terms */}
              <div className="grid grid-cols-2 gap-16 pt-12">
                <div className="space-y-6">
                  <h4 className="text-base font-bold uppercase tracking-widest text-neutral-800 border-b border-neutral-100 pb-2">備註 (Remarks)</h4>
                  <ul className="text-sm text-neutral-600 space-y-4 list-disc pl-6 leading-relaxed">
                    <li>請把照片4:3 原圖 傳送到造白美學館之微信或電郵;</li>
                    <li>資料齊全後方可進行下一工序，其製作時間約 3 個月；</li>
                    <li>作品完成後，本館會立刻安排交收。</li>
                  </ul>
                </div>
                <div className="space-y-6">
                  <h4 className="text-base font-bold uppercase tracking-widest text-neutral-800 border-b border-neutral-100 pb-2">條款及細則 (Terms & Conditions)</h4>
                  <div className="text-[13px] text-neutral-500 leading-relaxed space-y-3">
                    <p>1. 本訂單一經簽名確認，即表示客戶已閱讀並同意本服務條款；</p>
                    <p>2. 基於客製化作品特性，訂單一經確認，無法取消或變更製作內容；</p>
                    <p>3. 客製化作品一律不接受退換，恕不退款；</p>
                    <p>4. 製作期仍以實際情況為主；</p>
                    <p>5. 如有任何瑕疵，客戶必須在收貨後7天內以文字形式通知本館；</p>
                    <p>6. 本司保留對條款及細則之最終解釋權。</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Signature Area */}
            <div className="pt-24 mt-auto border-t-2 border-neutral-100 flex justify-between items-end">
              <div className="space-y-10">
                <div className="space-y-6">
                  <p className="text-sm font-bold uppercase tracking-widest text-neutral-400">Client Authorization</p>
                  {printingOrder.signatureData ? (
                    <div className="relative">
                      <img src={printingOrder.signatureData} alt="Signature" className="h-40 object-contain mix-blend-multiply" />
                      <p className="text-xs text-neutral-300 mt-4 uppercase tracking-widest">Authenticated: {printingOrder.signatureTime}</p>
                    </div>
                  ) : (
                    <div className="h-40 w-[400px] border-b-2 border-neutral-50"></div>
                  )}
                </div>
              </div>
              <div className="text-right pb-6">
                <div className="space-y-2">
                  <p className="text-3xl serif italic font-bold">造白美學館</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">Official Certification</p>
                </div>
                <div className="mt-10 flex justify-end">
                   <div className="h-32 w-32 rounded-full border-4 border-neutral-50 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 border-4 border-neutral-100 rounded-full scale-90 border-dashed opacity-50"></div>
                      <span className="text-xs text-neutral-200 uppercase text-center font-bold tracking-tighter leading-none">Witdo<br/>Studio<br/>Macau</span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-order, #printable-order * {
            visibility: visible;
          }
          #printable-order {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none;
            padding: 0;
          }
        }
      `}} />
    </div>
  );
};

export default OwnerPortal;
