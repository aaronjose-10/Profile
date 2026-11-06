document.addEventListener("DOMContentLoaded", () => {
  /* ==========================================================================
     1. Products Data
     ========================================================================== */
  const PRODUCTS = [
    {
      id: "prod-1",
      title: "Monstera Deliciosa",
      category: "plants",
      categoryName: "Indoor Plants",
      price: 34.00,
      originalPrice: 42.00,
      badge: "Bestseller",
      rating: 4.9,
      reviews: 142,
      image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "prod-2",
      title: "Handcrafted Terracotta Pot",
      category: "decor",
      categoryName: "Home & Pots",
      price: 28.00,
      originalPrice: null,
      badge: "Artisan",
      rating: 4.8,
      reviews: 86,
      image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "prod-3",
      title: "Ceremonial Organic Matcha",
      category: "teas",
      categoryName: "Organic Teas",
      price: 24.50,
      originalPrice: null,
      badge: "Organic",
      rating: 5.0,
      reviews: 210,
      image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "prod-4",
      title: "Bamboo Fiber Travel Tumbler",
      category: "eco",
      categoryName: "Zero Waste",
      price: 18.00,
      originalPrice: 22.00,
      badge: "Sale",
      rating: 4.7,
      reviews: 95,
      image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "prod-5",
      title: "Fiddle Leaf Fig Tree",
      category: "plants",
      categoryName: "Indoor Plants",
      price: 48.00,
      originalPrice: 56.00,
      badge: "Popular",
      rating: 4.9,
      reviews: 178,
      image: "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "prod-6",
      title: "Sage & Lavender Soy Candle",
      category: "decor",
      categoryName: "Home & Pots",
      price: 22.00,
      originalPrice: null,
      badge: "Eco-Friendly",
      rating: 4.8,
      reviews: 64,
      image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "prod-7",
      title: "Herbal Chamomile Mint Blend",
      category: "teas",
      categoryName: "Organic Teas",
      price: 16.50,
      originalPrice: null,
      badge: "Calming",
      rating: 4.6,
      reviews: 51,
      image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "prod-8",
      title: "Zero-Waste Kitchen Essentials",
      category: "eco",
      categoryName: "Zero Waste",
      price: 39.00,
      originalPrice: 50.00,
      badge: "Bundle Save",
      rating: 4.9,
      reviews: 132,
      image: "https://images.unsplash.com/photo-1584473457406-6240486418e9?auto=format&fit=crop&w=600&q=80"
    }
  ];

  /* ==========================================================================
     2. Cart State & Storage
     ========================================================================== */
  let cart = JSON.parse(localStorage.getItem("verdant_cart")) || [];
  const FREE_SHIPPING_THRESHOLD = 45.00;

  function saveCart() {
    localStorage.setItem("verdant_cart", JSON.stringify(cart));
    updateCartUI();
  }

  /* ==========================================================================
     3. Rendering Products & Filters
     ========================================================================== */
  const productsGrid = document.getElementById("products-grid");
  const filterTabs = document.getElementById("filter-tabs");
  const searchInput = document.getElementById("search-input");
  let currentFilter = "all";
  let searchQuery = "";

  function renderProducts() {
    if (!productsGrid) return;

    const filtered = PRODUCTS.filter((item) => {
      const matchesCategory = currentFilter === "all" || item.category === currentFilter;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
      productsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
          <span style="font-size: 2.5rem; display: block; margin-bottom: 0.5rem;">🔍</span>
          <h3>No eco products found</h3>
          <p>Try searching with another keyword or resetting the filter category.</p>
        </div>
      `;
      return;
    }

    productsGrid.innerHTML = filtered.map((product) => {
      const isSale = product.originalPrice !== null;
      return `
        <article class="product-card" data-id="${product.id}">
          ${product.badge ? `<span class="product-badge ${isSale ? 'sale' : ''}">${product.badge}</span>` : ''}
          <div class="product-img-box">
            <img src="${product.image}" alt="${product.title}" class="product-img" loading="lazy">
          </div>
          <div class="product-details">
            <span class="product-category">${product.categoryName}</span>
            <h3 class="product-title">${product.title}</h3>
            <div class="product-rating">
              <span class="stars">★★★★★</span>
              <span class="rating-count">(${product.reviews})</span>
            </div>
            <div class="product-pricing">
              <span class="current-price">$${product.price.toFixed(2)}</span>
              ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
            </div>
            <button class="btn-add-cart" data-id="${product.id}">
              <span>+</span> Add to Cart
            </button>
          </div>
        </article>
      `;
    }).join("");

    // Attach Add to Cart listener
    productsGrid.querySelectorAll(".btn-add-cart").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        addToCart(id);
      });
    });
  }

  // Filter Buttons
  if (filterTabs) {
    filterTabs.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        filterTabs.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        currentFilter = btn.getAttribute("data-category");
        renderProducts();
      });
    });
  }

  // Search Input
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.trim();
      renderProducts();
    });
  }

  /* ==========================================================================
     4. Cart Logic & UI Updates
     ========================================================================== */
  const cartBtn = document.getElementById("cart-btn");
  const cartDrawer = document.getElementById("cart-drawer");
  const cartOverlay = document.getElementById("cart-overlay");
  const cartClose = document.getElementById("cart-close");
  const cartItemsContainer = document.getElementById("cart-items");
  const cartCountBadge = document.getElementById("cart-count");
  const cartHeaderCount = document.getElementById("cart-header-count");
  const cartSubtotal = document.getElementById("cart-subtotal");
  const shippingText = document.getElementById("shipping-text");
  const shippingMeterFill = document.getElementById("shipping-meter-fill");
  const clearCartBtn = document.getElementById("clear-cart-btn");
  const checkoutBtn = document.getElementById("checkout-btn");

  function openCart() {
    cartDrawer.classList.add("open");
    cartOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeCart() {
    cartDrawer.classList.remove("open");
    cartOverlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  if (cartBtn) cartBtn.addEventListener("click", openCart);
  if (cartClose) cartClose.addEventListener("click", closeCart);
  if (cartOverlay) cartOverlay.addEventListener("click", closeCart);

  // Close on Escape Key
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && cartDrawer.classList.contains("open")) {
      closeCart();
    }
  });

  function addToCart(productId) {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return;

    const existingIndex = cart.findIndex((item) => item.id === productId);
    if (existingIndex > -1) {
      cart[existingIndex].qty += 1;
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        qty: 1
      });
    }

    saveCart();
    showToast(`🌿 Added "${product.title}" to your cart!`);
  }

  function updateCartUI() {
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    if (cartCountBadge) cartCountBadge.textContent = totalCount;
    if (cartHeaderCount) cartHeaderCount.textContent = totalCount;
    if (cartSubtotal) cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;

    // Free shipping bar calculation
    if (shippingText && shippingMeterFill) {
      if (subtotal >= FREE_SHIPPING_THRESHOLD) {
        shippingText.textContent = "🎉 Congratulations! You unlocked Free Carbon-Neutral Shipping!";
        shippingMeterFill.style.width = "100%";
      } else {
        const remaining = (FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2);
        const percent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
        shippingText.textContent = `Add $${remaining} more for Free Shipping!`;
        shippingMeterFill.style.width = `${percent}%`;
      }
    }

    // Render items in drawer
    if (cartItemsContainer) {
      if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
          <div class="empty-cart-msg">
            <span>🪴</span>
            <h4>Your cart is empty</h4>
            <p>Looks like you haven't added any green treasures yet.</p>
          </div>
        `;
        if (checkoutBtn) checkoutBtn.disabled = true;
      } else {
        if (checkoutBtn) checkoutBtn.disabled = false;
        cartItemsContainer.innerHTML = cart.map((item) => `
          <div class="cart-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.title}" class="cart-item-img">
            <div class="cart-item-info">
              <h4 class="cart-item-title">${item.title}</h4>
              <p class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</p>
              <div class="cart-qty-controls">
                <button class="btn-qty btn-minus" data-id="${item.id}">-</button>
                <span class="cart-qty-num">${item.qty}</span>
                <button class="btn-qty btn-plus" data-id="${item.id}">+</button>
              </div>
            </div>
            <button class="btn-remove-item" data-id="${item.id}" title="Remove item">Remove</button>
          </div>
        `).join("");

        // Quantity controls
        cartItemsContainer.querySelectorAll(".btn-minus").forEach((btn) => {
          btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            changeQuantity(id, -1);
          });
        });

        cartItemsContainer.querySelectorAll(".btn-plus").forEach((btn) => {
          btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            changeQuantity(id, 1);
          });
        });

        cartItemsContainer.querySelectorAll(".btn-remove-item").forEach((btn) => {
          btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            removeItem(id);
          });
        });
      }
    }
  }

  function changeQuantity(id, delta) {
    const itemIndex = cart.findIndex((i) => i.id === id);
    if (itemIndex > -1) {
      cart[itemIndex].qty += delta;
      if (cart[itemIndex].qty <= 0) {
        cart.splice(itemIndex, 1);
      }
      saveCart();
    }
  }

  function removeItem(id) {
    cart = cart.filter((i) => i.id !== id);
    saveCart();
  }

  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
      if (cart.length === 0) return;
      if (confirm("Are you sure you want to clear your cart?")) {
        cart = [];
        saveCart();
      }
    });
  }

  /* ==========================================================================
     5. Toast Notification System
     ========================================================================== */
  const toast = document.getElementById("toast");
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 3200);
  }

  /* ==========================================================================
     6. Checkout Modal Workflow
     ========================================================================== */
  const checkoutModal = document.getElementById("checkout-modal");
  const modalCloseBtn = document.getElementById("modal-close-btn");
  const orderSummaryBox = document.getElementById("order-summary-box");

  if (checkoutBtn && checkoutModal) {
    checkoutBtn.addEventListener("click", () => {
      if (cart.length === 0) return;

      const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
      const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
      const shipping = isFreeShipping ? 0 : 5.00;
      const total = subtotal + shipping;

      if (orderSummaryBox) {
        orderSummaryBox.innerHTML = `
          <p><strong>Total Items:</strong> ${cart.reduce((sum, item) => sum + item.qty, 0)}</p>
          <p><strong>Subtotal:</strong> $${subtotal.toFixed(2)}</p>
          <p><strong>Shipping:</strong> ${isFreeShipping ? '<span style="color:var(--primary); font-weight:bold;">FREE (Carbon-Neutral)</span>' : '$5.00'}</p>
          <p style="font-size: 1.1rem; margin-top: 0.5rem; border-top: 1px solid var(--border-color); padding-top: 0.5rem;">
            <strong>Paid Total:</strong> <span style="color:var(--primary); font-weight:800;">$${total.toFixed(2)}</span>
          </p>
        `;
      }

      closeCart();
      checkoutModal.classList.add("open");

      // Reset cart after checkout
      cart = [];
      saveCart();
    });
  }

  if (modalCloseBtn && checkoutModal) {
    modalCloseBtn.addEventListener("click", () => {
      checkoutModal.classList.remove("open");
    });
  }

  /* ==========================================================================
     7. Newsletter & Contact Forms
     ========================================================================== */
  const newsletterForm = document.getElementById("newsletter-form");
  const newsletterFeedback = document.getElementById("newsletter-feedback");

  if (newsletterForm && newsletterFeedback) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("newsletter-email").value;
      newsletterFeedback.style.color = "var(--primary)";
      newsletterFeedback.textContent = `✓ Success! "${email}" has been enrolled for 15% off.`;
      newsletterForm.reset();
      setTimeout(() => {
        newsletterFeedback.textContent = "";
      }, 6000);
    });
  }

  const contactForm = document.getElementById("contact-form");
  const contactFeedback = document.getElementById("contact-feedback");

  if (contactForm && contactFeedback) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector("button[type='submit']");
      const originalText = submitBtn.textContent;
      submitBtn.textContent = "Sending...";
      submitBtn.disabled = true;

      setTimeout(() => {
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        contactFeedback.className = "form-feedback success";
        contactFeedback.textContent = "✓ Thank you! Your green inquiry has been received.";

        setTimeout(() => {
          contactFeedback.className = "form-feedback";
          contactFeedback.style.display = "none";
        }, 5000);
      }, 700);
    });
  }

  /* ==========================================================================
     8. Theme Switcher (Dark / Light with Purple Accents)
     ========================================================================== */
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

  const savedTheme = localStorage.getItem("verdant_theme");
  const initialTheme = savedTheme || (prefersDarkScheme.matches ? "dark" : "light");

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    if (themeIcon) {
      themeIcon.textContent = theme === "dark" ? "☀️" : "🌙";
    }
    localStorage.setItem("verdant_theme", theme);
  }

  applyTheme(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      applyTheme(newTheme);
    });
  }

  /* ==========================================================================
     9. Mobile Navigation Toggle & Year
     ========================================================================== */
  const mobileToggle = document.getElementById("mobile-toggle");
  const navMenu = document.getElementById("nav-menu");

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener("click", () => {
      navMenu.classList.toggle("open");
      mobileToggle.textContent = navMenu.classList.contains("open") ? "✕" : "☰";
    });

    navMenu.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        mobileToggle.textContent = "☰";
      });
    });
  }

  const currentYearSpan = document.getElementById("current-year");
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // Initial products render and cart state sync
  renderProducts();
  updateCartUI();
});
