'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, X, PlusCircle, Save } from 'lucide-react';
import { AddProductPayload, Product } from '../types/shared.types';
import { useAddProductMutation, useUpdateProductMutation } from '../services/productApi';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit: Product | null; 
}

const initialFormState: AddProductPayload = {
  name: '',
  description: '',
  price: 0,
  stock: 0,
};

export default function ProductFormModal({ 
  isOpen, 
  onClose, 
  productToEdit 
}: ProductFormModalProps) {
  const isEditMode = !!productToEdit;
  
  // Initialize form data based on edit mode
  const getInitialFormData = (): AddProductPayload => {
    if (isEditMode && productToEdit) {
      return {
        name: productToEdit.name,
        description: productToEdit.description || '',
        price: productToEdit.price,
        stock: productToEdit.stock,
      };
    }
    return initialFormState;
  };

  const [formData, setFormData] = useState<AddProductPayload>(getInitialFormData);
  
  // RTK Query Mutations
  const [addProduct, { isLoading: isAdding, isSuccess: isAddSuccess }] = useAddProductMutation();
  const [updateProduct, { isLoading: isUpdating, isSuccess: isUpdateSuccess }] = useUpdateProductMutation();
  
  const isLoading = isAdding || isUpdating;

  // Reset form when modal opens/closes or when productToEdit changes
  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormData());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, productToEdit?.id]); // Only depend on modal state and product ID

  // Close modal on success
  useEffect(() => {
    if (isAddSuccess || isUpdateSuccess) {
      onClose();
      setFormData(initialFormState);
    }
  }, [isAddSuccess, isUpdateSuccess, onClose]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditMode && productToEdit) {
        await updateProduct({ id: productToEdit.id, data: formData }).unwrap();
      } else {
        await addProduct(formData).unwrap();
      }
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-3xl w-full max-w-lg transform transition-all overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            {isEditMode ? (
              <Save className="w-5 h-5 mr-2 text-blue-500" />
            ) : (
              <PlusCircle className="w-5 h-5 mr-2 text-green-500" />
            )}
            {isEditMode ? 'Edit the product' : 'Add new product'}
          </h3>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
            onClick={onClose}
            disabled={isLoading}
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body (Form) */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Product Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Product name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Detailed description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              required
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Price
              </label>
              <input
                id="price"
                name="price"
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
              />
            </div>

            {/* Stock */}
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Stock number
              </label>
              <input
                id="stock"
                name="stock"
                type="number"
                required
                min="0"
                value={formData.stock}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Modal Footer (Submit Button) */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="submit"
              className="w-full flex justify-center items-center px-4 py-2 rounded-lg text-white font-medium bg-blue-600 hover:bg-blue-700 transition duration-150 ease-in-out disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <>{isEditMode ? 'Save changes' : 'Create the product'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}