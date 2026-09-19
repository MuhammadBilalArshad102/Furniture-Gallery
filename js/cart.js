/* =============================================================
   CART — persisted to localStorage so the count and contents
   survive a page refresh.
   ============================================================= */

const CART_STORAGE_KEY = "furniture_gallery_cart";

const Cart = {
  items: [], // [{ id, qty }]

  load() {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      this.items = raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.error("Could not read cart from localStorage:", err);
      this.items = [];
    }
    return this.items;
  },

  save() {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.items));
    } catch (err) {
      console.error("Could not save cart to localStorage:", err);
    }
  },

  add(productId, qty = 1) {
    const existing = this.items.find((i) => i.id === productId);
    if (existing) {
      existing.qty += qty;
    } else {
      this.items.push({ id: productId, qty });
    }
    this.save();
  },

  updateQty(productId, qty) {
    const item = this.items.find((i) => i.id === productId);
    if (!item) return;
    if (qty <= 0) {
      this.remove(productId);
      return;
    }
    item.qty = qty;
    this.save();
  },

  remove(productId) {
    this.items = this.items.filter((i) => i.id !== productId);
    this.save();
  },

  clear() {
    this.items = [];
    this.save();
  },

  totalCount() {
    return this.items.reduce((sum, i) => sum + i.qty, 0);
  },

  totalPrice(productLookup) {
    return this.items.reduce((sum, i) => {
      const product = productLookup(i.id);
      return product ? sum + product.price * i.qty : sum;
    }, 0);
  },
};

Cart.load();
