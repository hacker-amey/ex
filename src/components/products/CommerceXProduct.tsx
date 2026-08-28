import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Plus, 
  Trash2, 
  Search, 
  SlidersHorizontal, 
  Star, 
  CheckCircle2, 
  Package, 
  X,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

interface CommerceXProps {
  data: any;
  onAction: (action: string, payload: any) => void;
}

export const CommerceXProduct: React.FC<CommerceXProps> = ({ data, onAction }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cart, setCart] = useState<{ id: string; name: string; price: number; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'store' | 'admin'>('store');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [orderConfirmation, setOrderConfirmation] = useState<any>(null);

  // New product form state for admin
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('99.00');

  const products = data?.products || [];
  const orders = data?.orders || [];

  const categories = ['All', 'Audio', 'Wearables', 'Computing', 'Accessories'];

  const filteredProducts = products.filter((p: any) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const orderId = 'ORD-CX-' + Math.floor(1000 + Math.random() * 9000);
    onAction('COMMERCEX_PLACE_ORDER', {
      customer: 'Jennifer Hayes',
      total: parseFloat(total.toFixed(2)),
      itemsCount: cart.reduce((a, b) => a + b.quantity, 0)
    });
    setOrderConfirmation({
      id: orderId,
      total: total.toFixed(2),
      items: [...cart]
    });
    setCart([]);
    setIsCartOpen(false);
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;
    onAction('COMMERCEX_ADD_PRODUCT', {
      name: newProdName,
      price: parseFloat(newProdPrice) || 99.00,
      category: 'Audio',
      stock: 45
    });
    setNewProdName('');
  };

  return (
    <div className="rounded-2xl bg-[#090b10] border border-zinc-800 text-zinc-100 overflow-hidden shadow-2xl">
      {/* App Topbar */}
      <div className="bg-[#121520] border-b border-zinc-800 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Package className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm tracking-tight text-white">CommerceX</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                HEADLESS E-COMMERCE
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">Enterprise storefront & inventory ledger</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center p-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono">
            <button
              onClick={() => setViewMode('store')}
              className={`px-3 py-1 rounded-md transition-all ${
                viewMode === 'store' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Storefront
            </button>
            <button
              onClick={() => setViewMode('admin')}
              className={`px-3 py-1 rounded-md transition-all ${
                viewMode === 'admin' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Inventory Manager
            </button>
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            id="btn-commercex-cart"
            className="relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Cart ({cart.reduce((a, b) => a + b.quantity, 0)})</span>
          </button>
        </div>
      </div>

      {/* STOREFRONT VIEW */}
      {viewMode === 'store' && (
        <div className="p-6 space-y-6">
          {/* Search & Category Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search catalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                    selectedCategory === cat
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProducts.map((prod: any) => (
              <div
                key={prod.id}
                onClick={() => setSelectedProduct(prod)}
                className="rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 hover:border-zinc-700 transition-all p-4 space-y-3 cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="relative rounded-lg overflow-hidden h-40 bg-zinc-950">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono text-zinc-300">
                      {prod.stock} in stock
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">{prod.category}</span>
                    <h4 className="text-sm font-bold text-white">{prod.name}</h4>
                    <div className="flex items-center gap-1 text-xs text-amber-400 font-mono mt-0.5">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{prod.rating || 4.9}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
                  <span className="text-base font-bold text-white font-mono">${prod.price.toFixed(2)}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(prod);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADMIN INVENTORY VIEW */}
      {viewMode === 'admin' && (
        <div className="p-6 space-y-6">
          {/* Add product form */}
          <form onSubmit={handleAddProduct} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
              Quick Add Inventory Item
            </h4>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Product Name"
                value={newProdName}
                onChange={(e) => setNewProdName(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200"
              />
              <input
                type="number"
                placeholder="Price"
                value={newProdPrice}
                onChange={(e) => setNewProdPrice(e.target.value)}
                className="w-28 px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200"
              />
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-cyan-500 text-zinc-950 font-bold text-xs uppercase font-mono"
              >
                Create SKU
              </button>
            </div>
          </form>

          {/* Orders log table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">
              Recent Authorized Checkouts
            </h4>
            <div className="overflow-x-auto rounded-xl border border-zinc-800">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-zinc-900 text-zinc-400 border-b border-zinc-800">
                  <tr>
                    <th className="p-3">ORDER ID</th>
                    <th className="p-3">CUSTOMER</th>
                    <th className="p-3">ITEMS</th>
                    <th className="p-3">TOTAL</th>
                    <th className="p-3">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 text-zinc-300">
                  {orders.map((o: any) => (
                    <tr key={o.id} className="hover:bg-zinc-900/40">
                      <td className="p-3 text-cyan-400 font-bold">{o.id}</td>
                      <td className="p-3 text-white">{o.customer}</td>
                      <td className="p-3 text-zinc-400">{o.itemsCount} items</td>
                      <td className="p-3 text-emerald-400 font-bold">${o.total?.toFixed(2)}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">
                          {o.status}
                        </span>
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
                <h3 className="text-base font-bold text-white">Your Cart</h3>
                <button onClick={() => setIsCartOpen(false)} className="p-1 rounded-md text-zinc-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12 text-zinc-500 text-xs font-mono">
                  Your cart is empty.
                </div>
              ) : (
                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                      <div>
                        <h5 className="text-xs font-bold text-white">{item.name}</h5>
                        <span className="text-cyan-400 text-xs font-mono">${(item.price * item.quantity).toFixed(2)} (x{item.quantity})</span>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-zinc-500 hover:text-rose-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-zinc-800">
                <div className="space-y-1.5 text-xs font-mono text-zinc-400">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-white">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (8%)</span>
                    <span className="text-white">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-zinc-800 text-sm font-bold text-white">
                    <span>Total</span>
                    <span className="text-cyan-400 font-mono">${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  id="btn-commercex-checkout"
                  onClick={handleCheckout}
                  className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/25 active:scale-95"
                >
                  Authorize Checkout (${total.toFixed(2)})
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Order Confirmation Modal */}
      {orderConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOrderConfirmation(null)} />
          <div className="relative z-10 w-full max-w-md bg-[#0e1017] border border-emerald-500/40 rounded-2xl p-6 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Order Confirmed!</h3>
              <p className="text-xs text-zinc-400 mt-1 font-mono">Transaction ID: {orderConfirmation.id}</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-left space-y-1">
              <div className="flex justify-between text-zinc-400">
                <span>TOTAL BILLED:</span>
                <span className="text-emerald-400 font-bold">${orderConfirmation.total}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>PAYMENT METHOD:</span>
                <span className="text-white">Stripe Instant Payout</span>
              </div>
            </div>
            <button
              onClick={() => setOrderConfirmation(null)}
              className="w-full py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white uppercase font-mono"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
