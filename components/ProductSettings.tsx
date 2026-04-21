
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db, auth, storage } from '../firebase';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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

interface Preset {
  id: string;
  name: string;
  values: string[];
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

interface NameTagFont {
  id: string;
  name: string;
  imageUrl: string;
}

const ProductSettings: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [nameTagFonts, setNameTagFonts] = useState<NameTagFont[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'products' | 'presets' | 'discounts' | 'nametags'>('products');
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  
  // Form states
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [editingPreset, setEditingPreset] = useState<Partial<Preset> | null>(null);
  const [editingDiscount, setEditingDiscount] = useState<Partial<Discount> | null>(null);
  const [editingNameTagFont, setEditingNameTagFont] = useState<Partial<NameTagFont> | null>(null);
  const [presetInputValue, setPresetInputValue] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addPresetValue = () => {
    const val = presetInputValue.trim();
    if (val) {
      const newVals = val.split(',').map(v => v.trim()).filter(v => v !== '');
      setEditingPreset(prev => {
        if (!prev) return null;
        return {
          ...prev,
          values: [...(prev.values || []), ...newVals]
        };
      });
      setPresetInputValue('');
    }
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const productsQuery = query(collection(db, 'products'), where('ownerUid', '==', user.uid));
    const presetsQuery = query(collection(db, 'presets'), where('ownerUid', '==', user.uid));
    const discountsQuery = query(collection(db, 'discounts'), where('ownerUid', '==', user.uid));
    const nameTagFontsQuery = query(collection(db, 'nameTagFonts'), where('ownerUid', '==', user.uid));

    const unsubProducts = onSnapshot(productsQuery, (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'products');
    });

    const unsubPresets = onSnapshot(presetsQuery, (snapshot) => {
      setPresets(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Preset)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'presets');
    });

