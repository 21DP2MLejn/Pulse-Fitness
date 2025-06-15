'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import Image from 'next/image';
import { FiSearch, FiShoppingCart } from 'react-icons/fi';
import type { Product } from '@/types/product';
import { API_URL, API_BASE_URL } from '@/config/api';

export default function ProductsPage() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const isDark = theme === 'dark';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc'>('price-asc');

  useEffect(() => {
    // Fetch products from the API
    fetch(`${API_URL}/products`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }
        return res.json();
      })
      .then(data => {
        console.log('Products fetched:', data);
        // Check if the response has the expected structure
        if (data.data) {
          setProducts(data.data);
        } else if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error('Unexpected response format:', data);
          setProducts([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch products:', err);
        setLoading(false);
      });
  }, []);

  const categories = ['all', 'Equipment', 'Supplements', 'Apparel', 'Accessories'];

  const filteredProducts = products
    .filter(product => 
      (selectedCategory === 'all' || product.category === selectedCategory) &&
      (product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       product.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Search and Filter Section - Simplified */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-center mb-4">
          <div className="relative flex-grow">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t('products.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                isDark
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-300'
              }`}
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'price-asc' | 'price-desc')}
            className={`py-2 px-4 rounded-lg border ${
              isDark
                ? 'bg-gray-800 border-gray-700 text-white'
                : 'bg-white border-gray-300'
            }`}
          >
            <option value="price-asc">{t('products.sort.priceAsc') || 'Price: Low to High'}</option>
            <option value="price-desc">{t('products.sort.priceDesc') || 'Price: High to Low'}</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-1 rounded-full text-sm transition-colors ${
                selectedCategory === category
                  ? 'bg-primary text-white'
                  : isDark
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category === 'all' ? t('products.filter') : t(`products.category.${category.toLowerCase()}`) || (category.charAt(0).toUpperCase() + category.slice(1))}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid - Minimalistic */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Link 
            key={product.id}
            href={`/products/${product.id}`}
            className={`block rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
              isDark ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div className="aspect-square relative">
              <Image
                src={product.images && product.images.length > 0 
                  ? `${API_BASE_URL}/api/images/${product.images[0].replace(/^\/storage\//, '')}`
                  : '/images/placeholder.jpg'}
                alt={product.name}
                fill
                className="object-cover"
              />
              <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 rounded-full p-1 shadow-sm">
                <FiShoppingCart className="text-primary" size={16} />
              </div>
            </div>
            <div className="p-3">
              <h3 className={`font-medium text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>{product.name}</h3>
              <div className="flex items-center justify-between mt-2">
                <span className="font-bold text-primary">
                  €{typeof product.price === 'number' 
                    ? product.price.toFixed(2) 
                    : parseFloat(product.price).toFixed(2)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-8">
          <p>{t('products.noProductsFound') || 'No products found matching your criteria.'}</p>
        </div>
      )}
    </div>
  );
}
