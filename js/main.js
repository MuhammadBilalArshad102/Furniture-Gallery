/* =============================================================
   APP — dynamic rendering, category/price/sort filtering, search,
   cart UI, and the product detail modal.
   ============================================================= */

const state = {
  category: "all",
  query: "",
  priceMin: null,
  priceMax: null,
  sort: "default",
};

// ---------- DOM refs ----------
const catRail       = document.getElementById("catRail");
const productGrid    = document.getElementById("productGrid");
const noResults      = document.getElementById("noResults");
const noResultsQuery = document.getElementById("noResultsQuery");
const clearFiltersBtn = document.getElementById("clearFiltersBtn");
const resultsCount   = document.getElementById("resultsCount");

const searchInput       = document.getElementById("searchInput");
const searchInputMobile = document.getElementById("searchInputMobile");

const priceMinInput = document.getElementById("priceMin");
const priceMaxInput = document.getElementById("priceMax");
const sortSelect     = document.getElementById("sortSelect");

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

// Product detail modal refs
const pdpModal   = document.getElementById("pdpModal");
const pdpClose   = document.getElementById("pdpClose");
const pdpImage   = document.getElementById("pdpImage");
const pdpBadge   = document.getElementById("pdpBadge");
const pdpCategory = document.getElementById("pdpCategory");
const pdpName    = document.getElementById("pdpName");
const pdpRating  = document.getElementById("pdpRating");
const pdpPrice   = document.getElementById("pdpPrice");
const pdpQtyEl   = document.getElementById("pdpQty");
const pdpQtyControl = document.getElementById("pdpQtyControl");
const pdpAddToCart  = document.getElementById("pdpAddToCart");
const pdpDescription = document.getElementById("pdpDescription");
const pdpFeatures    = document.getElementById("pdpFeatures");
const pdpViewFull    = document.getElementById("pdpViewFull");

let pdpState = { productId: null, qty: 1 };

