// ----- E-commerce site -----
// ----- Name: Dealio -----
// ----- Link: dealio-site.netlify.app ---

// --------- Supabase Client Import  -----------
import { supabaseclient, session, deletefunc } from './database.js'
import { updateCartCount } from './navbar.js'


// -- Featured Products Function for Home Page --
async function getFeaturedProducts() {
  if (window.location.pathname === "/" || window.location.pathname === "/index.html") {
    const getData = async () => {
      const { data, error } = await supabaseclient
        .from('products')
        .select()
        .eq("featured_products", "true")
      if (error) {
        console.error(error);
        return error;
      }
      console.log(data);
      return data;
    }
    const products = await getData()
    console.log(products);

    const products_div = document.getElementById("products_div")
    products_div.innerHTML = ""
    for (let i = 0; i < products.length; i++) {
      products_div.innerHTML += `
      <div class="product">
      <a class="product_inner" href="/details.html?id=${products[i].id}">
            <div class="product_image"><img src="${products[i].thumbnail}"/></div>
            <div class="product_details">
            <div class="product_title">
            ${products[i].title}
            </div>
            <div class="product_descp">${products[i].description}</div>
            <div class="product_price">$${products[i].price}</div>
            </div>
            </a>
            <button class="addToCartBtn"
            data-id="${products[i].id}"
            data-title="${products[i].title}"
            data-price="${products[i].price}"
            data-image="${products[i].thumbnail}">
            <span class="IconContainer">
            <i class="fa-solid fa-cart-plus"></i>
            </span>
            <p class="text">Add To Cart</p>
            </button>
            </div>
            `
      document.querySelectorAll('.addToCartBtn').forEach(button => {
        button.addEventListener('click', handleAddToCart);
      })
    }
  }
}
getFeaturedProducts()

// const categoriesset =

// ---- Get Category List Function ----
async function getCategoryList() {
  const getData = async () => {
    const { data, error } = await supabaseclient
      .from('products')
      .select("category")
    if (error) {
      console.error(error);
      return error;
    }
    console.log(data);
    return data;
  }
  const get = await getData();
  let categoryArray = [];
  get.map((value) => {
    const data = value.category;
    // console.log(data);
    categoryArray.push(data);
  })
  const uniqueCategories = [...new Set(categoryArray)]
  const category_div = document.getElementById("category_div")
  if (category_div) {
    uniqueCategories.map((value) => {
      let data = value.replace("-", " ")
      category_div.innerHTML += `<a class="category" href="/category.html?name=${value}">${data}</a>`

    })
  }


  // ------ Code for Scrolling with Mouse on Category List --- 
  const scrollableContainer = document.getElementById("category_div");
  if (scrollableContainer) {

    let isDragging = false;
    let startX;
    let scrollLeft;

    scrollableContainer.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.pageX - scrollableContainer.offsetLeft;
      scrollLeft = scrollableContainer.scrollLeft;
      scrollableContainer.style.cursor = 'grabbing';
    });

    scrollableContainer.addEventListener('mouseleave', () => {
      isDragging = false;
      scrollableContainer.style.cursor = 'grab';
    });

    scrollableContainer.addEventListener('mouseup', () => {
      isDragging = false;
      scrollableContainer.style.cursor = 'grab';
    });

    scrollableContainer.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - scrollableContainer.offsetLeft;
      const walk = (x - startX) * 2;
      scrollableContainer.scrollLeft = scrollLeft - walk;
    });
  }
}

getCategoryList()

