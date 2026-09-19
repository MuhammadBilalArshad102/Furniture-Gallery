/* =============================================================
   PRODUCT PAGE — standalone full-page product detail.
   Reads ?id= from the URL, falls back to the first product.
   Shares Cart/PRODUCTS data with the rest of the site so the
   cart badge and contents stay in sync across pages.
   ============================================================= */

const money = (n) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 0 })}`;
const findProduct = (id) => PRODUCTS.find((p) => p.id === id);

function starRow(rating) {
  let out = "";
  for (let i = 1; i <= 5; i++) {
    out += `<span class="${i <= rating ? "filled" : ""}">★</span>`;
  }
  return out;
}

// ---------- resolve current product ----------
const params = new URLSearchParams(window.location.search);
const requestedId = params.get("id");
const currentProduct = findProduct(requestedId) || PRODUCTS[0];

let qty = 1;

function renderProduct(p) {
  document.title = `${p.name} — Furniture Gallery`;

  const catLabel = (CATEGORIES.find((c) => c.id === p.category) || {}).label || "";
  document.getElementById("breadcrumbCat").textContent = p.name;

  const pdpImage = document.getElementById("pdpImage");
  pdpImage.src = p.image;
  pdpImage.alt = p.name;

  const pdpBadge = document.getElementById("pdpBadge");
  if (p.badge) {
    pdpBadge.hidden = false;
    pdpBadge.textContent = p.badge;
  } else {
    pdpBadge.hidden = true;
  }

  document.getElementById("pdpCategory").textContent = `Home / Shop / ${catLabel}`;
  document.getElementById("pdpName").textContent = p.name;
  document.getElementById("pdpRating").innerHTML = starRow(p.rating);
  document.getElementById("pdpRatingCount").textContent = `${p.rating}.0 rating`;
  document.getElementById("pdpPrice").innerHTML = p.compareAt
    ? `<span class="was">${money(p.compareAt)}</span>${money(p.price)}`
    : money(p.price);
  document.getElementById("pdpDescription").textContent = p.description || "";
  document.getElementById("pdpFeatures").innerHTML = (p.features || []).map((f) => `<li>${f}</li>`).join("");

  qty = 1;
  document.getElementById("pdpQty").textContent = qty;
}

// ---------- quantity ----------
document.getElementById("pdpQtyControl").addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;
  if (btn.dataset.action === "inc") qty += 1;
  if (btn.dataset.action === "dec") qty = Math.max(1, qty - 1);
  document.getElementById("pdpQty").textContent = qty;
});

// ---------- tabs ----------
document.querySelectorAll(".pdp-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".pdp-tab").forEach((t) => t.classList.remove("is-active"));
    document.querySelectorAll(".pdp-tab-panel").forEach((p) => p.classList.remove("is-active"));
    tab.classList.add("is-active");
    document.querySelector(`.pdp-tab-panel[data-panel="${tab.dataset.tab}"]`).classList.add("is-active");
  });
});

// ---------- add to cart ----------
document.getElementById("pdpAddToCart").addEventListener("click", () => {
  Cart.add(currentProduct.id, qty);
  updateCartBadge();
  renderCartDrawer();
  showToast(`${currentProduct.name} added to cart`);
});

// ---------- related products ----------
function productCardHTML(p) {
  return `
    <article class="product-card" data-id="${p.id}">
      <a href="product.html?id=${p.id}" class="product-card__media">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        ${p.badge ? `<span class="product-card__badge">${p.badge}</span>` : ""}
        <button class="add-to-cart-bar" data-id="${p.id}" type="button">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 4h2l2.4 12.4a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 2-1.6L20 8H6"/></svg>
          <span>Add to cart</span>
        </button>
      </a>
      <div class="product-card__body">
        <div class="product-card__rating" aria-hidden="true">${starRow(p.rating)}</div>
        <a href="product.html?id=${p.id}" class="product-card__name">${p.name}</a>
        <p class="product-card__price">
          ${p.compareAt ? `<span class="was">${money(p.compareAt)}</span>` : ""}${money(p.price)}
        </p>
      </div>
    </article>
  `;
}

function renderRelated(p) {
  const related = PRODUCTS
    .filter((item) => item.category === p.category && item.id !== p.id)
    .slice(0, 4);
  const fallback = related.length ? related : PRODUCTS.filter((item) => item.id !== p.id).slice(0, 4);

  const grid = document.getElementById("relatedGrid");
  grid.innerHTML = fallback.map(productCardHTML).join("");

  grid.querySelectorAll(".add-to-cart-bar").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = btn.dataset.id;
      const product = findProduct(id);
      Cart.add(id, 1);
      updateCartBadge();
      renderCartDrawer();
      showToast(`${product.name} added to cart`);
    });
  });
}

// =============================================================
// SHARED HEADER: cart drawer, mobile menu, toast, search
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
    });
    row.querySelector('[data-action="dec"]').addEventListener("click", () => {
      Cart.updateQty(id, item.qty - 1);
      updateCartBadge();
      renderCartDrawer();
    });
    row.querySelector('[data-action="remove"]').addEventListener("click", () => {
      Cart.remove(id);
      updateCartBadge();
      renderCartDrawer();
      showToast("Item removed from cart");
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
  if (Cart.items.length === 0) return;
  window.location.href = "checkout.html";
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

// Search from the product page jumps back to the shop grid, pre-filtered.
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
// INIT
// =============================================================
document.getElementById("year").textContent = new Date().getFullYear();
renderProduct(currentProduct);
renderRelated(currentProduct);
updateCartBadge();
