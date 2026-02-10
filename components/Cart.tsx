import React, { useState } from 'react';
import { CartItem, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface CartProps {
  cart: CartItem[];
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  lang: Language;
}

export const Cart: React.FC<CartProps> = ({ cart, updateQuantity, removeFromCart, clearCart, lang }) => {
  const t = TRANSLATIONS[lang];
  const [isOrdering, setIsOrdering] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 0 ? 40 : 0;
  const total = subtotal + deliveryFee;

  const handleCheckout = () => {
    setIsOrdering(true);
    // Simulate API call
    setTimeout(() => {
        setIsOrdering(false);
        setShowSuccess(true);
        setTimeout(() => {
            clearCart();
            setShowSuccess(false);
        }, 3000);
    }, 2000);
  };

  if (showSuccess) {
      return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950 p-6 animate-fade-in">
              <div className="w-24 h-24 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-12 h-12 text-green-600 dark:text-green-400 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">{t.order_success}</h2>
              <p className="text-gray-500 dark:text-gray-400 text-center">Your fresh produce will arrive soon.</p>
          </div>
      );
  }

  return (
    <div className="pb-24 pt-6 px-4 bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t.cart}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{cart.length} items</p>
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 opacity-50">
            <span className="text-6xl mb-4">🛒</span>
            <p className="text-gray-900 dark:text-white font-medium">{t.empty_cart}</p>
        </div>
      ) : (
        <>
            <div className="space-y-4 mb-8">
                {cart.map((item) => (
                    <div key={item.id} className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex gap-4 animate-fade-in">
                        <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                            {item.image}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-gray-900 dark:text-white">{item.name}</h3>
                                <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500">&times;</button>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{item.description}</p>
                            <div className="flex justify-between items-end">
                                <span className="font-bold text-farm-600 dark:text-farm-400">₹{item.price * item.quantity}</span>
                                <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 rounded-lg px-2 py-1">
                                    <button onClick={() => updateQuantity(item.id, -1)} className="w-5 text-center font-bold text-gray-600 dark:text-gray-300">-</button>
                                    <span className="text-sm font-bold w-4 text-center dark:text-white">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, 1)} className="w-5 text-center font-bold text-gray-600 dark:text-gray-300">+</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-800">
                <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>Subtotal</span>
                        <span>₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>Delivery</span>
                        <span>₹{deliveryFee}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                         <span>{t.est_delivery}</span>
                         <span className="font-medium text-farm-600 dark:text-farm-400">2-3 {t.days}</span>
                    </div>
                    <div className="border-t border-gray-100 dark:border-gray-700 my-2 pt-2 flex justify-between font-bold text-lg text-gray-900 dark:text-white">
                        <span>{t.total}</span>
                        <span>₹{total}</span>
                    </div>
                </div>
                <button 
                    onClick={handleCheckout}
                    disabled={isOrdering}
                    className="w-full bg-farm-600 hover:bg-farm-700 text-white font-bold py-4 rounded-xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                    {isOrdering ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <>
                            <span>{t.place_order}</span>
                            <span>→</span>
                        </>
                    )}
                </button>
            </div>
        </>
      )}
    </div>
  );
};