    const unsubDiscounts = onSnapshot(discountsQuery, (snapshot) => {
      setDiscounts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Discount)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'discounts');
    });

    const unsubNameTagFonts = onSnapshot(nameTagFontsQuery, (snapshot) => {
      setNameTagFonts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NameTagFont)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'nameTagFonts');
    });

    return () => {
      unsubProducts();
      unsubPresets();
      unsubDiscounts();
      unsubNameTagFonts();
    };
  }, []);

  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      if (!editingNameTagFont || uploading) return;
      
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf('image') !== -1) {
          const blob = item.getAsFile();
          if (blob) {
            e.preventDefault();
            console.log('Pasted image detected, type:', blob.type, 'size:', blob.size);
            // Ensuring unique name for each paste
            const fileName = `pasted_font_${Date.now()}.png`;
            await uploadAndSetImage(blob, fileName);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [editingNameTagFont, uploading]);

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser || !editingProduct?.name) return;

    const data = {
      name: editingProduct.name,
      price: Number(editingProduct.price) || 0,
      options: editingProduct.options || [],
      ownerUid: auth.currentUser.uid,
      updatedAt: serverTimestamp(),
    };

    try {
      setError(null);
      if (editingProduct.id) {
        await updateDoc(doc(db, 'products', editingProduct.id), data);
      } else {
        await addDoc(collection(db, 'products'), data);
      }
      setEditingProduct(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save product');
      handleFirestoreError(err, editingProduct.id ? OperationType.UPDATE : OperationType.CREATE, 'products');
    }
  };

  const handleSavePreset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser || !editingPreset?.name) return;

    // Add any pending input value
    let finalValues = [...(editingPreset.values || [])];
    const pendingVal = presetInputValue.trim();
    if (pendingVal) {
      const newVals = pendingVal.split(',').map(v => v.trim()).filter(v => v !== '');
      finalValues = [...finalValues, ...newVals];
    }

    const data = {
      name: editingPreset.name,
      values: finalValues,
      ownerUid: auth.currentUser.uid,
      updatedAt: serverTimestamp(),
    };

    try {
      setError(null);
      if (editingPreset.id) {
        await updateDoc(doc(db, 'presets', editingPreset.id), data);
      } else {
        await addDoc(collection(db, 'presets'), data);
      }
      setEditingPreset(null);
      setPresetInputValue('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save preset');
      handleFirestoreError(err, editingPreset.id ? OperationType.UPDATE : OperationType.CREATE, 'presets');
    }
  };

  const handleSaveDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser || !editingDiscount?.code || !editingDiscount?.type || editingDiscount?.value === undefined) return;

    const data = {
      code: editingDiscount.code.toUpperCase(),
      type: editingDiscount.type,
      value: Number(editingDiscount.value),
      applicableProductIds: editingDiscount.applicableProductIds || [],
      ownerUid: auth.currentUser.uid,
      updatedAt: serverTimestamp(),
    };

    try {
      setError(null);
      if (editingDiscount.id) {
        await updateDoc(doc(db, 'discounts', editingDiscount.id), data);
      } else {
        await addDoc(collection(db, 'discounts'), data);
      }
      setEditingDiscount(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save discount');
      handleFirestoreError(err, editingDiscount.id ? OperationType.UPDATE : OperationType.CREATE, 'discounts');
    }
  };

  const uploadAndSetImage = async (file: File | Blob, fileName: string) => {
    if (!auth.currentUser) {
      console.error('Upload failed: User not authenticated');
      return;
    }

    // Ensure we have a valid File object or Blob
    if (!file || file.size === 0) {
      console.error('Upload failed: File is empty or invalid');
      return;
    }

    console.log(`Starting upload for: ${fileName}, type: ${file.type}, size: ${file.size}`);
    setUploading(true);
    setError(null);

    try {
      const storageRef = ref(storage, `fonts/${auth.currentUser.uid}/${Date.now()}_${fileName}`);
      console.log('Storage reference created:', storageRef.fullPath);
      
      const snapshot = await uploadBytes(storageRef, file);
      console.log('Upload successful');
      
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('Download URL obtained');
      
      setEditingNameTagFont(prev => {
        if (!prev) {
          console.warn('editingNameTagFont state was lost during upload');
          return null;
        }
        return { ...prev, imageUrl: downloadURL };
      });
    } catch (err) {
      console.error('Upload process failed:', err);
      setError('Failed to upload image. Please ensure it is a valid image file and check your connection.');
    } finally {
      console.log('Upload state resetting to false');
      setUploading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadAndSetImage(file, file.name);
      // Reset to allow re-upload if needed
      e.target.value = '';
    }
  };

  const handleSaveNameTagFont = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser || !editingNameTagFont?.name || !editingNameTagFont?.imageUrl) return;

    const data = {
      name: editingNameTagFont.name,
      imageUrl: editingNameTagFont.imageUrl,
      ownerUid: auth.currentUser.uid,
      updatedAt: serverTimestamp(),
    };

    try {
      setError(null);
      if (editingNameTagFont.id) {
        await updateDoc(doc(db, 'nameTagFonts', editingNameTagFont.id), data);
      } else {
        await addDoc(collection(db, 'nameTagFonts'), data);
      }
      setEditingNameTagFont(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save font');
      handleFirestoreError(err, editingNameTagFont.id ? OperationType.UPDATE : OperationType.CREATE, 'nameTagFonts');
    }
  };

  const deleteItem = async (collectionName: string, id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, collectionName);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading settings...</div>;

  return (
    <div className="bg-white p-8 border border-linen-200 shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative">
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 text-linen-400 hover:text-linen-900 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="mb-8 space-y-2">
        <h2 className="text-2xl serif italic text-linen-900">Product Settings</h2>
        <p className="text-[10px] uppercase tracking-[0.3em] text-linen-400">Configure your studio offerings</p>
      </div>

      <div className="flex gap-8 border-b border-linen-100 mb-8">
        <button 
          onClick={() => setActiveTab('products')}
          className={`pb-4 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'products' ? 'text-linen-900 border-b-2 border-linen-900' : 'text-linen-400'}`}
        >
          Products
        </button>
        <button 
          onClick={() => setActiveTab('presets')}
          className={`pb-4 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'presets' ? 'text-linen-900 border-b-2 border-linen-900' : 'text-linen-400'}`}
        >
          Option Presets
        </button>
        <button 
          onClick={() => setActiveTab('discounts')}
          className={`pb-4 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'discounts' ? 'text-linen-900 border-b-2 border-linen-900' : 'text-linen-400'}`}
        >
          Discounts
        </button>
        <button 
          onClick={() => setActiveTab('nametags')}
          className={`pb-4 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'nametags' ? 'text-linen-900 border-b-2 border-linen-900' : 'text-linen-400'}`}
        >
          Name Tags
        </button>
      </div>

      {activeTab === 'products' ? (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-widest text-linen-800">Available Products</h3>
            <button 
              onClick={() => {
                setEditingProduct({ name: '', price: 0, options: [] });
                setError(null);
              }}
              className="text-[10px] font-bold uppercase tracking-widest bg-linen-900 text-white px-4 py-2 hover:bg-linen-800 transition-all"
            >
              + Add Product
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map(product => (
              <div key={product.id} className="p-6 border border-linen-100 bg-linen-50/30 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg serif italic text-linen-900">{product.name}</h4>
                    <p className="text-sm text-linen-500">MOP {product.price}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => {
                      setEditingProduct(product);
                      setError(null);
                    }} className="text-linen-400 hover:text-linen-900">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button onClick={() => deleteItem('products', product.id)} className="text-linen-400 hover:text-red-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
                {product.options?.length > 0 && (
                  <div className="pt-4 border-t border-linen-100">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-linen-400 mb-2">Configured Options</p>
                    <div className="flex flex-wrap gap-2">
                      {product.options.map((opt, i) => (
                        <span key={i} className="text-[10px] bg-white border border-linen-100 px-2 py-1 rounded text-linen-600">
                          {opt.name} ({opt.values.length})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === 'presets' ? (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-widest text-linen-800">Reusable Presets</h3>
            <button 
              onClick={() => {
                setEditingPreset({ name: '', values: [] });
                setPresetInputValue('');
                setError(null);
              }}
              className="text-[10px] font-bold uppercase tracking-widest bg-linen-900 text-white px-4 py-2 hover:bg-linen-800 transition-all"
            >
              + Add Preset
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {presets.map(preset => (
              <div key={preset.id} className="p-6 border border-linen-100 bg-linen-50/30 space-y-4">
                <div className="flex justify-between items-start">
                  <h4 className="text-lg serif italic text-linen-900">{preset.name}</h4>
                  <div className="flex gap-2">
                    <button onClick={() => {
                      setEditingPreset(preset);
                      setPresetInputValue('');
                      setError(null);
                    }} className="text-linen-400 hover:text-linen-900">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button onClick={() => deleteItem('presets', preset.id)} className="text-linen-400 hover:text-red-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {preset.values.map((v, i) => (
                    <span key={i} className="text-[10px] bg-white border border-linen-100 px-2 py-1 rounded text-linen-600">{v}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === 'nametags' ? (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-widest text-linen-800">Name Tag Fonts</h3>
            <button 
              onClick={() => {
                setEditingNameTagFont({ name: '', imageUrl: '' });
                setError(null);
              }}
              className="text-[10px] font-bold uppercase tracking-widest bg-linen-900 text-white px-4 py-2 hover:bg-linen-800 transition-all"
            >
              + Add Font
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {nameTagFonts.map(font => (
              <div key={font.id} className="p-4 border border-linen-100 bg-linen-50/30 space-y-3 group relative">
                <div className="aspect-[3/2] bg-white border border-linen-50 flex items-center justify-center overflow-hidden">
                  <img 
                    src={font.imageUrl} 
                    alt={font.name} 
                    className="max-w-full max-h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-linen-900">{font.name}</h4>
                  <div className="flex gap-2">
                    <button onClick={() => {
                      setEditingNameTagFont(font);
                      setError(null);
                    }} className="text-linen-400 hover:text-linen-900">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button onClick={() => deleteItem('nameTagFonts', font.id)} className="text-linen-400 hover:text-red-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {nameTagFonts.length === 0 && (
              <div className="col-span-full py-12 text-center border-2 border-dashed border-linen-100">
                <p className="text-linen-400 text-xs italic">No fonts uploaded yet. Add your first font style image.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-widest text-linen-800">Active Discounts</h3>
            <button 
              onClick={() => {
                setEditingDiscount({ code: '', type: 'percentage', value: 0, applicableProductIds: products.map(p => p.id) });
                setError(null);
              }}
              className="text-[10px] font-bold uppercase tracking-widest bg-linen-900 text-white px-4 py-2 hover:bg-linen-800 transition-all"
            >
              + Add Discount
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {discounts.map(discount => (
              <div key={discount.id} className="p-6 border border-linen-100 bg-linen-50/30 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg serif italic text-linen-900">{discount.code}</h4>
                    <p className="text-[10px] uppercase tracking-widest text-linen-500">
                      {discount.type === 'percentage' ? `${discount.value}% OFF` : `MOP ${discount.value} OFF`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => {
                      setEditingDiscount(discount);
                      setError(null);
                    }} className="text-linen-400 hover:text-linen-900">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button onClick={() => deleteItem('discounts', discount.id)} className="text-linen-400 hover:text-red-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
                <div className="pt-2 border-t border-linen-100">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-linen-400 mb-2">Applies to:</p>
                  <div className="flex flex-wrap gap-1">
                    {discount.applicableProductIds.length === products.length ? (
                      <span className="text-[9px] bg-linen-100 text-linen-700 px-2 py-0.5 rounded">All Products</span>
                    ) : (
                      discount.applicableProductIds.map(pid => {
                        const p = products.find(prod => prod.id === pid);
                        return p ? (
                          <span key={pid} className="text-[9px] bg-linen-50 text-linen-600 px-2 py-0.5 rounded border border-linen-100">
                            {p.name}
                          </span>
                        ) : null;
                      })
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product Edit Modal */}
      <AnimatePresence>
        {editingProduct && (
          <div className="fixed inset-0 bg-linen-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-8 border border-linen-200 shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <h3 className="text-xl serif italic text-linen-900 mb-6">{editingProduct.id ? 'Edit Product' : 'New Product'}</h3>
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-[10px] uppercase tracking-widest animate-pulse">
                  {error}
                </div>
              )}
              <form onSubmit={handleSaveProduct} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-linen-500">Product Name</label>
                    <input 
                      required
                      value={editingProduct.name}
                      onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      className="w-full bg-linen-50 border border-linen-100 px-4 py-2 text-sm focus:outline-none focus:border-linen-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-linen-500">Base Price (MOP)</label>
                    <input 
                      required
                      type="number"
                      value={editingProduct.price}
                      onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                      className="w-full bg-linen-50 border border-linen-100 px-4 py-2 text-sm focus:outline-none focus:border-linen-900"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-linen-50 pb-2">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-linen-800">Product Options</h4>
                    <button 
                      type="button"
                      onClick={() => setEditingProduct({ 
                        ...editingProduct, 
                        options: [...(editingProduct.options || []), { name: '', values: [] }] 
                      })}
                      className="text-[9px] font-bold uppercase tracking-widest text-linen-600 hover:text-linen-900"
                    >
                      + Add Option
                    </button>
                  </div>

                  {editingProduct.options?.map((opt, optIdx) => (
                    <div key={optIdx} className="p-4 border border-linen-50 bg-linen-50/20 space-y-4">
                      <div className="flex justify-between items-center">
                        <input 
                          placeholder="Option Name (e.g. Color)"
                          value={opt.name}
                          onChange={e => {
                            const newOpts = [...(editingProduct.options || [])];
                            newOpts[optIdx].name = e.target.value;
                            setEditingProduct({ ...editingProduct, options: newOpts });
                          }}
                          className="bg-transparent border-b border-linen-200 text-sm focus:outline-none focus:border-linen-900"
                        />
                        <button 
                          type="button"
                          onClick={() => {
                            const newOpts = editingProduct.options?.filter((_, i) => i !== optIdx);
                            setEditingProduct({ ...editingProduct, options: newOpts });
                          }}
                          className="text-red-400 hover:text-red-600"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-[9px] font-bold uppercase tracking-widest text-linen-400">Values</label>
                          <select 
                            className="text-[9px] font-bold uppercase tracking-widest bg-white border border-linen-200 px-2 py-1"
                            onChange={e => {
                              const preset = presets.find(p => p.id === e.target.value);
                              if (preset) {
                                const newOpts = [...(editingProduct.options || [])];
                                // Auto-populate name from preset
                                newOpts[optIdx].name = preset.name;
                                newOpts[optIdx].values = [...new Set([...newOpts[optIdx].values, ...preset.values])];
                                setEditingProduct({ ...editingProduct, options: newOpts });
                              }
                            }}
                            value=""
                          >
                            <option value="">Populate from Preset...</option>
                            {presets.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                          </select>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {opt.values.map((v, vIdx) => (
                            <span key={vIdx} className="text-[10px] bg-white border border-linen-100 px-2 py-1 rounded flex items-center gap-2">
                              {v}
                              <button 
                                type="button"
                                onClick={() => {
                                  const newOpts = [...(editingProduct.options || [])];
                                  newOpts[optIdx].values = newOpts[optIdx].values.filter((_, i) => i !== vIdx);
                                  setEditingProduct({ ...editingProduct, options: newOpts });
                                }}
                                className="text-linen-300 hover:text-red-500"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                          <input 
                            className="text-[10px] bg-transparent border-b border-linen-100 focus:outline-none focus:border-linen-900 w-24"
                            placeholder="+ Add value(s)"
                            onBlur={e => {
                              const val = e.target.value.trim();
                              if (val) {
                                const newVals = val.split(',').map(v => v.trim()).filter(v => v !== '');
                                const newOpts = [...(editingProduct.options || [])];
                                newOpts[optIdx].values = [...new Set([...newOpts[optIdx].values, ...newVals])];
                                setEditingProduct({ ...editingProduct, options: newOpts });
                                e.target.value = '';
                              }
                            }}
                            onKeyDown={e => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                e.currentTarget.blur();
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="flex-1 border border-linen-200 py-3 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-linen-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-linen-900 text-white py-3 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-linen-800"
                  >
                    Save Product
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Preset Edit Modal */}
      <AnimatePresence>
        {editingPreset && (
          <div className="fixed inset-0 bg-linen-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-8 border border-linen-200 shadow-2xl max-w-md w-full"
            >
              <h3 className="text-xl serif italic text-linen-900 mb-6">{editingPreset.id ? 'Edit Preset' : 'New Preset'}</h3>
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-[10px] uppercase tracking-widest animate-pulse">
                  {error}
                </div>
              )}
              <form onSubmit={handleSavePreset} className="space-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-linen-500">Preset Name</label>
                  <input 
                    required
                    value={editingPreset.name}
                    onChange={e => setEditingPreset({ ...editingPreset, name: e.target.value })}
                    className="w-full bg-linen-50 border border-linen-100 px-4 py-2 text-sm focus:outline-none focus:border-linen-900"
                    placeholder="e.g. Hand & Foot Colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-linen-500">Values (Comma separated for multiple)</label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input 
                        className="flex-1 bg-linen-50 border border-linen-100 px-4 py-2 text-sm focus:outline-none focus:border-linen-900"
                        placeholder="e.g. Gold, Silver, White"
                        value={presetInputValue}
                        onChange={e => setPresetInputValue(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addPresetValue();
                          }
                        }}
                      />
                      <button 
                        type="button"
                        onClick={addPresetValue}
                        className="bg-linen-100 px-4 text-[10px] font-bold uppercase tracking-widest hover:bg-linen-200 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 p-4 border border-linen-50 bg-linen-50/20 min-h-[60px]">
                      {editingPreset.values?.map((v, i) => (
                        <span key={i} className="text-[10px] bg-white border border-linen-100 px-2 py-1 rounded flex items-center gap-2">
                          {v}
                          <button 
                            type="button"
                            onClick={() => {
                              const newVals = editingPreset.values?.filter((_, idx) => idx !== i);
                              setEditingPreset({ ...editingPreset, values: newVals });
                            }}
                            className="text-linen-300 hover:text-red-500"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      {(!editingPreset.values || editingPreset.values.length === 0) && (
                        <p className="text-[10px] text-linen-300 italic">No values added yet</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setEditingPreset(null)}
                    className="flex-1 border border-linen-200 py-3 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-linen-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-linen-900 text-white py-3 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-linen-800"
                  >
                    Save Preset
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Discount Edit Modal */}
      <AnimatePresence>
        {editingDiscount && (
          <div className="fixed inset-0 bg-linen-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-8 border border-linen-200 shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-xl serif italic text-linen-900 mb-6">{editingDiscount.id ? 'Edit Discount' : 'New Discount'}</h3>
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-[10px] uppercase tracking-widest animate-pulse">
                  {error}
                </div>
              )}
              <form onSubmit={handleSaveDiscount} className="space-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-linen-500">Coupon Code</label>
                  <input 
                    required
                    className="w-full bg-linen-50 border border-linen-100 px-4 py-2 text-sm focus:outline-none focus:border-linen-900 uppercase"
                    placeholder="e.g. WELCOME10"
                    value={editingDiscount.code}
                    onChange={e => setEditingDiscount({ ...editingDiscount, code: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-linen-500">Type</label>
                    <select 
                      className="w-full bg-linen-50 border border-linen-100 px-4 py-2 text-sm focus:outline-none focus:border-linen-900"
                      value={editingDiscount.type}
                      onChange={e => setEditingDiscount({ ...editingDiscount, type: e.target.value as 'percentage' | 'fixed' })}
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (MOP)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-linen-500">Value</label>
                    <input 
                      type="number"
                      required
                      className="w-full bg-linen-50 border border-linen-100 px-4 py-2 text-sm focus:outline-none focus:border-linen-900"
                      value={editingDiscount.value}
                      onChange={e => setEditingDiscount({ ...editingDiscount, value: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-linen-500">Apply Discount to</label>
                    <button 
                      type="button"
                      onClick={() => {
                        const allIds = products.map(p => p.id);
                        const currentIds = editingDiscount.applicableProductIds || [];
                        if (currentIds.length === allIds.length) {
                          setEditingDiscount({ ...editingDiscount, applicableProductIds: [] });
                        } else {
                          setEditingDiscount({ ...editingDiscount, applicableProductIds: allIds });
                        }
                      }}
                      className="text-[9px] font-bold uppercase tracking-widest text-linen-400 hover:text-linen-900"
                    >
                      {editingDiscount.applicableProductIds?.length === products.length ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>
                  <div className="max-h-48 overflow-y-auto border border-linen-100 bg-linen-50/20 p-4 space-y-2">
                    {products.map(product => (
                      <label key={product.id} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox"
                          className="w-4 h-4 border-linen-200 text-linen-900 focus:ring-linen-900"
                          checked={editingDiscount.applicableProductIds?.includes(product.id)}
                          onChange={e => {
                            const currentIds = editingDiscount.applicableProductIds || [];
                            if (e.target.checked) {
                              setEditingDiscount({ ...editingDiscount, applicableProductIds: [...currentIds, product.id] });
                            } else {
                              setEditingDiscount({ ...editingDiscount, applicableProductIds: currentIds.filter(id => id !== product.id) });
                            }
                          }}
                        />
                        <span className="text-xs text-linen-700 group-hover:text-linen-900 transition-colors">{product.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setEditingDiscount(null)}
                    className="flex-1 border border-linen-200 py-3 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-linen-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-linen-900 text-white py-3 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-linen-800"
                  >
                    Save Discount
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Name Tag Font Edit Modal */}
      <AnimatePresence>
        {editingNameTagFont && (
          <div className="fixed inset-0 bg-linen-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-8 border border-linen-200 shadow-2xl max-w-md w-full"
            >
              <h3 className="text-xl serif italic text-linen-900 mb-6">{editingNameTagFont.id ? 'Edit Font' : 'New Font'}</h3>
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-[10px] uppercase tracking-widest animate-pulse">
                  {error}
                </div>
              )}
              <form onSubmit={handleSaveNameTagFont} className="space-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-linen-500">Font Name</label>
                  <input 
                    required
                    className="w-full bg-linen-50 border border-linen-100 px-4 py-2 text-sm focus:outline-none focus:border-linen-900"
                    placeholder="e.g. Classic Serif"
                    value={editingNameTagFont.name}
                    onChange={e => setEditingNameTagFont({ ...editingNameTagFont, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-linen-500">Font Style Image</label>
                  <div 
                    onClick={() => !uploading && fileInputRef.current?.click()}
                    className={`aspect-[3/2] border-2 border-dashed border-linen-100 flex flex-col items-center justify-center cursor-pointer hover:bg-linen-50 transition-all overflow-hidden relative ${uploading ? 'opacity-50 cursor-wait' : ''}`}
                  >
                    {editingNameTagFont.imageUrl ? (
                      <img 
                        src={editingNameTagFont.imageUrl} 
                        alt="Preview" 
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="text-center p-4">
                        <svg className="w-8 h-8 text-linen-200 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-linen-400">Click to upload or PASTE font preview</p>
                      </div>
                    )}
                    {uploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/50">
                        <div className="w-6 h-6 border-2 border-linen-900 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setEditingNameTagFont(null)}
                    className="flex-1 border border-linen-200 py-3 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-linen-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={uploading || !editingNameTagFont.imageUrl}
                    className="flex-1 bg-linen-900 text-white py-3 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-linen-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save Font
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductSettings;
