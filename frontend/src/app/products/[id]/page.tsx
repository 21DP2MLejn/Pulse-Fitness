'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import { FiMinus, FiPlus, FiStar, FiShoppingCart, FiHeart, FiCheck } from 'react-icons/fi';
import type { Product } from '@/types/product';
import { toast } from 'react-hot-toast';
import { useLanguage } from '@/context/LanguageContext';
import { API_URL, API_BASE_URL } from '@/config/api';

export default function ProductPage({ params }: { params: { id: string } }) {
  const { theme } = useTheme();
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const isDark = theme === 'dark';
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/products/${params.id}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch product');
        }
        return res.json();
      })
      .then(data => {
        console.log('Product fetched:', data);
        if (data.data) {
          setProduct(data.data);
        } else {
          setProduct(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch product:', err);
        setLoading(false);
      });
  }, [params.id]);

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, Math.min(prev + delta, product?.stock || 1)));
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart(product, quantity);
    
    setAddedToCart(true);
    toast.success(`${product.name} ${t('products.addedToCart')}`);
    
    setTimeout(() => {
      setAddedToCart(false);
    }, 2000);
  };

  if (loading || !product) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const reviews = product.reviews || [];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8`}>
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square relative rounded-lg overflow-hidden shadow-md">
              <Image
                src={product.images && product.images.length > 0 
                  ? `${API_BASE_URL}/api/images/${product.images[selectedImage].replace(/^\/storage\//, '')}`
                  : '/images/placeholder.jpg'}
                alt={product.name}
                fill
                className="object-cover transition-transform hover:scale-105 duration-500"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images && product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square relative rounded-lg overflow-hidden transition-all duration-200 ${
                    selectedImage === index ? 'ring-2 ring-indigo-600 scale-105' : 'hover:opacity-80'
                  }`}
                >
                  <Image
                    src={image ? `${API_BASE_URL}/api/images/${image.replace(/^\/storage\//, '')}` : '/images/placeholder.jpg'}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
              </div>
              <p className="text-2xl font-bold text-indigo-600 mb-4">
                ${typeof product.price === 'number' 
                  ? product.price.toFixed(2) 
                  : parseFloat(product.price).toFixed(2)}
              </p>
              <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {product.description}
              </p>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-3">{t('products.features')}</h2>
                <ul className={`list-disc pl-5 space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-3">{t('products.specifications')}</h2>
                <div className={`grid grid-cols-2 gap-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key}>
                      <span className="font-medium">{key}:</span> {value}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <div className="flex items-center gap-4">
              <div className={`flex items-center rounded-lg border ${
                isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
              }`}>
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className={`p-2 ${quantity <= 1 ? 'text-gray-400' : ''}`}
                  disabled={quantity <= 1}
                >
                  <FiMinus />
                </button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className={`p-2 ${quantity >= (product.stock || 1) ? 'text-gray-400' : ''}`}
                  disabled={quantity >= (product.stock || 1)}
                >
                  <FiPlus />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={addedToCart}
                className={`flex-grow py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                  addedToCart 
                    ? 'bg-green-500 text-white' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {addedToCart ? (
                  <>
                    <FiCheck />
                    {t('products.addedToCart')}
                  </>
                ) : (
                  <>
                    <FiShoppingCart />
                    {t('products.addToCart')}
                  </>
                )}
              </button>
            </div>

            {/* Stock Status */}
            <p className={`text-sm ${
              (product.stock || 0) > 0
                ? 'text-green-500'
                : 'text-red-500'
            }`}>
              {(product.stock || 0) > 0
                ? `${product.stock} ${t('products.inStock')}`
                : t('products.outOfStock')
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
