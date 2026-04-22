
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SignatureCanvas from 'react-signature-canvas';
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

interface NameTagFont {
  id: string;
  name: string;
  imageUrl: string;
}

interface WorkOrderFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: any;
}

const WorkOrderForm: React.FC<WorkOrderFormProps> = ({ onSuccess, onCancel, initialData }) => {
  const sigPad = useRef<SignatureCanvas>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [nameTagFonts, setNameTagFonts] = useState<NameTagFont[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchData = async () => {
      if (!auth.currentUser) return;
      
      // Fetch Products
      const productsQuery = query(collection(db, 'products'), where('ownerUid', '==', auth.currentUser.uid));
      const productsSnapshot = await getDocs(productsQuery);
      const fetchedProducts = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(fetchedProducts);

      // Fetch Name Tag Fonts
      const fontsQuery = query(collection(db, 'nameTagFonts'), where('ownerUid', '==', auth.currentUser.uid));
      const fontsSnapshot = await getDocs(fontsQuery);
      setNameTagFonts(fontsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NameTagFont)));

      // If editing, try to find the selected product
      if (initialData?.style) {
        const found = fetchedProducts.find(p => p.name === initialData.style);
        if (found) {
          setSelectedProduct(found);
          // Parse options if they are stored in a specific format
          try {
            const parsedOptions = JSON.parse(initialData.options);
            setSelectedOptions(parsedOptions);
          } catch (e) {
            // Fallback for legacy text options
          }
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
    nameplateFont: initialData?.nameplateFont || '',
    nameplateContent: initialData?.nameplateContent || '',
    orderDescription: initialData?.orderDescription || '',
    options: initialData?.options || '',
    unitPrice: initialData?.unitPrice || '',
    totalPrice: initialData?.totalPrice || '',
    status: initialData?.status || 'pending',
    signatureData: initialData?.signatureData || '',
    signatureTime: initialData?.signatureTime || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'style') {
      const product = products.find(p => p.name === value);
      if (product) {
        setSelectedProduct(product);
        setSelectedOptions({}); // Reset options when product changes
        setFormData(prev => ({ 
          ...prev, 
          style: value,
          unitPrice: product.price.toString(),
          totalPrice: product.price.toString(),
          options: '' // Reset options string
        }));
        return;
      } else if (value === 'custom') {
        setSelectedProduct(null);
        setSelectedOptions({});
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (optionName: string, value: string) => {
    const newOptions = { ...selectedOptions, [optionName]: value };
    setSelectedOptions(newOptions);
    
    // Update the options string for storage
    const optionsString = Object.entries(newOptions)
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ');
    
    setFormData(prev => ({ ...prev, options: optionsString }));
  };

  const clearSignature = () => {
    sigPad.current?.clear();
    setFormData(prev => ({ ...prev, signatureData: '', signatureTime: '' }));
  };

  const saveSignature = () => {
    if (sigPad.current?.isEmpty()) return;
    const data = sigPad.current?.getTrimmedCanvas().toDataURL('image/png');
    setFormData(prev => ({ 
      ...prev, 
      signatureData: data || '', 
      signatureTime: new Date().toLocaleString() 
    }));
  };

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
      const finalData = {
        ...formData,
        updatedAt: serverTimestamp(),
        ownerUid: auth.currentUser.uid,
      };

      if (initialData?.id) {
        await setDoc(doc(db, 'workOrders', initialData.id), finalData, { merge: true });
      } else {
        await addDoc(collection(db, 'workOrders'), {
          ...finalData,
          orderDate: serverTimestamp(),
        });
      }
      onSuccess();
    } catch (err: any) {
      handleFirestoreError(err, initialData?.id ? OperationType.UPDATE : OperationType.CREATE, 'workOrders');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 border border-linen-200 shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto"
    >
      <div className="flex justify-between items-center mb-6 border-b border-linen-100 pb-3">
        <div>
          <h2 className="text-xl serif italic text-linen-900">造白美學館 - 訂單</h2>
          <p className="text-[9px] uppercase tracking-[0.3em] text-linen-400">Witdo Studio Work Order</p>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-bold uppercase tracking-widest text-linen-500">Order ID</p>
          <p className="text-xs font-mono text-linen-900">{formData.workOrderId}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <p className="text-xs text-red-500 bg-red-50 p-2 border border-red-100">{error}</p>}

        {/* INFO PART */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-[9px] font-bold uppercase tracking-widest text-linen-500">姓名 (Name)</label>
            <input 
              required
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              className="w-full bg-linen-50 border border-linen-100 px-3 py-1.5 text-sm focus:outline-none focus:border-linen-900 transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-bold uppercase tracking-widest text-linen-500">微信號 (WeChat ID)</label>
            <input 
              required
              name="wechatId"
              value={formData.wechatId}
              onChange={handleChange}
              className="w-full bg-linen-50 border border-linen-100 px-3 py-1.5 text-sm focus:outline-none focus:border-linen-900 transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-bold uppercase tracking-widest text-linen-500">預計完成日 (Est. Completion)</label>
            <input 
              type="date"
              name="estimatedCompletionDate"
              value={formData.estimatedCompletionDate}
              onChange={handleChange}
              className="w-full bg-linen-50 border border-linen-100 px-3 py-1.5 text-sm focus:outline-none focus:border-linen-900 transition-colors"
            />
          </div>
        </div>

        {/* ORDER PART */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-linen-800 border-b border-linen-50 pb-1">訂單詳情 (Order Details)</h3>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-4 space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[9px] font-bold uppercase tracking-widest text-linen-500">款式 (Style)</label>
                {formData.unitPrice && (
                  <span className="text-[8px] font-bold text-linen-900 bg-linen-100 px-1.5 py-0.5 rounded tracking-widest">
                    MOP {formData.unitPrice}
                  </span>
                )}
              </div>
              <select 
                name="style"
                value={products.some(p => p.name === formData.style) ? formData.style : formData.style ? 'custom' : ''}
                onChange={handleChange}
                className="w-full bg-linen-50 border border-linen-100 px-3 py-1.5 text-sm focus:outline-none focus:border-linen-900 transition-colors"
              >
                <option value="">Select a product...</option>
                {products.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
                <option value="custom">Custom Product...</option>
              </select>
            </div>

            <div className="md:col-span-4 space-y-1">
              <label className="text-[9px] font-bold uppercase tracking-widest text-linen-500">名牌字型 (Font)</label>
              <div className="grid grid-cols-4 gap-1 max-h-24 overflow-y-auto border border-linen-100 p-1 bg-linen-50/30">
                {nameTagFonts.map(font => (
                  <button
                    key={font.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, nameplateFont: font.name }))}
                    className={`aspect-square border flex flex-col items-center justify-center p-1 transition-all ${formData.nameplateFont === font.name ? 'border-linen-900 bg-linen-100' : 'border-linen-100 bg-white hover:border-linen-400'}`}
                    title={font.name}
                  >
                    <img 
                      src={font.imageUrl} 
                      alt={font.name} 
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
                {nameTagFonts.length === 0 && (
                  <input 
                    name="nameplateFont"
                    placeholder="Type font name..."
                    value={formData.nameplateFont}
                    onChange={handleChange}
                    className="col-span-4 w-full bg-transparent px-2 py-1 text-xs focus:outline-none"
                  />
                )}
              </div>
              {formData.nameplateFont && (
                <p className="text-[8px] font-bold text-linen-900 uppercase tracking-widest mt-1">Selected: {formData.nameplateFont}</p>
              )}
            </div>

            <div className="md:col-span-4 space-y-1">
              <label className="text-[9px] font-bold uppercase tracking-widest text-linen-500">名牌內容 (Nameplate Content)</label>
              <input 
                name="nameplateContent"
                value={formData.nameplateContent}
                onChange={handleChange}
                className="w-full bg-linen-50 border border-linen-100 px-3 py-1.5 text-sm focus:outline-none focus:border-linen-900 transition-colors"
              />
            </div>

            {/* Dynamic Options */}
            {selectedProduct && selectedProduct.options?.length > 0 && (
              <div className="md:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-linen-50/50 border border-linen-50">
                {selectedProduct.options.map((opt, idx) => (
                  <div key={idx} className="space-y-1">
                    <label className="text-[8px] font-bold uppercase tracking-widest text-linen-500">{opt.name}</label>
                    <select
                      value={selectedOptions[opt.name] || ''}
                      onChange={(e) => handleOptionChange(opt.name, e.target.value)}
                      className="w-full bg-white border border-linen-100 px-2 py-1 text-xs focus:outline-none focus:border-linen-900"
                    >
                      <option value="">Select {opt.name}...</option>
                      {opt.values.map((val, vIdx) => (
                        <option key={vIdx} value={val}>{val}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            )}

            <div className="md:col-span-6 space-y-1">
              <label className="text-[9px] font-bold uppercase tracking-widest text-linen-500">訂單描述 (Description)</label>
              <input 
                name="orderDescription"
                value={formData.orderDescription}
                onChange={handleChange}
                className="w-full bg-linen-50 border border-linen-100 px-3 py-1.5 text-sm focus:outline-none focus:border-linen-900 transition-colors"
              />
            </div>

            <div className="md:col-span-6 space-y-1">
              <label className="text-[9px] font-bold uppercase tracking-widest text-linen-500">選項 (Options)</label>
              <input 
                name="options"
                value={formData.options}
                onChange={handleChange}
                className="w-full bg-linen-50 border border-linen-100 px-3 py-1.5 text-sm focus:outline-none focus:border-linen-900 transition-colors"
              />
            </div>

            <div className="md:col-span-3 space-y-1">
              <label className="text-[9px] font-bold uppercase tracking-widest text-linen-500">單價 (Unit Price)</label>
              <input 
                type="number"
                name="unitPrice"
                value={formData.unitPrice}
                onChange={handleChange}
                className="w-full bg-linen-50 border border-linen-100 px-3 py-1.5 text-sm focus:outline-none focus:border-linen-900 transition-colors"
              />
            </div>
            <div className="md:col-span-3 space-y-1">
              <label className="text-[9px] font-bold uppercase tracking-widest text-linen-500">總價 (Total Price)</label>
              <input 
                type="number"
                name="totalPrice"
                value={formData.totalPrice}
                onChange={handleChange}
                className="w-full bg-linen-50 border border-linen-100 px-3 py-1.5 text-sm focus:outline-none focus:border-linen-900 transition-colors"
              />
            </div>
            <div className="md:col-span-6 space-y-1">
              <label className="text-[9px] font-bold uppercase tracking-widest text-linen-500">訂單狀態 (Status)</label>
              <select 
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-linen-50 border border-linen-100 px-3 py-1.5 text-sm focus:outline-none focus:border-linen-900 transition-colors"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* REMARKS & TERMS */}
          <div className="space-y-4">
            <div className="bg-linen-50 p-4 space-y-2 border border-linen-100">
              <h4 className="text-[9px] font-bold uppercase tracking-widest text-linen-800">備註 (Remarks)</h4>
              <ul className="text-[10px] text-linen-600 space-y-1 list-disc pl-4 leading-tight">
                <li>請把照片4:3 原圖 傳送到造白美學館之微信或電郵;</li>
                <li>資料齊全後方可進行下一工序，其製作時間約 3 個月；</li>
                <li>作品完成後，本館會立刻安排交收。</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-[9px] font-bold uppercase tracking-widest text-linen-800">條款及細則 (Terms & Conditions)</h4>
              <div className="text-[9px] text-linen-400 leading-tight space-y-1 max-h-24 overflow-y-auto border border-linen-50 p-3">
                <p>1. 本訂單一經簽名確認，即表示客戶已閱讀、瞭解並同意接受本服務條款之所有內容；</p>
                <p>2. 基於客製化作品訂單的特性，訂單一經確認，即無法中途取消或變更製作內容；</p>
                <p>3. 客製化作品一律不接受退換，恕不退款；</p>
                <p>4. 如因原料有延長或縮短製作期，仍以實際情況為主，不便之處敬請見諒；</p>
                <p>5. 如作品有任何瑕疵，客戶必須在收貨後的7天內以文字形式通知造白美學館；</p>
                <p>6. 本司保留一切權利，可於任何時間及不時更改、增加、減少及／或修改本條款及細則，無需作出通知。</p>
              </div>
            </div>
          </div>

          {/* SIGNATURE */}
          <div className="space-y-3 border-l border-linen-100 pl-6">
            <div className="flex justify-between items-end">
              <label className="text-[9px] font-bold uppercase tracking-widest text-linen-500">客戶簽署 (Client Signature)</label>
              <button 
                type="button"
                onClick={clearSignature}
                className="text-[8px] uppercase tracking-widest text-linen-400 hover:text-red-500"
              >
                Clear
              </button>
            </div>
            
            <div className="border border-linen-200 bg-linen-50/30 rounded-sm overflow-hidden">
              <SignatureCanvas 
                ref={sigPad}
                onEnd={saveSignature}
                penColor="#1a1a1a"
                canvasProps={{
                  className: "w-full h-32 cursor-crosshair",
                  style: { width: '100%', height: '128px' }
                }}
              />
            </div>
            
            {formData.signatureTime && (
              <p className="text-[8px] text-linen-400 uppercase tracking-widest">
                Signed at: {formData.signatureTime}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t border-linen-100">
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
