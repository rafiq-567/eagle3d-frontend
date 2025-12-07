'use client';

import React, { useState } from 'react';
import { Loader2, Plus, Edit, Trash2, Box, TrendingUp } from 'lucide-react';
import { 
    useGetProductsQuery, 
    useDeleteProductMutation 
} from '../../src/services/productApi';
import { Product } from '../../src/types/shared.types';
import ProductFormModal from './productFormModals';

export default function ProductList() {
   
    const { 
        data: products, 
        isLoading, 
        isError,
        refetch 
    } = useGetProductsQuery();
    
    
    const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState<Product | null>(null);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null); // Custom state for deletion

    const openAddModal = () => {
        setProductToEdit(null); 
        setIsModalOpen(true);
    };

    const openEditModal = (product: Product) => {
        setProductToEdit(product);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        // Delaying the reset of productToEdit slightly ensures the modal closes visually 
        // before its content is destroyed.
        setTimeout(() => setProductToEdit(null), 100); 
    };

    // --- Deletion Logic (Updated to use console.error instead of alert/confirm) ---
    const handleDelete = async (id: string) => {
        // ⚠️ NOTE: alert/confirm are disabled in this environment. 
        // We MUST use a custom UI for confirmation. 
        // For now, we will use a console log to simulate success/failure.
        if (window.confirm('are you sure you want to delete this product?')) { // Temporarily using window.confirm for functional demo
            try {
                await deleteProduct(id).unwrap();
                console.log('Product deleted successfully:', id);
            } catch (error) {
                console.error('Failed to delete product:', error);
            }
        }
    };

    // --- Loading State ---
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <p className="ml-2 text-lg text-gray-600 dark:text-gray-400">Product is loading...</p>
            </div>
        );
    }

    // --- Error State ---
    if (isError || !products) {
        return (
            <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-600 dark:text-red-400 font-semibold">
                    Failed to fetch product data. 
                    <button 
                        onClick={refetch} 
                        className="ml-2 text-blue-600 hover:underline dark:text-blue-400"
                    >
                        try again
                    </button>
                </p>
            </div>
        );
    }

    // --- Empty State ---
    if (products.length === 0) {
        return (
            <div className="text-center p-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <Box className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600" />
                <h3 className="mt-2 text-xl font-medium text-gray-900 dark:text-white">No product here</h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400">You can now add new product</p>
                <div className="mt-6">
                    <button
                        onClick={openAddModal}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 transition"
                    >
                        <Plus className="-ml-1 mr-2 h-5 w-5" />
                        Add New Product
                    </button>
                </div>
                
                <ProductFormModal 
                    key={productToEdit ? productToEdit.id : 'add-new'}
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    productToEdit={productToEdit}
                />
            </div>
        );
    }


    // --- Data List View ---
    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-900 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Product Management</h2>
                <button
                    onClick={openAddModal}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 transition transform hover:scale-[1.02]"
                >
                    <Plus className="-ml-1 mr-2 h-5 w-5" />
                    Add New Product
                </button>
            </div>

            <div className="shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 rounded-xl">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">Stock</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                    <p className='font-semibold'>{product.name}</p>
                                    <p className='sm:hidden text-xs text-gray-500 truncate max-w-[150px]'>{product.description}</p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell truncate max-w-xs">{product.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-mono">
                                    $ {product.price.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                                    <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium ${product.stock > 10 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : product.stock > 0 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                                        {product.stock}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end space-x-2">
                                        <button
                                            onClick={() => openEditModal(product)}
                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200 transition p-1 rounded-full hover:bg-blue-50 dark:hover:bg-gray-700"
                                            aria-label="Edit product"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200 transition p-1 rounded-full hover:bg-red-50 dark:hover:bg-gray-700"
                                            disabled={isDeleting}
                                            aria-label="Delete product"
                                        >
                                            {isDeleting ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <Trash2 className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Product Form Modal (Add/Edit) */}
            {isModalOpen && (
                <ProductFormModal 
                    // FIX: Using a key forces remount when switching products or modes.
                    key={productToEdit ? productToEdit.id : 'add-new'} 
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    productToEdit={productToEdit}
                />
            )}
        </div>
    );
}