// ----- E-commerce site -----
// ----- Name: Dealio -----
// ----- Link: dealio-site.netlify.app ---

// --------- Supabase Client Import  -----------
import { supabaseclient, session } from './database.js'
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
    for (let i = 0; i < products.length; i++) {
      products_div.innerHTML += `<a class="product" href="/details.html?id=${products[i].id}">
            <div class="product_inner">
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
      for (let i = 0; i < data.length; i++) {
        categoryProductsDiv.innerHTML += `
            <a class="CategoryProducts" href="/details.html?id=${data[i].id}">
            <div class="product_inner">
            <div class="product_image"><img src="${data[i].thumbnail}"/></div>
            <div class="product_details">
            <div class="product_title">
            ${data[i].title}
            </div>
            <div class="product_descp">${data[i].description}</div>
            <div class="product_price">$${data[i].price}</div>
            </div>
            </div>
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
            </a>`
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

  // Logged in: Add item to local storage
  const price = parseFloat(priceAttr);

  // Defensive check in case attributes were missing during injection
  if (!id || !title || isNaN(price) || !image) {
    console.error("Cart item data is incomplete or invalid:", { id, title, price, image });
    alert("Error: Cannot add item to cart. Product data is missing.");
    return;
  }

  const newItem = { id, title, price, image, quantity: 1 };

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