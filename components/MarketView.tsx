import React, { useState, useEffect, useMemo } from 'react';
import { FARMER_MARKET_LISTINGS, TRANSLATIONS, getMarketPricesForLocation, getInputProducts, getFarmerMarketListings } from '../constants';
import { Language, FarmerListing, UserRole, InputProduct, MarketItem } from '../types';

interface MarketViewProps {
  lang: Language;
  onOpenMenu: () => void;
  userRole: UserRole;
  onAddToCart: (item: InputProduct) => void;
  location: string;
}

type Tab = 'rates' | 'sell' | 'buy';

export const MarketView: React.FC<MarketViewProps> = ({ lang, onOpenMenu, userRole, onAddToCart, location }) => {
  const t = TRANSLATIONS[lang];
  const [activeTab, setActiveTab] = useState<Tab>(userRole === 'consumer' ? 'buy' : 'rates');
  const [marketPrices, setMarketPrices] = useState<MarketItem[]>([]);
  
  useEffect(() => {
      setMarketPrices(getMarketPricesForLocation(location, lang));
  }, [location, lang]);

  // Dynamic input products based on language
  const inputProducts = useMemo(() => getInputProducts(lang), [lang]);
  const consumerProducts = useMemo(() => getFarmerMarketListings(lang), [lang]);

  // State for Selling (Farmer only)
  const [myListings, setMyListings] = useState<FarmerListing[]>([
      { id: '101', crop: 'Onion', quantity: '50 Quintal', price: '₹1800/Q', date: '2 days ago' }
  ]);
  const [showSellForm, setShowSellForm] = useState(false);
  const [newListing, setNewListing] = useState({ crop: '', quantity: '', price: '' });

  const handlePostListing = (e: React.FormEvent) => {
      e.preventDefault();
      if(newListing.crop && newListing.price) {
          setMyListings([{
              id: Date.now().toString(),
              crop: newListing.crop,
              quantity: newListing.quantity,
              price: newListing.price,
              date: 'Just now'
          }, ...myListings]);
          setNewListing({ crop: '', quantity: '', price: '' });
          setShowSellForm(false);
          alert(t.listing_success || "Posted!");
      }
  };

  const productsToShow = userRole === 'farmer' ? inputProducts : consumerProducts;
  const buyTitle = userRole === 'farmer' ? t.buy_title : t.consumer_buy_title;
  const buySubtitle = userRole === 'farmer' ? 'Quality Inputs, Best Prices' : 'Direct from local farmers';

  return (
    <div className="pb-24 pt-6 bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors duration-300 flex flex-col">
      {/* Header with Tabs */}
      <div className="px-4 mb-4">
        <div className="flex justify-between items-center mb-4">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{userRole === 'consumer' ? t.shop : t.market_pulse}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {userRole === 'consumer' ? 'Fresh Local Produce' : `Rates for ${location.split(',')[0]}`}
                </p>
            </div>
            <div className="flex gap-3">
                <button 
                    onClick={onOpenMenu}
                    className="w-10 h-10 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-full flex items-center justify-center text-gray-700 dark:text-white"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>
            </div>
        </div>

        {/* Custom Tabs - Only show for Farmers. Consumers just see the shop. */}
        {userRole === 'farmer' && (
            <div className="bg-white dark:bg-gray-900 p-1 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex">
                {(['rates', 'sell', 'buy'] as Tab[]).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                            activeTab === tab 
                            ? 'bg-farm-600 text-white shadow-md' 
                            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                    >
                        {t[`tab_${tab}`]}
                    </button>
                ))}
            </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 px-4 overflow-y-auto no-scrollbar">
        
        {/* RATES TAB (Farmer Only) */}
        {activeTab === 'rates' && userRole === 'farmer' && (
             <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden animate-fade-in">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                        <tr>
                            <th className="px-4 py-3 font-medium">Crop</th>
                            <th className="px-4 py-3 font-medium">Mandi</th>
                            <th className="px-4 py-3 font-medium text-right">Price</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {marketPrices.map((item, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <td className="px-4 py-3">
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{item.crop}</p>
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                        item.trend === 'up' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                                        item.trend === 'down' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                    }`}>
                                        {item.trend.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">
                                    {item.mandi}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <p className="font-bold text-gray-900 dark:text-white">₹{item.price}</p>
                                    <p className="text-xs text-gray-400">{item.unit}</p>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
        )}

        {/* SELL TAB (Farmer Only) */}
        {activeTab === 'sell' && userRole === 'farmer' && (
            <div className="space-y-4 animate-fade-in">
                {!showSellForm ? (
                    <>
                        <div className="bg-farm-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                             <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-4 translate-y-4">
                                 <span className="text-8xl">📢</span>
                             </div>
                             <h3 className="text-xl font-bold mb-1">{t.sell_title}</h3>
                             <p className="text-farm-100 text-sm mb-4 opacity-90">Reach thousands of buyers directly.</p>
                             <button 
                                onClick={() => setShowSellForm(true)}
                                className="bg-white text-farm-700 font-bold py-2 px-4 rounded-xl text-sm shadow-md active:scale-95 transition-transform"
                             >
                                + {t.create_listing}
                             </button>
                        </div>

                        <div>
                            <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase mb-3 ml-1">{t.your_listings}</h4>
                            {myListings.length === 0 ? (
                                <p className="text-center text-gray-400 py-8">No active listings.</p>
                            ) : (
                                <div className="space-y-3">
                                    {myListings.map((listing) => (
                                        <div key={listing.id} className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex justify-between items-center">
                                            <div>
                                                <h5 className="font-bold text-gray-900 dark:text-white">{listing.crop}</h5>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{listing.quantity} • {listing.date}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-farm-600 dark:text-farm-400">{listing.price}</p>
                                                <span className="text-[10px] bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full">Active</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">{t.create_listing}</h3>
                            <button onClick={() => setShowSellForm(false)} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
                        </div>
                        <form onSubmit={handlePostListing} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Crop Name</label>
                                <input 
                                    type="text" 
                                    required
                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-farm-500 outline-none"
                                    placeholder="e.g. Wheat, Onion"
                                    value={newListing.crop}
                                    onChange={(e) => setNewListing({...newListing, crop: e.target.value})}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Quantity</label>
                                    <input 
                                        type="text" 
                                        required
                                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-farm-500 outline-none"
                                        placeholder="e.g. 10 Qtl"
                                        value={newListing.quantity}
                                        onChange={(e) => setNewListing({...newListing, quantity: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Price</label>
                                    <input 
                                        type="text" 
                                        required
                                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-farm-500 outline-none"
                                        placeholder="e.g. ₹2000"
                                        value={newListing.price}
                                        onChange={(e) => setNewListing({...newListing, price: e.target.value})}
                                    />
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-farm-600 text-white font-bold py-3.5 rounded-xl shadow-lg mt-2">
                                Post Listing
                            </button>
                        </form>
                    </div>
                )}
            </div>
        )}

        {/* BUY TAB (Shared by both, but different data) */}
        {activeTab === 'buy' && (
            <div className="animate-fade-in">
                <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{buyTitle}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{buySubtitle}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                    {productsToShow.map((product) => (
                        <div key={product.id} className="bg-white dark:bg-gray-900 p-3 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-between h-full group">
                            <div>
                                <div className="aspect-square bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center text-4xl mb-3 group-hover:scale-105 transition-transform">
                                    {product.image}
                                </div>
                                <div className="mb-2">
                                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${userRole === 'consumer' ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600'}`}>
                                        {product.category}
                                    </span>
                                </div>
                                <h4 className="font-bold text-sm text-gray-900 dark:text-white leading-tight mb-1">{product.name}</h4>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-snug">{product.description}</p>
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-50 dark:border-gray-800 flex justify-between items-center">
                                <div>
                                    <span className="font-bold text-gray-900 dark:text-white text-sm">₹{product.price}</span>
                                    {product.unit && <span className="text-[10px] text-gray-400">/{product.unit}</span>}
                                </div>
                                <button 
                                    onClick={() => onAddToCart(product)}
                                    className="bg-farm-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg active:scale-90 transition-transform shadow-md shadow-farm-200 dark:shadow-none whitespace-nowrap"
                                >
                                    {t.buy_btn}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

      </div>
    </div>
  );
};