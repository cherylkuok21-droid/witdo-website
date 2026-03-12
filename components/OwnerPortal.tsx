
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { 
  db, 
  auth,
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
  doc,
  deleteDoc,
  User
} from '../firebase';
import SignatureCanvas from 'react-signature-canvas';

interface OrderItem {
  description: string;
  options: string;
  unitPrice: number;
  totalPrice: number;
}

interface WorkOrder {
  id?: string;
  workOrderId: string;
  clientName: string;
  wechatId: string;
  creationDate: string;
  expectedCompletionDate: string;
  style: string;
  font: string;
  fontContent: string;
  orderItems: OrderItem[];
  totalAmount: number;
  notes: string;
  signature: string;
  signatureDate: string;
  createdAt: any;
}

const OwnerPortal: React.FC = () => {
  const [password, setPassword] = useState('');
  const [isLinkAuthenticated, setIsLinkAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState(false);
  const [view, setView] = useState<'list' | 'create'>('list');
  const [orders, setOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    clientName: '',
    wechatId: '',
    style: '',
    font: '',
    fontContent: '',
    notes: '請把照片4:3 原圖 傳送到造白美學館之微信或電郵；\n資料齊全後方可進行下一工序，其製作時間約 3 個月；\n作品完成後，本館會立刻安排交收。',
    orderItems: [{ description: '', options: '', unitPrice: 0, totalPrice: 0 }]
  });

  const sigPad = useRef<SignatureCanvas>(null);

  // You can change this password here
  const SECRET_PASSWORD = 'witdo2026';
  const ADMIN_EMAIL = 'mo.witdo@gmail.com';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && currentUser.email === ADMIN_EMAIL) {
        // Load orders
        const q = query(collection(db, 'workOrders'), orderBy('createdAt', 'desc'));
        const unsubOrders = onSnapshot(q, (snapshot) => {
          const fetchedOrders = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as WorkOrder[];
          setOrders(fetchedOrders);
          setLoading(false);
        });
        return () => unsubOrders();
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLinkLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === SECRET_PASSWORD) {
      setIsLinkAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  const handleLogout = () => {
    signOut(auth);
    setIsLinkAuthenticated(false);
  };

  const generateOrderId = () => {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `WO-${dateStr}-${random}`;
  };

  const calculateCompletionDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth() + 3);
    return date.toISOString().slice(0, 10);
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      orderItems: [...formData.orderItems, { description: '', options: '', unitPrice: 0, totalPrice: 0 }]
    });
  };

  const handleUpdateItem = (index: number, field: keyof OrderItem, value: any) => {
    const newItems = [...formData.orderItems];
    newItems[index] = { ...newItems[index], [field]: value };
    if (field === 'unitPrice') {
      newItems[index].totalPrice = Number(value);
    }
    setFormData({ ...formData, orderItems: newItems });
  };

  const handleSubmitOrder = async () => {
    if (!sigPad.current || sigPad.current.isEmpty()) {
      alert("Please provide a signature");
      return;
    }

    const workOrderId = generateOrderId();
    const creationDate = new Date().toISOString();
    const expectedCompletionDate = calculateCompletionDate();
    const signature = sigPad.current.getTrimmedCanvas().toDataURL('image/png');
    const totalAmount = formData.orderItems.reduce((sum, item) => sum + item.totalPrice, 0);

    const newOrder: WorkOrder = {
      workOrderId,
      clientName: formData.clientName,
      wechatId: formData.wechatId,
      creationDate,
      expectedCompletionDate,
      style: formData.style,
      font: formData.font,
      fontContent: formData.fontContent,
      orderItems: formData.orderItems,
      totalAmount,
      notes: formData.notes,
      signature,
      signatureDate: creationDate,
      createdAt: Timestamp.now()
    };

    try {
      await addDoc(collection(db, 'workOrders'), newOrder);
      alert("Order Created Successfully!");
      setView('list');
      setFormData({
        clientName: '',
        wechatId: '',
        style: '',
        font: '',
        fontContent: '',
        notes: '請把照片4:3 原圖 傳送到造白美學館之微信或電郵；\n資料齊全後方可進行下一工序，其製作時間約 3 個月；\n作品完成後，本館會立刻安排交收。',
        orderItems: [{ description: '', options: '', unitPrice: 0, totalPrice: 0 }]
      });
    } catch (err) {
      console.error("Error adding document: ", err);
      alert("Failed to create order. Check permissions.");
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await deleteDoc(doc(db, 'workOrders', id));
      } catch (err) {
        console.error("Error deleting document: ", err);
      }
    }
  };

  if (!isLinkAuthenticated) {
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
          
          <form onSubmit={handleLinkLogin} className="space-y-6">
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

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen bg-linen-100 flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white p-12 shadow-xl border border-linen-200 text-center space-y-8">
          <h2 className="text-2xl serif italic text-linen-900">Admin Verification Required</h2>
          <p className="text-sm text-linen-600">Please sign in with your admin Google account ({ADMIN_EMAIL}) to access the database.</p>
          <button 
            onClick={handleGoogleLogin}
            className="w-full bg-linen-900 text-linen-50 py-3 text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-linen-800 transition-all"
          >
            Sign in with Google
          </button>
          {user && user.email !== ADMIN_EMAIL && (
            <p className="text-red-500 text-[10px] uppercase tracking-widest">Account {user.email} is not authorized.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linen-50 p-4 md:p-16 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-linen-200 pb-8 gap-4">
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-linen-400">Management Portal</span>
          <h1 className="text-4xl md:text-6xl serif italic text-linen-900">Work Orders</h1>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setView(view === 'list' ? 'create' : 'list')}
            className="bg-linen-900 text-linen-50 px-6 py-2 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-linen-800 transition-all"
          >
            {view === 'list' ? '+ New Order' : 'View Orders'}
          </button>
          <button 
            onClick={handleLogout}
            className="text-[9px] font-bold uppercase tracking-[0.2em] text-linen-400 hover:text-linen-900 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {view === 'list' ? (
        <div className="space-y-8">
          {loading ? (
            <p className="text-center py-20 text-linen-400 animate-pulse">Loading orders...</p>
          ) : orders.length === 0 ? (
            <div className="text-center py-20 bg-white border border-linen-200">
              <p className="text-linen-400 serif italic">No work orders found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-white p-8 border border-linen-200 shadow-sm flex flex-col md:flex-row justify-between gap-8">
                  <div className="space-y-4 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] font-bold text-linen-400 uppercase tracking-widest">{order.workOrderId}</span>
                        <h3 className="text-2xl serif italic text-linen-900">{order.clientName}</h3>
                      </div>
                      <span className="text-lg serif text-linen-900 font-bold">MOP {order.totalAmount}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-[10px] uppercase tracking-wider text-linen-600">
                      <p><span className="font-bold">WeChat:</span> {order.wechatId}</p>
                      <p><span className="font-bold">Created:</span> {new Date(order.creationDate).toLocaleDateString()}</p>
                      <p><span className="font-bold">Expected:</span> {new Date(order.expectedCompletionDate).toLocaleDateString()}</p>
                      <p><span className="font-bold">Style:</span> {order.style}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 justify-center">
                    <button 
                      onClick={() => window.print()}
                      className="border border-linen-200 px-4 py-2 text-[9px] font-bold uppercase tracking-widest hover:bg-linen-50 transition-all"
                    >
                      Print Form
                    </button>
                    <button 
                      onClick={() => handleDeleteOrder(order.id!)}
                      className="text-red-400 hover:text-red-600 text-[9px] font-bold uppercase tracking-widest transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white p-8 md:p-12 border border-linen-200 shadow-lg max-w-4xl mx-auto space-y-12"
          id="work-order-form"
        >
          <div className="text-center space-y-4 border-b border-linen-100 pb-8">
            <h2 className="text-3xl serif italic text-linen-900">Work Order Form</h2>
            <p className="text-[10px] uppercase tracking-[0.5em] text-linen-400">造白美學館 Witdo Macau</p>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-linen-400">姓名 (Name)</label>
              <input 
                type="text" 
                value={formData.clientName}
                onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                className="w-full border-b border-linen-200 py-2 focus:outline-none focus:border-linen-900 serif italic"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-linen-400">微信號 (WeChat ID)</label>
              <input 
                type="text" 
                value={formData.wechatId}
                onChange={(e) => setFormData({...formData, wechatId: e.target.value})}
                className="w-full border-b border-linen-200 py-2 focus:outline-none focus:border-linen-900 serif italic"
              />
            </div>
          </div>

          {/* Style & Font */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-linen-400">款式 (Style)</label>
              <input 
                type="text" 
                value={formData.style}
                onChange={(e) => setFormData({...formData, style: e.target.value})}
                className="w-full border-b border-linen-200 py-2 focus:outline-none focus:border-linen-900 serif italic"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-linen-400">名牌字型 (Font)</label>
              <input 
                type="text" 
                value={formData.font}
                onChange={(e) => setFormData({...formData, font: e.target.value})}
                className="w-full border-b border-linen-200 py-2 focus:outline-none focus:border-linen-900 serif italic"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-linen-400">名牌內容 (Font Content)</label>
              <input 
                type="text" 
                value={formData.fontContent}
                onChange={(e) => setFormData({...formData, fontContent: e.target.value})}
                className="w-full border-b border-linen-200 py-2 focus:outline-none focus:border-linen-900 serif italic"
              />
            </div>
          </div>

          {/* Order Table */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-linen-900 border-b border-linen-100 pb-2">訂單內容 (Order Details)</h3>
            <table className="w-full text-left text-[10px] uppercase tracking-wider">
              <thead>
                <tr className="text-linen-400">
                  <th className="pb-4">Description</th>
                  <th className="pb-4">Options</th>
                  <th className="pb-4">Price</th>
                  <th className="pb-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-linen-50">
                {formData.orderItems.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-4">
                      <input 
                        type="text" 
                        value={item.description}
                        onChange={(e) => handleUpdateItem(idx, 'description', e.target.value)}
                        className="w-full focus:outline-none serif italic"
                        placeholder="Item name"
                      />
                    </td>
                    <td className="py-4">
                      <input 
                        type="text" 
                        value={item.options}
                        onChange={(e) => handleUpdateItem(idx, 'options', e.target.value)}
                        className="w-full focus:outline-none serif italic"
                        placeholder="Options"
                      />
                    </td>
                    <td className="py-4">
                      <input 
                        type="number" 
                        value={item.unitPrice}
                        onChange={(e) => handleUpdateItem(idx, 'unitPrice', e.target.value)}
                        className="w-24 focus:outline-none serif italic"
                      />
                    </td>
                    <td className="py-4 text-right">
                      <button onClick={() => {
                        const newItems = formData.orderItems.filter((_, i) => i !== idx);
                        setFormData({...formData, orderItems: newItems});
                      }} className="text-red-300 hover:text-red-500">×</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button 
              onClick={handleAddItem}
              className="text-[9px] font-bold uppercase tracking-widest text-linen-400 hover:text-linen-900"
            >
              + Add Row
            </button>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-linen-400">備註 (Notes)</label>
            <textarea 
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full h-24 bg-linen-50/50 p-4 text-[10px] leading-relaxed serif italic focus:outline-none"
            />
          </div>

          {/* Terms */}
          <div className="bg-linen-50/30 p-6 space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-linen-900">條款及細則 (Terms & Conditions)</h4>
            <div className="text-[9px] text-linen-600 leading-relaxed space-y-2">
              <p>• 本訂單一經簽名確認，即表示客戶已閱讀、瞭解並同意接受本服務條款之所有內容；</p>
              <p>• 基於客製化作品訂單的特性，訂單一經確認，即無法中途取消或變更製作內容；</p>
              <p>• 客製化作品一律不接受退換，恕不退款；</p>
              <p>• 如因原料有延長或縮短製作期，仍以實際情況為主，不便之處敬請見諒；</p>
              <p>• 如作品有任何瑕疵，客戶必須在收貨後的7天內以文字形式通知造白美學館；</p>
              <p>• 本司保留一切權利，可於任何時間及不時更改、增加、減少及／或修改本條款及細則，無需作出通知。</p>
            </div>
          </div>

          {/* Signature */}
          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-linen-400">客戶簽署 (Client Signature)</label>
            <div className="border border-linen-200 bg-linen-50/20 h-48 relative">
              <SignatureCanvas 
                ref={sigPad}
                penColor='black'
                canvasProps={{className: 'w-full h-full'}}
              />
              <button 
                onClick={() => sigPad.current?.clear()}
                className="absolute top-2 right-2 text-[8px] uppercase tracking-widest text-linen-400 hover:text-linen-900"
              >
                Clear
              </button>
            </div>
            <p className="text-[9px] text-linen-400 italic">Date: {new Date().toLocaleString()}</p>
          </div>

          <div className="pt-8 border-t border-linen-100 flex justify-end">
            <button 
              onClick={handleSubmitOrder}
              className="bg-linen-900 text-linen-50 px-12 py-4 text-[11px] font-bold uppercase tracking-[0.4em] hover:bg-linen-800 transition-all shadow-xl"
            >
              Confirm & Save Order
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default OwnerPortal;