const money = (n) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 0 })}`;
const findProduct = (id) => PRODUCTS.find((p) => p.id === id);

function starRow(rating) {
  let out = "";
  for (let i = 1; i <= 5; i++) {
    out += `<span class="${i <= rating ? "filled" : ""}">★</span>`;
  }
  return out;
}

// =============================================================
// CATEGORY TABS
// =============================================================
function renderCategories() {
  catRail.innerHTML = CATEGORIES.map((cat) => `
    <button class="cat-pill ${cat.id === state.category ? "is-active" : ""}" data-cat="${cat.id}">
      ${cat.label}
    </button>
  `).join("");

  catRail.querySelectorAll(".cat-pill").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.category = btn.dataset.cat;
      renderCategories();
      renderProducts();
    });
  });
}

// Banner cards ("Lighting Edit", sofa feature, "Modern Chair") jump to
// the shop section and pre-filter by category.
document.querySelectorAll(".banner-card[data-cat]").forEach((card) => {
  card.addEventListener("click", (e) => {
    e.preventDefault();
    state.category = card.dataset.cat;
    renderCategories();
    renderProducts();
    document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
  });
});

// =============================================================
// PRODUCT GRID — filter (category, query, price) + sort
// =============================================================
function getFilteredProducts() {
  const q = state.query.trim().toLowerCase();
  let list = PRODUCTS.filter((p) => {
    const matchesCategory = state.category === "all" || p.category === state.category;
    const matchesQuery = !q || p.name.toLowerCase().includes(q);
    const matchesMin = state.priceMin === null || p.price >= state.priceMin;
    const matchesMax = state.priceMax === null || p.price <= state.priceMax;
    return matchesCategory && matchesQuery && matchesMin && matchesMax;
  });

  switch (state.sort) {
    case "price-asc":
      list = list.slice().sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      list = list.slice().sort((a, b) => b.price - a.price);
      break;
    case "name-asc":
      list = list.slice().sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "rating-desc":
      list = list.slice().sort((a, b) => b.rating - a.rating);
      break;
    default:
      break;
  }

  return list;
}

function productCardHTML(p) {
  return `
    <article class="product-card" data-id="${p.id}">
      <a class="product-card__media" href="product.html?id=${p.id}">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        ${p.badge ? `<span class="product-card__badge">${p.badge}</span>` : ""}
        <button class="product-card__quick" data-id="${p.id}" aria-label="Quick view ${p.name}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2.5 12s3.8-7 9.5-7 9.5 7 9.5 7-3.8 7-9.5 7-9.5-7-9.5-7z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
        <button class="add-to-cart-bar" data-id="${p.id}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 4h2l2.4 12.4a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 2-1.6L20 8H6"/></svg>
          <span>Add to cart</span>
        </button>
      </a>
      <div class="product-card__body">
        <div class="product-card__rating" aria-hidden="true">${starRow(p.rating)}</div>
        <a class="product-card__name" href="product.html?id=${p.id}">${p.name}</a>
        <p class="product-card__price">
          ${p.compareAt ? `<span class="was">${money(p.compareAt)}</span>` : ""}${money(p.price)}
        </p>
      </div>
    </article>
  `;
}

function renderProducts() {
  const list = getFilteredProducts();

  resultsCount.textContent = `${list.length} ${list.length === 1 ? "product" : "products"}`;

  if (list.length === 0) {
    productGrid.innerHTML = "";
    noResults.hidden = false;
    noResultsQuery.textContent = state.query || (CATEGORIES.find((c) => c.id === state.category) || {}).label;
  } else {
    noResults.hidden = true;
    productGrid.innerHTML = list.map(productCardHTML).join("");
  }

  productGrid.querySelectorAll(".add-to-cart-bar").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      handleAddToCart(btn);
    });
  });

  // Opening the product detail modal: quick-view button only.
  // The product image and name link straight to the full product page (product.html).
  productGrid.querySelectorAll(".product-card__quick").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      openProductDetail(el.dataset.id);
    });
  });
}

function handleAddToCart(btn) {
  const id = btn.dataset.id;
  const product = findProduct(id);
  Cart.add(id, 1);
  updateCartBadge();
  renderCartDrawer();
  showToast(`${product.name} added to cart`);

  btn.classList.add("is-added");
  const label = btn.querySelector("span");
  const prevLabel = label.textContent;
  label.textContent = "Added ✓";
  setTimeout(() => {
    btn.classList.remove("is-added");
    label.textContent = prevLabel;
  }, 900);
}

// =============================================================
// SEARCH
// =============================================================
function handleSearchInput(value) {
  state.query = value;
  searchInput.value = value;
  searchInputMobile.value = value;
  renderProducts();
  if (value.trim()) {
    document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
  }
}

searchInput.addEventListener("input", (e) => handleSearchInput(e.target.value));
searchInputMobile.addEventListener("input", (e) => handleSearchInput(e.target.value));

clearFiltersBtn.addEventListener("click", () => {
  state.category = "all";
  state.priceMin = null;
  state.priceMax = null;
  state.sort = "default";
  priceMinInput.value = "";
  priceMaxInput.value = "";
  sortSelect.value = "default";
  handleSearchInput("");
  renderCategories();
});

// =============================================================
// PRICE FILTER + SORT
// =============================================================
function handlePriceChange() {
  const min = priceMinInput.value === "" ? null : Number(priceMinInput.value);
  const max = priceMaxInput.value === "" ? null : Number(priceMaxInput.value);
  state.priceMin = Number.isFinite(min) ? min : null;
  state.priceMax = Number.isFinite(max) ? max : null;
  renderProducts();
}
priceMinInput.addEventListener("input", handlePriceChange);
priceMaxInput.addEventListener("input", handlePriceChange);

sortSelect.addEventListener("change", () => {
  state.sort = sortSelect.value;
  renderProducts();
});

// =============================================================
// BLOG — tags and post links jump into the product catalog
// =============================================================
function applyProductFilter(type, value) {
  if (type === "category") {
    state.category = value;
    renderCategories();
    handleSearchInput("");
  } else {
    state.category = "all";
    renderCategories();
    handleSearchInput(value);
  }
}

const blogGrid = document.getElementById("blogGrid");
if (blogGrid) {
  blogGrid.addEventListener("click", (e) => {
    const tagBtn = e.target.closest(".blog-tag");
    if (tagBtn) {
      applyProductFilter(tagBtn.dataset.type, tagBtn.dataset.value);
      return;
    }

    const postLink = e.target.closest("[data-blog-link]");
    if (postLink) {
      e.preventDefault();
      const post = BLOG_POSTS.find((b) => b.id === postLink.dataset.blogLink);
      if (!post) return;
      const firstCatTag = post.tags.map(tagToCategoryId).find(Boolean);
      if (firstCatTag) {
        applyProductFilter("category", firstCatTag);
      } else {
        applyProductFilter("query", post.tags[0]);
      }
    }
  });
}

// =============================================================
// PRODUCT DETAIL MODAL
// =============================================================
function openProductDetail(id) {
  const p = findProduct(id);
  if (!p) return;

  pdpState = { productId: id, qty: 1 };

  pdpImage.src = p.image;
  pdpImage.alt = p.name;

  if (p.badge) {
    pdpBadge.hidden = false;
    pdpBadge.textContent = p.badge;
  } else {
    pdpBadge.hidden = true;
  }

  const catLabel = (CATEGORIES.find((c) => c.id === p.category) || {}).label || "";
  pdpCategory.textContent = `Home / Shop / ${catLabel}`;
  pdpName.textContent = p.name;
  pdpRating.innerHTML = starRow(p.rating);
  pdpPrice.innerHTML = p.compareAt
    ? `<span class="was">${money(p.compareAt)}</span>${money(p.price)}`
    : money(p.price);
  pdpQtyEl.textContent = "1";
  pdpDescription.textContent = p.description || "";
  pdpFeatures.innerHTML = (p.features || []).map((f) => `<li>${f}</li>`).join("");
  if (pdpViewFull) pdpViewFull.href = `product.html?id=${p.id}`;

  // Reset to the first tab every time the modal opens.
  document.querySelectorAll(".pdp-tab").forEach((t, i) => t.classList.toggle("is-active", i === 0));
  document.querySelectorAll(".pdp-tab-panel").forEach((panel, i) => panel.classList.toggle("is-active", i === 0));

  pdpModal.classList.add("is-open");
  pdpModal.setAttribute("aria-hidden", "false");
  overlay.classList.add("is-visible");
  document.body.classList.add("no-scroll");
}

function closeProductDetail() {
  pdpModal.classList.remove("is-open");
  pdpModal.setAttribute("aria-hidden", "true");
  if (!cartDrawer.classList.contains("is-open")) {
    overlay.classList.remove("is-visible");
  }
  document.body.classList.remove("no-scroll");
}

pdpClose.addEventListener("click", closeProductDetail);

pdpQtyControl.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;
  if (btn.dataset.action === "inc") pdpState.qty += 1;
  if (btn.dataset.action === "dec") pdpState.qty = Math.max(1, pdpState.qty - 1);
  pdpQtyEl.textContent = pdpState.qty;
});

pdpAddToCart.addEventListener("click", () => {
  if (!pdpState.productId) return;
  const product = findProduct(pdpState.productId);
  Cart.add(pdpState.productId, pdpState.qty);
  updateCartBadge();
  renderCartDrawer();
  showToast(`${product.name} added to cart`);
});

document.querySelectorAll(".pdp-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".pdp-tab").forEach((t) => t.classList.remove("is-active"));
    document.querySelectorAll(".pdp-tab-panel").forEach((p) => p.classList.remove("is-active"));
    tab.classList.add("is-active");
    document.querySelector(`.pdp-tab-panel[data-panel="${tab.dataset.tab}"]`).classList.add("is-active");
  });
});

// =============================================================
// CART DRAWER
// =============================================================
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
  if (!pdpModal.classList.contains("is-open")) {
    overlay.classList.remove("is-visible");
  }
  closeMenu();
}

cartToggle.addEventListener("click", () => {
  renderCartDrawer();
  openCart();
});
cartClose.addEventListener("click", closeCart);
overlay.addEventListener("click", () => {
  closeCart();
  closeProductDetail();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeCart();
    closeProductDetail();
  }
});

checkoutBtn.addEventListener("click", () => {
  if (checkoutBtn.disabled || Cart.items.length === 0) return;
  window.location.href = "checkout.html";
});

// =============================================================
// MOBILE MENU
// =============================================================
function closeMenu() {
  mainNav.classList.remove("is-open");
}
menuToggle.addEventListener("click", () => {
  mainNav.classList.toggle("is-open");
});

// =============================================================
// TOAST
// =============================================================
let toastTimer = null;
function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("is-visible"), 2200);
}

// =============================================================
// INIT
// =============================================================
document.getElementById("year").textContent = new Date().getFullYear();

const urlParams = new URLSearchParams(window.location.search);
const initialQuery = urlParams.get("q");

renderCategories();
if (initialQuery) {
  handleSearchInput(initialQuery);
} else {
  renderProducts();
}
renderBlog();
updateCartBadge();
