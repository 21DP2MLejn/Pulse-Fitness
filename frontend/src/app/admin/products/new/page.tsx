'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { FiUpload, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { API_URL } from '@/config/api';

export default function NewProductPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const { getToken } = useAuth();
  const isDark = theme === 'dark';
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    features: [''],
    specifications: {} as { [key: string]: string },
  });
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(prev => [...prev, ...files]);

    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const addSpecification = () => {
    if (specKey && specValue) {
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specKey]: specValue,
        },
      }));
      setSpecKey('');
      setSpecValue('');
    }
  };

  const removeSpecification = (key: string) => {
    const newSpecs = { ...formData.specifications };
    delete newSpecs[key];
    setFormData(prev => ({ ...prev, specifications: newSpecs }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validate form
      if (!formData.name || !formData.description || !formData.price || !formData.category || !formData.stock) {
        toast.error('Please fill in all required fields');
        setLoading(false);
        return;
      }
      
      // Create FormData object
      const productData = new FormData();
      productData.append('name', formData.name);
      productData.append('description', formData.description);
      productData.append('price', formData.price.toString());
      productData.append('category', formData.category);
      productData.append('stock', formData.stock.toString());
      
      // Add features
      formData.features.forEach((feature, index) => {
        if (feature.trim()) {
          productData.append(`features[${index}]`, feature);
        }
      });
      
      // Add specifications
      Object.entries(formData.specifications).forEach(([key, value]) => {
        productData.append(`specifications[${key}]`, value);
      });
      
      // Add images
      if (images.length > 0) {
        images.forEach(image => {
          productData.append('images[]', image);
        });
      }
      
      const token = getToken();
      if (!token) {
        toast.error('Authentication error. Please log in again.');
        setLoading(false);
        return;
      }
      
      console.log('Sending product data to server with token:', token);
      
      // Using XMLHttpRequest instead of fetch for better FormData handling
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        // Using the new direct endpoint that bypasses the abilities middleware
        xhr.open('POST', `${API_URL}/create-product`, true);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        
        xhr.onload = function() {
          if (xhr.status >= 200 && xhr.status < 300) {
            console.log('Product created successfully:', xhr.responseText);
            toast.success('Product created successfully!');
            router.push('/admin/products');
            resolve(xhr.response);
          } else {
            console.error('Error creating product:', xhr.status, xhr.statusText, xhr.responseText);
            let errorMessage = 'Failed to create product';
            try {
              const response = JSON.parse(xhr.responseText);
              errorMessage = response.message || errorMessage;
            } catch (e) {
              console.error('Error parsing error response:', e);
            }
            toast.error(errorMessage);
            reject(new Error(errorMessage));
          }
          setLoading(false);
        };
        
        xhr.onerror = function() {
          console.error('Network error occurred');
          toast.error('Network error. Please check your connection.');
          setLoading(false);
          reject(new Error('Network error'));
        };
        
        xhr.send(productData);
      });
      
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Error creating product. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className={`container mx-auto px-4 py-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
      <h1 className="text-3xl font-bold mb-8">Create New Product</h1>

      <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={`w-full p-2 rounded-lg border ${
                isDark
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-300'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Category</label>
            <select
              required
              value={formData.category}
              onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className={`w-full p-2 rounded-lg border ${
                isDark
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-300'
              }`}
            >
              <option value="">Select a category</option>
              <option value="Equipment">Equipment</option>
              <option value="Supplements">Supplements</option>
              <option value="Apparel">Apparel</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Price</label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.price}
              onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
              className={`w-full p-2 rounded-lg border ${
                isDark
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-300'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Stock</label>
            <input
              type="number"
              required
              value={formData.stock}
              onChange={e => setFormData(prev => ({ ...prev, stock: e.target.value }))}
              className={`w-full p-2 rounded-lg border ${
                isDark
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-300'
              }`}
            />
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Description</label>
          <textarea
            required
            rows={4}
            value={formData.description}
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className={`w-full p-2 rounded-lg border ${
              isDark
                ? 'bg-gray-800 border-gray-700 text-white'
                : 'bg-white border-gray-300'
            }`}
          />
        </div>

        {/* Features */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Features</label>
          <div className="space-y-2">
            {formData.features.map((feature, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={feature}
                  onChange={e => handleFeatureChange(index, e.target.value)}
                  className={`flex-grow p-2 rounded-lg border ${
                    isDark
                      ? 'bg-gray-800 border-gray-700 text-white'
                      : 'bg-white border-gray-300'
                  }`}
                  placeholder="Enter a feature"
                />
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="p-2 text-red-500 hover:text-red-600"
                >
                  <FiX />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addFeature}
            className={`mt-2 text-primary hover:text-primary/90 ${isDark ? 'hover:text-white' : ''}`}
          >
            + Add Feature
          </button>
        </div>

        {/* Specifications */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Specifications</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
            <input
              type="text"
              value={specKey}
              onChange={e => setSpecKey(e.target.value)}
              placeholder="Specification name"
              className={`p-2 rounded-lg border ${
                isDark
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-300'
              }`}
            />
            <div className="flex gap-2">
              <input
                type="text"
                value={specValue}
                onChange={e => setSpecValue(e.target.value)}
                placeholder="Specification value"
                className={`flex-grow p-2 rounded-lg border ${
                  isDark
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={addSpecification}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                Add
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {Object.entries(formData.specifications).map(([key, value]) => (
              <div
                key={key}
                className={`flex justify-between items-center p-2 rounded-lg ${
                  isDark ? 'bg-gray-800 text-white' : 'bg-gray-100'
                }`}
              >
                <span>
                  <strong>{key}:</strong> {value}
                </span>
                <button
                  type="button"
                  onClick={() => removeSpecification(key)}
                  className="text-red-500 hover:text-red-600"
                >
                  <FiX />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Images */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Images</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative aspect-square">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <FiX />
                </button>
              </div>
            ))}
            <label className={`aspect-square flex items-center justify-center border-2 border-dashed rounded-lg cursor-pointer ${
              isDark
                ? 'border-gray-700 hover:border-gray-600'
                : 'border-gray-300 hover:border-gray-400'
            }`}>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
              <FiUpload className={`w-8 h-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
            </label>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 bg-primary text-white rounded-lg ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90'
            }`}
          >
            {loading ? 'Creating...' : 'Create Product'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className={`px-6 py-2 border rounded-lg ${
              isDark
                ? 'border-gray-700 hover:bg-gray-800 text-white'
                : 'border-gray-300 hover:bg-gray-100'
            }`}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
