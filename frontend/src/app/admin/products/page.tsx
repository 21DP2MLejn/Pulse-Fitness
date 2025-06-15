'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import type { Product } from '@/types/product';
import toast from 'react-hot-toast';
import { API_URL } from '@/config/api';

export default function AdminProductsPage() {
  const { theme } = useTheme();
  const { getToken } = useAuth();
  const isDark = theme === 'dark';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = getToken();
      if (!token) {
        console.error('No authentication token found');
        toast.error('Authentication error. Please log in again.');
        return;
      }
      
      console.log('Fetching products with token');
      const response = await fetch(`${API_URL}/get-products`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      console.log('Products fetched:', data);
      
      // Check if the response has the expected structure
      if (data.data) {
        setProducts(data.data);
      } else {
        // Handle legacy response format
        setProducts(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Failed to fetch products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = getToken();
      if (!token) {
        console.error('No authentication token found');
        toast.error('Authentication error. Please log in again.');
        return;
      }
      
      const response = await fetch(`${API_URL}/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setProducts(prev => prev.filter(p => p.id !== productId));
        toast.success('Product deleted successfully');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete product');
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className={`container mx-auto px-4 py-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <FiPlus /> Add Product
        </Link>
      </div>

      <div className="mb-6 relative">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
            isDark
              ? 'bg-gray-800 border-gray-700 text-white'
              : 'bg-white border-gray-300'
          }`}
        />
      </div>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className={`w-full border-collapse ${isDark ? 'text-white' : 'text-gray-900'}`}>
          <thead>
            <tr className={isDark ? 'bg-gray-800' : 'bg-gray-50'}>
              <th className="px-4 py-3 text-left">Image</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-left">Stock</th>
              <th className="px-4 py-3 text-left">Rating</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className={isDark ? 'bg-gray-900' : 'bg-white'}>
            {filteredProducts.map((product) => (
              <tr
                key={product.id}
                className={`border-t ${
                  isDark ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'
                } transition-colors`}
              >
                <td className="px-4 py-3">
                  <div className="relative w-16 h-16">
                    <Image
                      src={product.images[0] || '/images/placeholder.jpg'}
                      alt={product.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                </td>
                <td className="px-4 py-3">{product.name}</td>
                <td className="px-4 py-3">{product.category}</td>
                <td className="px-4 py-3">
                  ${typeof product.price === 'number' 
                    ? product.price.toFixed(2) 
                    : parseFloat(product.price).toFixed(2)}
                </td>
                <td className="px-4 py-3">{product.stock}</td>
                <td className="px-4 py-3">
                  {typeof product.rating === 'number' 
                    ? product.rating.toFixed(1) 
                    : parseFloat(product.rating || '0').toFixed(1)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="p-2 text-blue-500 hover:text-blue-600 transition-colors"
                    >
                      <FiEdit2 />
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 text-red-500 hover:text-red-600 transition-colors"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredProducts.length === 0 && (
          <div className={`text-center py-8 ${isDark ? 'bg-gray-900' : 'bg-white'} rounded-b-lg`}>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              No products found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