// --- Get Categorywise products Function --- 
async function getProductsbyCategory() {

  if (window.location.pathname == "/category.html" || window.location.pathname == "/category") {
    const categoryProductsMain = document.querySelector(".categoryProductsMain")
    let name;
    // --- Get Query Param --- 
    const search_params = new URLSearchParams(window.location.search);
    for (const [key, value] of search_params.entries()) {
      if (key === "name") {
        name = value
      }
    }
    // ---- Fetch API for Get category Name ----
    const getData = async (name) => {
      const { data, error } = await supabaseclient
        .from('products')
        .select()
        .eq("category", name)
      if (error) {
        console.error(error);
        return error;
      }
      console.log(data);
      return data;
    }
    const data = await getData(name.toLowerCase())
    // const current_category = data.find(categoryName => categoryName.name === name)
    const breadcrumb_item_active = document.getElementById("breadcrumb_item_active")
    const category_products_heading = document.getElementById("category_products_heading")
    const categoryProductsDiv = document.getElementById("categoryProductsDiv")

    // --- Fetch API for Products of Category ---
    if (name) {
      name = name.replace("-", " ")

      category_products_heading.innerText = name
      breadcrumb_item_active.innerText = name
      categoryProductsDiv.innerHTML = ""; 
      for (let i = 0; i < data.length; i++) {
        categoryProductsDiv.innerHTML += `
        <div class="CategoryProducts">
        <a class="product_inner" href="/details.html?id=${data[i].id}">
            <div class="product_image"><img src="${data[i].thumbnail}"/></div>
            <div class="product_details">
            <div class="product_title">
            ${data[i].title}
            </div>
            <div class="product_descp">${data[i].description}</div>
            <div class="product_price">$${data[i].price}</div>
            </div>
            </a>
            <button class="addToCartBtn"
            data-id="${data[i].id}"
            data-title="${data[i].title}"
            data-price="${data[i].price}"
            data-image="${data[i].thumbnail}">
            <span class="IconContainer">
            <i class="fa-solid fa-cart-plus"></i>
            </span>
            <p class="text">Add To Cart</p>
            </button>
            </div>`
      }
      document.querySelectorAll('.addToCartBtn').forEach(button => {
        button.addEventListener('click', handleAddToCart);
      })
    }
  }
}
getProductsbyCategory()

async function handleAddToCart(event) {
  // FIX: Read attributes BEFORE the async operation starts
  const button = event.currentTarget;

  const id = button.getAttribute('data-id');
  const title = button.getAttribute('data-title');
  const priceAttr = button.getAttribute('data-price');
  const image = button.getAttribute('data-image');

  const loginRedirectUrl = './login.html';

  // Check login status (this is the await call that caused the error)
  const { session: userSession } = await session();

  if (!userSession) {
    // Not logged in: Redirect to login page
    window.location.href = loginRedirectUrl;
    return;
  }
  const cartUserEmail = userSession.user.email;

  // Logged in: Add item to local storage
  const price = parseFloat(priceAttr);

  // Defensive check in case attributes were missing during injection
  if (!id || !title || isNaN(price) || !image) {
    console.error("Cart item data is incomplete or invalid:", { id, title, price, image });
    alert("Error: Cannot add item to cart. Product data is missing.");
    return;
  }

  const newItem = { id, title, price, image, quantity: 1, email: cartUserEmail };

  let cart = JSON.parse(localStorage.getItem('cartItems')) || [];

  const existingItemIndex = cart.findIndex(item => item.id === id);

  if (existingItemIndex > -1) {
    // Item exists: Increase quantity
    cart[existingItemIndex].quantity += 1;
  } else {
    // New item: Add to cart
    cart.push(newItem);
  }

  localStorage.setItem('cartItems', JSON.stringify(cart));

  // Update cart count on navbar (DO NOT show cart page)
  updateCartCount();

  // Simple confirmation
  console.log(`${title} added to cart. Current items: ${cart.length}`);
}

