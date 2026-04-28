
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SignaturePad, { SignaturePadRef } from './SignaturePad';
import { db, auth } from '@/firebase';
import { collection, addDoc, serverTimestamp, doc, setDoc, query, where, getDocs } from 'firebase/firestore';

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



interface ProductOption {
  name: string;
  values: string[];
}

interface Product {
  id: string;
  name: string;
  price: number;
  options: ProductOption[];
}

interface Discount {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  applicableProductIds: string[];
}

interface WorkOrderFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: any;
}

const WorkOrderForm: React.FC<WorkOrderFormProps> = ({ onSuccess, onCancel, initialData }) => {
  const sigPad = useRef<SignaturePadRef>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const DEFAULT_FONts = [
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

  useEffect(() => {
    const fetchData = async () => {
      if (!auth.currentUser) return;
      
      // Fetch Products
      const productsQuery = query(collection(db, 'products'), where('ownerUid', '==', auth.currentUser.uid));
      const productsSnapshot = await getDocs(productsQuery);
      const fetchedProducts = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(fetchedProducts);

      // Fetch Discounts
      const discountsQuery = query(collection(db, 'discounts'), where('ownerUid', '==', auth.currentUser.uid));
      const discountsSnapshot = await getDocs(discountsQuery);
      setDiscounts(discountsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Discount)));

      // If editing, try to find the selected product
      if (initialData?.style) {
        const found = fetchedProducts.find(p => p.name === initialData.style);
        if (found) {
          setSelectedProduct(found);
        }
      }
    };
    fetchData();
  }, [initialData]);

  const generateOrderId = () => {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(1000 + Math.random() * 9000);
    return `WD-${dateStr}-${random}`;
  };

  const getThreeMonthsLater = () => {
    const date = new Date();
    date.setMonth(date.getMonth() + 3);
    return date.toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState({
    workOrderId: initialData?.workOrderId || generateOrderId(),
    customerName: initialData?.customerName || '',
    wechatId: initialData?.wechatId || '',
    estimatedCompletionDate: initialData?.estimatedCompletionDate || getThreeMonthsLater(),
    style: initialData?.style || '',
    couponCode: initialData?.couponCode || '',
    nameplateFont: initialData?.nameplateFont || '',
    nameplateContent: initialData?.nameplateContent || '',
    totalPrice: initialData?.totalPrice || '',
    status: initialData?.status || 'pending',
    signatureData: initialData?.signatureData || '',
    signatureTime: initialData?.signatureTime || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLocalFirestoreError = (err: unknown, operationType: OperationType, path: string | null) => {
    const errInfo: FirestoreErrorInfo = {
      error: err instanceof Error ? err.message : String(err),
      authInfo: {
        userId: auth.currentUser?.uid,
        email: auth.currentUser?.email,
        emailVerified: auth.currentUser?.emailVerified,
        isAnonymous: auth.currentUser?.isAnonymous,
      },
      operationType,
      path
    };
    console.error('Firestore Error:', errInfo);
    setError(`Error: ${errInfo.error} (${operationType} on ${path})`);
  };

  const calculateTotal = (styleString: string, coupon: string) => {
    const selectedStyleNames = styleString.split(', ').filter(s => s !== '');
    const baseTotal = products
      .filter(p => selectedStyleNames.includes(p.name))
      .reduce((sum, p) => sum + p.price, 0);

    if (baseTotal === 0) return formData.totalPrice;

    const discount = discounts.find(d => d.code.toUpperCase() === coupon.toUpperCase().trim());
    if (!discount) return baseTotal.toString();

    if (discount.type === 'percentage') {
      return Math.round(baseTotal * (1 - discount.value / 100)).toString();
    } else {
      return Math.max(0, baseTotal - discount.value).toString();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'style') {
      const product = products.find(p => p.name === value);
      if (product) {
        setSelectedProduct(product);
        setFormData(prev => {
          const newStyle = value;
          return { 
            ...prev, 
            style: newStyle,
            totalPrice: calculateTotal(newStyle, prev.couponCode)
          };
        });
        return;
      } else if (value === 'custom') {
        setSelectedProduct(null);
      }
    }

    if (name === 'couponCode') {
      setFormData(prev => ({
        ...prev,
        couponCode: value,
        totalPrice: calculateTotal(prev.style, value)
      }));
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleStyle = useCallback((productName: string) => {
    const currentStyles = formData.style ? formData.style.split(', ').filter(s => s !== '') : [];
    let newStyles: string[];
    
    if (currentStyles.includes(productName)) {
      newStyles = currentStyles.filter(s => s !== productName);
    } else {
      newStyles = [...currentStyles, productName];
    }

    const styleString = newStyles.join(', ');
    
    setFormData(prev => ({
      ...prev,
      style: styleString,
      totalPrice: calculateTotal(styleString, prev.couponCode)
    }));
  }, [formData.style, formData.couponCode, products, discounts]);

  const clearSignature = useCallback(() => {
    sigPad.current?.clear();
    setFormData(prev => ({ ...prev, signatureData: '', signatureTime: '' }));
  }, []);

  const saveSignature = useCallback(() => {
    if (sigPad.current?.isEmpty()) return;
    const data = sigPad.current?.toDataURL('image/png');
    setFormData(prev => ({ 
      ...prev, 
      signatureData: data || '', 
      signatureTime: new Date().toLocaleString() 
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!auth.currentUser) {
      setError('You must be logged in to manage work orders.');
      setLoading(false);
      return;
    }

    try {
      // Get the absolute latest signature from the pad ref direct to avoid state batching issues
      let latestSignature = formData.signatureData;
      let latestSignatureTime = formData.signatureTime;
      
      // If the pad exists, trust its state over formData for the signature
      if (sigPad.current) {
        if (!sigPad.current.isEmpty()) {
          latestSignature = sigPad.current.toDataURL('image/png');
          // Update timestamp if signature changed or was missing
          if (!latestSignatureTime || latestSignature !== formData.signatureData) {
            latestSignatureTime = new Date().toLocaleString();
          }
        } else if (formData.signatureData) {
          // If pad is empty but we HAD a signature in formData, it means the user cleared it
          latestSignature = '';
          latestSignatureTime = '';
        }
      }

      // Prepare final data, excluding the internal 'id' if it exists to satisfy Firestore rules
      const { id: _, ...cleanedFormData } = formData as any;

      const finalData = {
        ...cleanedFormData,
        signatureData: latestSignature,
        signatureTime: latestSignatureTime,
        totalPrice: Number(formData.totalPrice) || 0,
        updatedAt: serverTimestamp(),
        ownerUid: auth.currentUser.uid,
      };

      console.log('Submitting work order:', finalData.workOrderId, 'Owner:', finalData.ownerUid);

      if (initialData?.id) {
        console.log('Updating existing order:', initialData.id);
        // Specifically sanitize the payload for the update to ensure only allowed fields are sent
        await setDoc(doc(db, 'workOrders', initialData.id), finalData, { merge: true });
      } else {
        console.log('Creating new order...');
        const docRef = await addDoc(collection(db, 'workOrders'), {
          ...finalData,
          orderDate: serverTimestamp(),
        });
        console.log('New order created with ID:', docRef.id);
      }
      onSuccess();
    } catch (err: any) {
      handleLocalFirestoreError(err, initialData?.id ? OperationType.UPDATE : OperationType.CREATE, 'workOrders');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-5 md:p-6 border border-linen-200 shadow-xl max-w-4xl w-full max-h-[98vh] overflow-y-auto"
    >
      <div className="flex justify-between items-center mb-4 border-b border-linen-100 pb-2">
        <div>
          <h2 className="text-xl serif italic text-linen-900">造白美學館 - 訂單</h2>
          <p className="text-[9px] uppercase tracking-[0.3em] text-linen-400">Witdo Studio Work Order</p>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-bold uppercase tracking-widest text-linen-500">Order ID</p>
          <p className="text-xs font-mono text-linen-900">{formData.workOrderId}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-xs text-red-500 bg-red-50 p-2 border border-red-100">{error}</p>}

        {/* INFO PART */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="space-y-1">
            <label className="text-[9px] font-bold uppercase tracking-widest text-linen-500">姓名 (Name)</label>
            <input 
              required
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              className="w-full bg-linen-50 border border-linen-100 px-3 py-1 text-sm focus:outline-none focus:border-linen-900 transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-bold uppercase tracking-widest text-linen-500">微信號 (WeChat ID)</label>
            <input 
              required
              name="wechatId"
              value={formData.wechatId}
              onChange={handleChange}
              className="w-full bg-linen-50 border border-linen-100 px-3 py-1 text-sm focus:outline-none focus:border-linen-900 transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-bold uppercase tracking-widest text-linen-500">預計完成日 (Est. Completion)</label>
            <input 
              type="date"
              name="estimatedCompletionDate"
              value={formData.estimatedCompletionDate}
              onChange={handleChange}
              className="w-full bg-linen-50 border border-linen-100 px-3 py-1 text-sm focus:outline-none focus:border-linen-900 transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-bold uppercase tracking-widest text-linen-500">訂單狀態 (Status)</label>
            <select 
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full bg-linen-50 border border-linen-100 px-3 py-1 text-sm focus:outline-none focus:border-linen-900 transition-colors"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </div>

        {/* ORDER PART */}
        <div className="space-y-2">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-linen-800 border-b border-linen-50 pb-0.5">訂單詳情 (Order Details)</h3>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-3 space-y-1">
              <label className="text-[9px] font-bold uppercase tracking-widest text-linen-500">款式 (Style - 可多選)</label>
              <div className="bg-linen-50 border border-linen-100 p-2 max-h-40 overflow-y-auto space-y-1.5">
                {products.length === 0 && <p className="text-[10px] text-linen-400 italic">No products found</p>}
                {products.map(p => {
                  const isSelected = formData.style.split(', ').includes(p.name);
                  return (
                    <label key={p.id} className="flex items-center gap-2 cursor-pointer group">
                      <div 
                        onClick={() => toggleStyle(p.name)}
                        className={`w-3.5 h-3.5 border flex items-center justify-center transition-colors ${isSelected ? 'bg-linen-900 border-linen-900' : 'bg-white border-linen-200 group-hover:border-linen-400'}`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                      </div>
                      <span className={`text-[10px] select-none ${isSelected ? 'text-linen-900 font-bold' : 'text-linen-600'}`}>
                        {p.name} (MOP {p.price})
                      </span>
                    </label>
                  );
                })}
                <div className="pt-1 border-t border-linen-200">
                  <input 
                    placeholder="Other style..."
                    name="style"
                    value={formData.style}
                    onChange={handleChange}
                    className="w-full bg-transparent text-[10px] focus:outline-none placeholder:text-linen-300"
                  />
                </div>
              </div>
              
              <div className="pt-2 space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-widest text-linen-500">名牌內容 (Nameplate Content)</label>
                <input 
                  name="nameplateContent"
                  value={formData.nameplateContent}
                  onChange={handleChange}
                  className="w-full bg-linen-50 border border-linen-100 px-3 py-1 text-sm focus:outline-none focus:border-linen-900 transition-colors"
                />
              </div>

              <div className="pt-2 grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-linen-500">優惠碼 (Coupon)</label>
                  <input 
                    name="couponCode"
                    value={formData.couponCode}
                    onChange={handleChange}
                    placeholder="Enter code..."
                    className="w-full bg-linen-50 border border-linen-100 px-3 py-1 text-sm focus:outline-none focus:border-linen-900 transition-colors uppercase"
                  />
                  {formData.couponCode && discounts.find(d => d.code.toUpperCase() === formData.couponCode.toUpperCase().trim()) && (
                    <p className="text-[7px] text-green-600 font-bold uppercase tracking-widest mt-0.5">Applied!</p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-linen-500">總計 (Total Price)</label>
                  <input 
                    type="number"
                    name="totalPrice"
                    value={formData.totalPrice}
                    onChange={handleChange}
                    className="w-full bg-linen-50 border border-linen-100 px-3 py-1 text-sm focus:outline-none focus:border-linen-900 transition-colors font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-9 space-y-2">
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-widest text-linen-500">名牌字型 (Font Selection)</label>
                <select
                  value={formData.nameplateFont}
                  onChange={(e) => setFormData(prev => ({ ...prev, nameplateFont: e.target.value }))}
                  className="w-full bg-linen-50 border border-linen-100 px-3 py-1.5 text-sm focus:outline-none focus:border-linen-900 transition-colors"
                >
                  <option value="">選擇字型...</option>
                  {DEFAULT_FONts.map(font => (
                    <option key={font.name} value={font.name}>{font.name}</option>
                  ))}
                </select>
              </div>

              {formData.nameplateFont && (
                <div className="border border-linen-100 bg-white p-2 h-32 flex items-center justify-center relative group">
                  <img 
                    src={DEFAULT_FONts.find(f => f.name === formData.nameplateFont)?.imageUrl} 
                    alt={formData.nameplateFont} 
                    className="max-w-full max-h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-1 right-1 bg-white/80 px-2 py-0.5 border border-linen-100 text-[8px] font-bold uppercase tracking-widest text-linen-900">
                    Preview: {formData.nameplateFont}
                  </div>
                </div>
              )}
              
              {!formData.nameplateFont && (
                <div className="border border-dashed border-linen-100 bg-linen-50/30 h-32 flex items-center justify-center">
                  <span className="text-[10px] text-linen-300 uppercase tracking-widest italic">Please select a font to see preview</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* SIGNATURE */}
          <div className="space-y-2 col-span-2">
            <div className="flex justify-between items-end">
              <label className="text-[9px] font-bold uppercase tracking-widest text-linen-500">客戶簽署 (Client Signature)</label>
              <div className="flex gap-4 items-center">
                {formData.signatureTime && (
                  <p className="text-[8px] text-linen-400 uppercase tracking-widest">
                    Signed at: {formData.signatureTime}
                  </p>
                )}
                <button 
                  type="button"
                  onClick={clearSignature}
                  className="text-[8px] uppercase tracking-widest text-linen-400 hover:text-red-500"
                >
                  Clear
                </button>
              </div>
            </div>
            
            <div className="border border-linen-200 bg-linen-50/30 rounded-sm overflow-hidden h-16">
              <SignaturePad 
                ref={sigPad}
                initialDataUrl={initialData?.signatureData}
                onEnd={saveSignature}
                penColor="#1a1a1a"
                className="w-full h-full cursor-crosshair"
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-2 border-t border-linen-100">
          <button 
            type="button"
            onClick={onCancel}
            className="flex-1 border border-linen-200 py-2.5 text-[9px] font-bold uppercase tracking-[0.3em] hover:bg-linen-50 transition-all"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={loading}
            className="flex-1 bg-linen-900 text-white py-2.5 text-[9px] font-bold uppercase tracking-[0.3em] hover:bg-linen-800 transition-all disabled:opacity-50"
          >
            {loading ? 'Saving...' : initialData ? 'Update Order' : 'Confirm Order'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default WorkOrderForm;
