import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Plus, 
  Trash2, 
  Clock, 
  Star, 
  Bike, 
  Utensils, 
  CheckCircle2, 
  ChevronRight, 
  ArrowRight, 
  Layers, 
  X,
  Sparkles,
  DollarSign
} from 'lucide-react';

interface FoodFleetProps {
  data: any;
  onAction: (action: string, payload: any) => void;
}

export const FoodFleetProduct: React.FC<FoodFleetProps> = ({ data, onAction }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [cart, setCart] = useState<{ id: string; name: string; price: number; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'app' | 'admin'>('app');
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(data?.restaurants?.[0] || null);

  const restaurants = data?.restaurants || [];
  const orders = data?.orders || [];

  const addToCart = (item: any) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? 3.99 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    onAction('FOODFLEET_ADD_ORDER', {
      customer: 'Alex Mercer',
      restaurant: selectedRestaurant?.name || 'Umami Ramen & Izakaya',
      items: cart.map(c => `${c.name} (x${c.quantity})`),
      total: parseFloat(total.toFixed(2))
    });
    setCart([]);
    setIsCartOpen(false);
  };

  const handleAdvanceOrder = (orderId: string) => {
    onAction('FOODFLEET_ADVANCE_ORDER', { orderId });
  };

  return (
    <div className="rounded-2xl bg-[#090b10] border border-zinc-800 text-zinc-100 overflow-hidden shadow-2xl">
      {/* App Topbar */}
      <div className="bg-[#121520] border-b border-zinc-800 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Utensils className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm tracking-tight text-white">FoodFleet</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                LIVE DEMO APP
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">On-demand gourmet delivery platform</p>
          </div>
        </div>

        {/* Top Controls */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center p-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono">
            <button
              onClick={() => setViewMode('app')}
              className={`px-3 py-1 rounded-md transition-all ${
                viewMode === 'app' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Customer App
            </button>
            <button
              onClick={() => setViewMode('admin')}
              className={`px-3 py-1 rounded-md transition-all ${
                viewMode === 'admin' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Kitchen / Admin
            </button>
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            id="btn-foodfleet-open-cart"
            className="relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Cart ({cart.reduce((a, b) => a + b.quantity, 0)})</span>
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* CUSTOMER APP VIEW */}
      {viewMode === 'app' && (
        <div className="p-6 space-y-6">
          {/* Active Live Orders Tracker */}
          {orders.length > 0 && (
            <div className="p-5 rounded-xl bg-zinc-900/90 border border-amber-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bike className="w-4 h-4 text-amber-400 animate-bounce" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                    Live Order Tracker ({orders[0].id})
                  </h4>
                </div>
                <span className="text-xs font-mono text-amber-300">ETA: {orders[0].etaMinutes} mins</span>
              </div>

              {/* Steps Progress */}
              <div className="grid grid-cols-4 gap-2 pt-2">
                {['Received', 'Preparing', 'On the Way', 'Delivered'].map((step, idx) => {
                  const isPassed = idx <= orders[0].stepIndex;
                  return (
                    <div key={idx} className="space-y-1">
                      <div className={`h-1.5 rounded-full ${isPassed ? 'bg-amber-400' : 'bg-zinc-800'}`} />
                      <span className={`text-[10px] font-mono block ${isPassed ? 'text-amber-300 font-bold' : 'text-zinc-500'}`}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-xs text-zinc-300">
                <p>Courier: <span className="text-white font-medium">{orders[0].courier}</span></p>
                <button
                  onClick={() => handleAdvanceOrder(orders[0].id)}
                  className="text-xs text-amber-400 hover:text-amber-300 font-mono flex items-center gap-1"
                >
                  <span>Advance Status (Simulate)</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Restaurant Discovery Cards */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Featured Gourmet Kitchens
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {restaurants.map((rest: any) => (
                <div
                  key={rest.id}
                  onClick={() => setSelectedRestaurant(rest)}
                  className={`rounded-xl border p-4 transition-all cursor-pointer ${
                    selectedRestaurant?.id === rest.id
                      ? 'bg-zinc-900 border-amber-500/80 shadow-md ring-1 ring-amber-500/30'
                      : 'bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex gap-4">
                    <img
                      src={rest.image}
                      alt={rest.name}
                      className="w-24 h-24 rounded-lg object-cover border border-zinc-800"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h5 className="font-bold text-sm text-white">{rest.name}</h5>
                        <div className="flex items-center gap-1 text-xs text-amber-400 font-mono">
                          <Star className="w-3 h-3 fill-current" />
                          <span>{rest.rating}</span>
                        </div>
                      </div>
                      <p className="text-xs text-zinc-400">{rest.cuisine}</p>
                      <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono pt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-zinc-400" />
                          {rest.deliveryTime}
                        </span>
                        <span>Delivery: ${rest.deliveryFee.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items Preview */}
                  <div className="mt-4 pt-3 border-t border-zinc-800/60 space-y-2">
                    <span className="text-[11px] font-mono text-zinc-400 font-semibold block">POPULAR DISHES:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {rest.menu?.map((dish: any) => (
                        <div
                          key={dish.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/60 border border-zinc-800 text-xs"
                        >
                          <div>
                            <span className="font-medium text-zinc-200 block">{dish.name}</span>
                            <span className="text-amber-400 font-mono text-[11px]">${dish.price.toFixed(2)}</span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(dish);
                            }}
                            className="p-1.5 rounded-md bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 transition-colors"
                            title="Add to cart"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* KITCHEN / ADMIN PANEL */}
      {viewMode === 'admin' && (
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
              <span className="text-zinc-400">TOTAL ORDERS</span>
              <h4 className="text-xl font-bold text-white">{orders.length + 18}</h4>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
              <span className="text-zinc-400">TODAY REVENUE</span>
              <h4 className="text-xl font-bold text-emerald-400">$1,842.50</h4>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
              <span className="text-zinc-400">AVG DELIVERY TIME</span>
              <h4 className="text-xl font-bold text-amber-400">22.4 mins</h4>
            </div>
          </div>

          {/* Orders Table */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Live Kitchen Ticket Stream
            </h4>
            <div className="overflow-x-auto rounded-xl border border-zinc-800">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-zinc-900/90 text-zinc-400 border-b border-zinc-800">
                  <tr>
                    <th className="p-3">ORDER ID</th>
                    <th className="p-3">CUSTOMER</th>
                    <th className="p-3">RESTAURANT</th>
                    <th className="p-3">TOTAL</th>
                    <th className="p-3">STATUS</th>
                    <th className="p-3">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                  {orders.map((o: any) => (
                    <tr key={o.id} className="hover:bg-zinc-900/40">
                      <td className="p-3 font-bold text-amber-400">{o.id}</td>
                      <td className="p-3 text-white">{o.customer}</td>
                      <td className="p-3 text-zinc-400">{o.restaurant}</td>
                      <td className="p-3 font-semibold text-emerald-400">${o.total?.toFixed(2)}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-[10px] text-amber-300">
                          {o.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleAdvanceOrder(o.id)}
                          className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px]"
                        >
                          Advance Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="relative z-10 w-96 h-full bg-[#0e1017] border-l border-zinc-800 p-6 flex flex-col justify-between shadow-2xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-bold text-white">Your FoodFleet Cart</h3>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-1 rounded-md text-zinc-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12 text-zinc-500 text-xs font-mono">
                  Your cart is empty. Add dishes from any restaurant!
                </div>
              ) : (
                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 flex items-center justify-between">
                      <div>
                        <h5 className="text-xs font-bold text-white">{item.name}</h5>
                        <span className="text-amber-400 text-xs font-mono">${(item.price * item.quantity).toFixed(2)} (x{item.quantity})</span>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-zinc-500 hover:text-rose-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Calculations & Checkout */}
            {cart.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-zinc-800">
                <div className="space-y-1.5 text-xs font-mono text-zinc-400">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-white">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className="text-white">${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Tax (8%)</span>
                    <span className="text-white">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-zinc-800 text-sm font-bold text-white">
                    <span>Total</span>
                    <span className="text-amber-400 font-mono">${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  id="btn-foodfleet-checkout"
                  onClick={handleCheckout}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/25 active:scale-95"
                >
                  Place Order (${total.toFixed(2)})
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