// ---- Details of Products Function for Details Page ----
async function getDetailsOfProducts() {
  if (window.location.pathname == "/details.html" || window.location.pathname == "/details") {
    let id;
    // --- Get Query Param --- 
    const search_params = new URLSearchParams(window.location.search);
    for (const [key, value] of search_params.entries()) {
      if (key === "id") {
        id = value;
        console.log(value);

      }
    }
    console.log(id);

    // --- Fetch API for Get All Products --- 
    const breadcrumb_item_active = document.getElementById("breadcrumb_item_active")
    if (id) {
      const getData = async (id) => {
        const { data, error } = await supabaseclient
          .from('products')
          .select()
          .eq("id", id)
        if (error) {
          console.error(error);
          return error;
        }
        console.log(data);
        return data;
      }
      const data = await getData(id);

      // Added check for missing product data
      if (!data || data.length === 0) {
        console.error(`Product with ID ${id} not found.`);
        return;
      }

      const current_product = data[0];
      breadcrumb_item_active.innerText = current_product.title
      const images = JSON.parse(current_product.images);
      const Detailtitle = current_product.title;
      const sku = current_product.sku;
      const rating = current_product.rating;
      const price = current_product.price;
      const discPercent = current_product.discount;
      const description = current_product.description;
      const stock = current_product.stock;
      const returnPolicy = current_product.return;
      const warranty = current_product.warranty;
      const shipping = current_product.shipping;
      const detailsproductsDiv = document.getElementById("detailsProductsDiv");
      detailsproductsDiv.innerHTML = `
            <div class="imagesAnddetailsdiv">
                    <div class="imagesDiv">
                        <div id="carouselExampleIndicators" class="carousel slide  detailsCarousel"
                            data-bs-ride="carousel">
                            <div class="carousel-indicators">
                            </div>
                            <div class="carousel-inner">
                            </div>
                            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Previous</span>
                        </button>
                            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Next</span>
                            </button>
                        </div>
                    </div>
                    <div class="detailsDiv">
                        <div class="titleAndPriceDiv">
                            <div class="title">
                                <h1>${Detailtitle}</h1>
                                <h3>${sku}</h3>
                            </div>
                            <div class="priceDiv">
                                <div class="rating"><i class="fa-solid fa-star"></i> ${rating}</div>
                                <div class="price">
                                    <h2>$${price}<div><h6>${discPercent}% Off</h6></div></h2>
                                </div>
                            </div>
                        </div>
                        <hr>
                        <div class="descriptionAndInfoDiv">
                            <div class="description"><h4>About this item:</h4> ${description}</div>
                            <div class="info-section">
                                <div class="stock"><i class="fa-solid fa-boxes-stacked"></i> In Stock: <span>${stock}</span></div>
                                <div class="shipping"><i class="fa-solid fa-truck"></i> Shipping: <span>${shipping}</span></div>
                                <div class="warranty"><i class="fa-solid fa-shield-halved"></i> Warranty: <span>${warranty}</span></div>
                                <div class="policy"><i class="fa-solid fa-arrow-right-arrow-left"></i> Return Policy: <span>${returnPolicy}</span></div>
                            </div>
                            <button class="addToCartBtn" 
                                data-id="${current_product.id}"
                                data-title="${Detailtitle}"
                                data-price="${price}"
                                data-image="${current_product.thumbnail}">
                                <span class="IconContainer">
                                <i class="fa-solid fa-cart-plus"></i>
                                </span>
                                <p class="text">Add To Cart</p>
                                </button>
                        </div>
                    </div>
                </div>
            `;
      document.querySelectorAll('.addToCartBtn').forEach(button => {
        button.addEventListener('click', handleAddToCart);
      });
      const carousel = document.querySelector(".carousel-indicators")
      const carouselInner = document.querySelector(".carousel-inner")
      let imageNumber = 0;
      let slideNumber = 1;
      images.map(i => {
        carousel.innerHTML += `
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${imageNumber}"
                aria-current="true" aria-label="Slide ${slideNumber} "></button>
                `
        carouselInner.innerHTML += `
                <div class="carousel-item">
                <img src="${images[imageNumber]}" class="d-block w-100 " alt="..."/>
                </div>                               
                `
        // console.log(images);
        carousel.firstElementChild.classList.add("active")
        carouselInner.firstElementChild.classList.add("active")

        imageNumber++;
        slideNumber++;
        console.log(imageNumber, slideNumber);
      })
    }
  }
}
getDetailsOfProducts()
async function signoutfunc() {
  const { error } = await supabaseclient.auth.signOut()
  // console.log(event.target);
  if (error) {
    console.log(error);
  }

  window.location.reload();
}
document.getElementById("signout-link")?.addEventListener('click', signoutfunc)

