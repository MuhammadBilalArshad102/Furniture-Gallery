/* =============================================================
   CHECKOUT PAGE
   ============================================================= */

const money = (n) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 0 })}`;
const findProduct = (id) => PRODUCTS.find((p) => p.id === id);

const SHIPPING_OPTIONS = [
  { id: "standard", name: "Standard Shipping", eta: "Estimated delivery: 5–10 business days", price: 0 },
  { id: "express",  name: "Express Shipping",  eta: "Estimated delivery: 2–3 business days", price: 25 },
  { id: "priority", name: "Priority Delivery", eta: "Estimated delivery: 1–2 business days",  price: 45 },
];

const PROMO_CODES = { WELCOME10: 0.10, GALLERY20: 0.20 };

let selectedShipping = "standard";
let selectedPayment = "card";
let discountRate = 0;

// =============================================================
// SHIPPING OPTIONS
// =============================================================
function renderShippingOptions() {
  const list = document.getElementById("shippingList");
  list.innerHTML = SHIPPING_OPTIONS.map((opt) => `
    <label class="shipping-option ${opt.id === selectedShipping ? "is-selected" : ""}" data-id="${opt.id}">
      <input type="radio" name="shipping" value="${opt.id}" ${opt.id === selectedShipping ? "checked" : ""}>
      <div class="shipping-option__body">
        <h5>${opt.name}</h5>
        <p>${opt.eta}</p>
      </div>
      <span class="shipping-option__price ${opt.price === 0 ? "is-free" : ""}">${opt.price === 0 ? "Free" : money(opt.price)}</span>
    </label>
  `).join("");

  list.querySelectorAll(".shipping-option").forEach((el) => {
    el.addEventListener("click", () => {
      selectedShipping = el.dataset.id;
      renderShippingOptions();
      renderTotals();
    });
  });
}

// =============================================================
// PAYMENT METHOD
// =============================================================
function renderPaymentMethods() {
  const methods = [
    { id: "card", name: "Credit Card", desc: "We accept all major cards. Visa, Mastercard and Amex." },
    { id: "paypal", name: "PayPal", desc: "Send secure payments quickly and easily." },
  ];
  const wrap = document.getElementById("paymentMethods");
  wrap.innerHTML = methods.map((m) => `
    <label class="payment-method ${m.id === selectedPayment ? "is-selected" : ""}" data-id="${m.id}">
      <input type="radio" name="payment" value="${m.id}" ${m.id === selectedPayment ? "checked" : ""}>
      <div>
        <h5>${m.name}</h5>
        <p>${m.desc}</p>
      </div>
    </label>
  `).join("");

  wrap.querySelectorAll(".payment-method").forEach((el) => {
    el.addEventListener("click", () => {
      selectedPayment = el.dataset.id;
      renderPaymentMethods();
      document.querySelectorAll(".payment-detail").forEach((panel) => {
        panel.classList.toggle("is-active", panel.dataset.paymentDetail === selectedPayment);
      });
    });
  });
}

// =============================================================
// ORDER SUMMARY
// =============================================================
function renderOrderItems() {
  const wrap = document.getElementById("orderItems");
  wrap.innerHTML = Cart.items.map((item) => {
    const p = findProduct(item.id);
    if (!p) return "";
    return `
      <div class="order-summary__item">
        <img src="${p.image}" alt="${p.name}">
        <div class="order-summary__item-info">
          <p>${p.name}</p>
          <span>${item.qty} item${item.qty > 1 ? "s" : ""}</span>
        </div>
        <span class="order-summary__item-price">${money(p.price * item.qty)}</span>
      </div>
    `;
  }).join("");
}

function renderTotals() {
  const subtotal = Cart.totalPrice(findProduct);
  const shippingOpt = SHIPPING_OPTIONS.find((o) => o.id === selectedShipping);
  const shippingCost = shippingOpt ? shippingOpt.price : 0;
  const discount = Math.round(subtotal * discountRate);
  const total = Math.max(0, subtotal + shippingCost - discount);

  document.getElementById("sumSubtotal").textContent = money(subtotal);
  document.getElementById("sumShipping").textContent = shippingCost === 0 ? "Free" : money(shippingCost);

  const discountRow = document.getElementById("sumDiscountRow");
  if (discount > 0) {
    discountRow.hidden = false;
    document.getElementById("sumDiscount").textContent = `-${money(discount)}`;
  } else {
    discountRow.hidden = true;
  }

  document.getElementById("sumTotal").textContent = money(total);
}

// =============================================================
// PROMO CODE
// =============================================================
document.getElementById("promoApply").addEventListener("click", () => {
  const input = document.getElementById("promoInput");
  const msg = document.getElementById("promoMsg");
  const code = input.value.trim().toUpperCase();

  if (PROMO_CODES[code]) {
    discountRate = PROMO_CODES[code];
    msg.hidden = false;
    msg.className = "promo-msg is-success";
    msg.textContent = `Code applied — ${Math.round(discountRate * 100)}% off your order.`;
  } else {
    discountRate = 0;
    msg.hidden = false;
    msg.className = "promo-msg is-error";
    msg.textContent = code ? "That code isn't valid." : "Enter a promo code first.";
  }
  renderTotals();
});

// =============================================================
// PLACE ORDER
// =============================================================
document.getElementById("placeOrderBtn").addEventListener("click", () => {
  const requiredFields = ["custName", "custEmail", "custPhone", "custAddress", "custCity"];
  const missing = requiredFields.filter((id) => !document.getElementById(id).value.trim());

  if (missing.length) {
    showToast("Please fill in your customer information first.");
    document.getElementById(missing[0]).focus();
    return;
  }

  document.getElementById("checkoutMain").hidden = true;
  document.getElementById("orderConfirm").hidden = false;
  document.querySelector(".checkout-stepper__step:nth-child(3)").classList.add("is-done");
  document.querySelector(".checkout-stepper__step:nth-child(4)").classList.add("is-active");
  window.scrollTo({ top: 0, behavior: "smooth" });

  Cart.clear();
  updateCartBadge();
});

// =============================================================
// SHARED HEADER: cart drawer, mobile menu, toast
// =============================================================
const cartToggle  = document.getElementById("cartToggle");
const cartClose   = document.getElementById("cartClose");
const cartDrawer  = document.getElementById("cartDrawer");
const overlay     = document.getElementById("overlay");
const cartItemsEl = document.getElementById("cartItems");
const cartCountEl = document.getElementById("cartCount");
const cartSubtotalEl = document.getElementById("cartSubtotal");
const checkoutBtn = document.getElementById("checkoutBtn");
const menuToggle = document.getElementById("menuToggle");
const mainNav    = document.getElementById("mainNav");
const toastEl = document.getElementById("toast");

function updateCartBadge() {
  cartCountEl.textContent = Cart.totalCount();
}

function renderCartDrawer() {
  if (Cart.items.length === 0) {
    cartItemsEl.innerHTML = `
      <div class="cart-empty">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 4h2l2.4 12.4a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 2-1.6L20 8H6"/><circle cx="9" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/></svg>
        <p>Your cart is empty.<br>Browse the collection and add something you love.</p>
      </div>`;
    cartSubtotalEl.textContent = money(0);
    checkoutBtn.disabled = true;
    return;
  }

  checkoutBtn.disabled = false;
  cartItemsEl.innerHTML = Cart.items.map((item) => {
    const p = findProduct(item.id);
    if (!p) return "";
    return `
      <div class="cart-item" data-id="${p.id}">
        <img src="${p.image}" alt="${p.name}">
        <div class="cart-item__info">
          <p class="cart-item__name">${p.name}</p>
          <p class="cart-item__price">${money(p.price)}</p>
          <div class="cart-item__row">
            <div class="qty-control">
              <button data-action="dec" aria-label="Decrease quantity">−</button>
              <span>${item.qty}</span>
              <button data-action="inc" aria-label="Increase quantity">+</button>
            </div>
            <button class="cart-item__remove" data-action="remove">Remove</button>
          </div>
        </div>
      </div>
    `;
  }).join("");

  cartSubtotalEl.textContent = money(Cart.totalPrice(findProduct));

  cartItemsEl.querySelectorAll(".cart-item").forEach((row) => {
    const id = row.dataset.id;
    const item = Cart.items.find((i) => i.id === id);
    row.querySelector('[data-action="inc"]').addEventListener("click", () => {
      Cart.updateQty(id, item.qty + 1);
      updateCartBadge();
      renderCartDrawer();
      renderOrderItems();
      renderTotals();
    });
    row.querySelector('[data-action="dec"]').addEventListener("click", () => {
      Cart.updateQty(id, item.qty - 1);
      updateCartBadge();
      renderCartDrawer();
      renderOrderItems();
      renderTotals();
      refreshPageState();
    });
    row.querySelector('[data-action="remove"]').addEventListener("click", () => {
      Cart.remove(id);
      updateCartBadge();
      renderCartDrawer();
      showToast("Item removed from cart");
      refreshPageState();
    });
  });
}

function openCart() {
  cartDrawer.classList.add("is-open");
  overlay.classList.add("is-visible");
  cartDrawer.setAttribute("aria-hidden", "false");
}
function closeCart() {
  cartDrawer.classList.remove("is-open");
  cartDrawer.setAttribute("aria-hidden", "true");
  overlay.classList.remove("is-visible");
  mainNav.classList.remove("is-open");
}

cartToggle.addEventListener("click", () => {
  renderCartDrawer();
  openCart();
});
cartClose.addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeCart();
});
checkoutBtn.addEventListener("click", () => {
  closeCart();
});
menuToggle.addEventListener("click", () => {
  mainNav.classList.toggle("is-open");
});

let toastTimer = null;
function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("is-visible"), 2200);
}

function goToSearch(value) {
  if (!value.trim()) return;
  window.location.href = `index.html?q=${encodeURIComponent(value.trim())}#shop`;
}
document.getElementById("searchInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") goToSearch(e.target.value);
});
document.getElementById("searchInputMobile").addEventListener("keydown", (e) => {
  if (e.key === "Enter") goToSearch(e.target.value);
});

// =============================================================
// PAGE STATE (empty cart vs. checkout form)
// =============================================================
function refreshPageState() {
  const hasItems = Cart.items.length > 0;
  document.getElementById("checkoutMain").hidden = !hasItems;
  document.getElementById("checkoutEmpty").hidden = hasItems;
  if (hasItems) {
    renderOrderItems();
    renderTotals();
  }
}

// =============================================================
// INIT
// =============================================================
document.getElementById("year").textContent = new Date().getFullYear();
renderShippingOptions();
renderPaymentMethods();
updateCartBadge();
refreshPageState();
