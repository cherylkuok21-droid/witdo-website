
import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';

interface WorkOrderFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: any;
}

const WorkOrderForm: React.FC<WorkOrderFormProps> = ({ onSuccess, onCancel, initialData }) => {
  const [formData, setFormData] = useState({
    customerName: initialData?.customerName || '',
    contactInfo: initialData?.contactInfo || '',
    babyName: initialData?.babyName || '',
    babyAge: initialData?.babyAge || '',
    castingType: initialData?.castingType || 'both',
    frameChoice: initialData?.frameChoice || '',
    materialChoice: initialData?.materialChoice || '',
    notes: initialData?.notes || '',
    status: initialData?.status || 'pending',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      if (initialData?.id) {
        // Update existing order
        const { id, ...updateData } = initialData;
        await setDoc(doc(db, 'workOrders', initialData.id), {
          ...formData,
          updatedAt: serverTimestamp(),
          ownerUid: auth.currentUser.uid,
        }, { merge: true });
      } else {
        // Create new order
        await addDoc(collection(db, 'workOrders'), {
          ...formData,
          orderDate: serverTimestamp(),
          ownerUid: auth.currentUser.uid,
        });
      }
      onSuccess();
    } catch (err: any) {
      console.error('Error saving work order:', err);
      setError('Failed to save work order. Check permissions.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white p-8 border border-linen-200 shadow-xl max-w-2xl mx-auto w-full"
    >
      <div className="mb-8 border-b border-linen-100 pb-4">
        <h2 className="text-2xl serif italic text-linen-900">New Work Order</h2>
        <p className="text-[10px] uppercase tracking-widest text-linen-400 mt-1">Baby Hand & Foot Casting</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-linen-500">Customer Name</label>
            <input 
              required
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              className="w-full bg-linen-50 border border-linen-100 px-4 py-2 text-sm focus:outline-none focus:border-linen-900 transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-linen-500">Contact Info</label>
            <input 
              required
              name="contactInfo"
              value={formData.contactInfo}
              onChange={handleChange}
              className="w-full bg-linen-50 border border-linen-100 px-4 py-2 text-sm focus:outline-none focus:border-linen-900 transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-linen-500">Baby's Name</label>
            <input 
              required
              name="babyName"
              value={formData.babyName}
              onChange={handleChange}
              className="w-full bg-linen-50 border border-linen-100 px-4 py-2 text-sm focus:outline-none focus:border-linen-900 transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-linen-500">Baby's Age</label>
            <input 
              name="babyAge"
              value={formData.babyAge}
              onChange={handleChange}
              className="w-full bg-linen-50 border border-linen-100 px-4 py-2 text-sm focus:outline-none focus:border-linen-900 transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-linen-500">Casting Type</label>
            <select 
              name="castingType"
              value={formData.castingType}
              onChange={handleChange}
              className="w-full bg-linen-50 border border-linen-100 px-4 py-2 text-sm focus:outline-none focus:border-linen-900 transition-colors"
            >
              <option value="hands">Hands Only</option>
              <option value="feet">Feet Only</option>
              <option value="both">Both Hands & Feet</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-linen-500">Frame Choice</label>
            <input 
              name="frameChoice"
              value={formData.frameChoice}
              onChange={handleChange}
              className="w-full bg-linen-50 border border-linen-100 px-4 py-2 text-sm focus:outline-none focus:border-linen-900 transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-linen-500">Material/Color</label>
            <input 
              name="materialChoice"
              value={formData.materialChoice}
              onChange={handleChange}
              className="w-full bg-linen-50 border border-linen-100 px-4 py-2 text-sm focus:outline-none focus:border-linen-900 transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-linen-500">Order Status</label>
            <select 
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full bg-linen-50 border border-linen-100 px-4 py-2 text-sm focus:outline-none focus:border-linen-900 transition-colors"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-linen-500">Notes</label>
          <textarea 
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full h-32 bg-linen-50 border border-linen-100 p-4 text-sm serif italic focus:outline-none focus:border-linen-900 transition-colors"
          ></textarea>
        </div>

        {error && <p className="text-red-500 text-[10px] uppercase tracking-widest">{error}</p>}

        <div className="flex gap-4 pt-4">
          <button 
            type="button"
            onClick={onCancel}
            className="flex-1 border border-linen-200 py-3 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-linen-50 transition-all"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={loading}
            className="flex-1 bg-linen-900 text-linen-50 py-3 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-linen-800 transition-all disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Order'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default WorkOrderForm;