async function getSearchResults() {
  // Check if we are on the search page
  if (window.location.pathname === "/search.html" || window.location.pathname === "/search") {
    const searchResultsDiv = document.getElementById("searchResultsDiv");
    const searchHeading = document.getElementById("search_heading");
    const breadcrumbItemActive = document.getElementById("breadcrumb_item_active");

    // 1. Get the query from the URL
    const searchParams = new URLSearchParams(window.location.search);
    const query = searchParams.get("q");

    if (!query) return;

    // Update UI Text
    if (searchHeading) searchHeading.innerText = `Results for "${query}"`;
    if (breadcrumbItemActive) breadcrumbItemActive.innerText = "Search Results";

    // 2. Fetch data from Supabase
    // We search in both 'title' AND 'description' using .or() and .ilike() (case insensitive)
    const getData = async () => {
      const { data, error } = await supabaseclient
        .from('products')
        .select()
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`); // Search logic

      if (error) {
        console.error("Search error:", error);
        return [];
      }
      return data;
    };

    const products = await getData();

    // 3. Render Results
    if (searchResultsDiv) {
      if (products.length === 0) {
        searchResultsDiv.innerHTML = `<h3 class="no-results">No products found matching "${query}"</h3>`;
        return;
      }

      // Reuse the exact same card HTML structure as your other functions for consistency
      for (let i = 0; i < products.length; i++) {
        searchResultsDiv.innerHTML += `
                <div class="product"> <a class="product_inner" href="/details.html?id=${products[i].id}">
                        <div class="product_image"><img src="${products[i].thumbnail}"/></div>
                        <div class="product_details">
                            <div class="product_title">${products[i].title}</div>
                            <div class="product_descp">${products[i].description}</div>
                            <div class="product_price">$${products[i].price}</div>
                        </div>
                    </a>
                    <button class="addToCartBtn"
                        data-id="${products[i].id}"
                        data-title="${products[i].title}"
                        data-price="${products[i].price}"
                        data-image="${products[i].thumbnail}">
                        <span class="IconContainer">
                            <i class="fa-solid fa-cart-plus"></i>
                        </span>
                        <p class="text">Add To Cart</p>
                    </button>
                </div>`;
      }

      // Re-attach event listeners for the new buttons
      document.querySelectorAll('.addToCartBtn').forEach(button => {
        button.addEventListener('click', handleAddToCart);
      });
    }
  }
}

// Call the function
getSearchResults();

// -- Contact Form Handler for contact.html --
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  const contactMessage = document.getElementById('contact-message');

  if (contactForm && contactMessage) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Get form data
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const subject = document.getElementById('subject').value;
      const message = document.getElementById('message').value;

      // Simple submission feedback (since there's no backend endpoint to save to a contacts table)
      contactMessage.style.display = 'block';
      contactMessage.classList.remove('text-danger');
      contactMessage.classList.add('text-success');
      contactMessage.innerHTML = `Thank you, <strong>${name}</strong>! Your message has been sent. We will respond to <strong>${email}</strong> shortly.`;
      contactForm.reset();

      // Optional: Log data for dev inspection
      console.log('Contact Form Submission:', { name, email, subject, message });
    });
  }
});
// --------- Supabase Client Import  -----------\r\nimport { supabaseclient, session } from './database.js'\r\nimport { updateCartCount } from './navbar.js'\r\n\r\n// ... (rest of your existing code above)

// --- START CUSTOM MODAL LOGIC (Manual Control) ---
/**
 * Shows the custom modal by adding the 'active' class to the overlay.
 * @param {string} overlayId - The ID of the modal overlay element.
 */
function showCustomModal(overlayId) {
  const modalOverlay = document.getElementById(overlayId);
  if (modalOverlay) {
    // Set display property first so the element becomes visible before the transition starts
    modalOverlay.style.display = 'flex';
    // Force reflow to ensure display change is registered before transition
    void modalOverlay.offsetWidth;
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

/**
 * Hides the custom modal by removing the 'active' class from the overlay.
 * @param {string} overlayId - The ID of the modal overlay element.
 */
function hideCustomModal(overlayId) {
  const modalOverlay = document.getElementById(overlayId);
  if (modalOverlay) {
    modalOverlay.classList.remove('active');

    // Wait for the CSS transition (0.3s) to finish before hiding the element completely
    modalOverlay.addEventListener('transitionend', function handler() {
      if (!modalOverlay.classList.contains('active')) {
        modalOverlay.style.display = 'none';
        document.body.style.overflow = '';
        modalOverlay.removeEventListener('transitionend', handler);
      }
    });
  }
}

/**
 * Attaches listeners to the modal closing elements (close buttons and overlay).
 */
function attachModalCloseListeners(modalOverlayId) {
  // 4. Attach Event Listeners for Modal HIDE (on close button or overlay click)
  const modalOverlay = document.getElementById(modalOverlayId);

  // Attach to all close buttons
  document.querySelectorAll('.btn-close-manual').forEach(el => {
    el.addEventListener('click', () => {
      hideCustomModal(modalOverlayId);
    });
  });

  // Attach to the overlay itself
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      // Check if the click target is the overlay itself, not a child element
      if (e.target.id === modalOverlayId) {
        hideCustomModal(modalOverlayId);
      }
    });

    // Prevent clicks inside the modal content from bubbling up to the overlay and closing it
    const modalContent = document.getElementById('orderDetailsModal');
    if (modalContent) {
      modalContent.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }
  }
}
// --- END CUSTOM MODAL LOGIC ---


/**
 * Renders the state of the order page (Loading, Sign In, No Orders, or Orders List).
 * @param {string} state - The desired state ('loading', 'signin', 'noorders', 'content').
 */
function renderOrderPageState(state) {
  const loader = document.getElementById('orders-loader');
  const container = document.getElementById('orders-container');
  const signIn = document.getElementById('orders-signin-state');
  const noOrders = document.getElementById('orders-no-orders-state');

  [loader, container, signIn, noOrders].forEach(el => {
    if (el) el.style.display = 'none';
  });

  if (state === 'loading' && loader) {
    loader.style.display = 'block';
  } else if (state === 'signin' && signIn) {
    signIn.style.display = 'block';
  } else if (state === 'noorders' && noOrders) {
    noOrders.style.display = 'block';
  } else if (state === 'content' && container) {
    container.style.display = 'grid';
  }
}

// Function to map status to CSS class for styling
function getStatusBadgeClass(status) {
  status = status.toLowerCase();
  if (status === 'pending') return 'status-badge-pending';
  if (status === 'processing') return 'status-badge-processing';
  if (status === 'shipped') return 'status-badge-shipped';
  if (status === 'delivered') return 'status-badge-delivered';
  if (status === 'cancelled') return 'status-badge-cancelled';
  return 'status-badge-secondary';
}


async function getOrders() {
  const ordersContainer = document.getElementById('orders-container');

  const modalBody = document.getElementById('order-modal-body');
  const modalOverlayId = 'orderDetailsModalOverlay';

  if (window.location.pathname.indexOf("/myorders") === -1) {
    return;
  }

  // IMPORTANT: Attach close listeners immediately, as the modal structure is static HTML
  attachModalCloseListeners(modalOverlayId);

  renderOrderPageState('loading');

  try {
    const { session: getSession } = await session();
    const user = getSession?.user;

    if (!user) {
      renderOrderPageState('signin');
      return;
    }

    // --- Supabase Data Fetching Logic ---
    const { data: orders, error } = await supabaseclient
      .from('orders')
      .select('*')
      .eq('user_email', user.email)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      ordersContainer.innerHTML = '<p class="error-message">An unexpected error occurred. Please try again.</p>';
      renderOrderPageState('content');
      return;
    }

    if (orders.length === 0) {
      renderOrderPageState('noorders');
      return;
    }

    // 2. Render Orders List
    let ordersHtml = '';
    orders.forEach(order => {
      const date = new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
      const status = order.status || 'Pending';
      const statusClass = getStatusBadgeClass(status);
      const total = order.total_amount ? order.total_amount.toFixed(2) : '0.00';

      const items = JSON.parse(order.items || '[]');
      const itemsSummary = items.slice(0, 2).map(item => item.title).join(', ');
      const moreItemsCount = items.length > 2 ? `... (+${items.length - 2} items)` : '';

      ordersHtml += `
                <div class="order-card-v2">
                    <div class="order-header-v2">
                        <span>Order #${order.order_id.substring(0, 8).toUpperCase()}</span>
                        <span class="status-badge ${statusClass}">${status}</span>
                    </div>
                    
                    <p class="order-date-v2 text-muted"><i class="far fa-calendar-alt"></i>Order Placed: ${date}</p>
                    <p class="text-muted"><i class="fas fa-box"></i>Items: ${itemsSummary} ${moreItemsCount}</p>

                    <div class="order-footer-v2">
                        <span class="order-total-v2">$${total}</span>
                        <button class="custom-button outline-primary-button order-view-details-btn" data-order=${order.order_id}>
                            <i class="fas fa-eye"></i>View Details
                        </button>
                    </div>
                </div>
            `;
    });

    ordersContainer.innerHTML = ordersHtml;
    renderOrderPageState('content');

    // 3. Attach Event Listeners for Modal SHOW
    document.querySelectorAll('.order-view-details-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        const orderId = e.currentTarget.getAttribute("data-order")
        const selectedOrder = orders.find(o => JSON.parse(o.order_id) === orderId);
        console.log(orderId, selectedOrder)

        if (selectedOrder) {
          populateOrderModal(selectedOrder, modalBody);
          showCustomModal(modalOverlayId);
        }
      });
    });

  } catch (e) {
    console.error("Critical error in getOrders:", e);
    ordersContainer.innerHTML = '<p class="error-message">A critical error occurred while loading your orders.</p>';
    renderOrderPageState('content');
  }
}

/**
 * Populates the Order Details Modal with specific order information.
 */
function populateOrderModal(order, modalBody) {
  const status = order.status || 'Pending';
  const statusClass = getStatusBadgeClass(status);

  const date = new Date(order.created_at).toLocaleDateString('en-US', { dateStyle: 'full' });
  const total = order.total_amount ? order.total_amount.toFixed(2) : '0.00';

  const items = JSON.parse(order.items || '[]');
  let itemsHtml = items.map(item => `
        <div class="modal-order-item">
            <span class="item-name">${item.title}</span>
            <span class="item-quantity text-muted">Qty: ${item.quantity}</span>
            <span class="item-price">${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');
  const info = JSON.parse(order.buyer_info);
  modalBody.innerHTML = `
        <div class="modal-order-details-summary">
            <div class="col-left">
                <p>Order ID</p>
                <h4>#${order.order_id.toUpperCase()}</h4>
                <p class="text-muted">Date Placed: ${date}</p>
            </div>
            <div class="col-right">
                <p>Current Status</p>
                <span class="status-badge ${statusClass}">${status}</span>
                <h3>Total Paid: <span>$${total}</span></h3>
            </div>
        </div>

        <h6><i class="fas fa-box-open"></i>Items Ordered (${items.length})</h6>
        <div class="modal-order-item-grid">
            ${itemsHtml.length > 0 ? itemsHtml : '<p class="text-center text-muted">No item details available.</p>'}
        </div>

        <h6><i class="fas fa-map-marker-alt"></i>Shipping Address</h6>
        <div class="shipping-address-box">
            <p>${info.firstName + info.lastName || 'N/A'}</p>
            <p>${info.address1 || 'N/A'}, ${info.city || 'N/A'}</p>
            <p>${info.state || 'N/A'} - ${info.zipCode || 'N/A'}, ${info.country || 'N/A'}</p>
        </div>
        <div>
        <button id="cancelBtn">Cancel Order</button>
        </div>
        
    `;
  document.getElementById(`cancelBtn`).addEventListener("click",() => {
    deletefunc(order.id)
    window.location.reload()
  })

}

// Call the function for the My Orders page
getOrders();