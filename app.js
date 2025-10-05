// ----- E-commerce site -----
// ----- Name: Dealio -----
// ----- Link: dealio-site.netlify.app ---

// ==================
// --------- API Main  -----------
// ==============================
const api = `https://dummyjson.com`

// =============================
// -- Featured Products Function for Home Page --
// ===========================================
async function getFeaturedProducts() {
    if (window.location.pathname === "/" || window.location.pathname === "/index.html") {
        const fetch_api = await fetch(`${api}/products?limit=20&skip=77`)
        const data = await fetch_api.json()
        const products = data.products
        const products_div = document.getElementById("products_div")
        for (let i = 0; i < products.length; i++) {
            products_div.innerHTML += `<a class="product" href="/details.html?title=${products[i].title}">
            <div class="product_inner" >
            <div class="product_image"><img src="${products[i].images[0]}"/></div>
            <div class="product_details">
            <div class="product_price">$${products[i].price}<i class="fa-solid fa-cart-plus"></i></div>
            <div class="product_title">
            ${products[i].title}
            </div>
            <div class="product_descp">${products[i].description}</div>
            <div class="product_rating">Rating ${products[i].rating}</div>
            </div>
            </div>
            </a>`
        }
    }
}

getFeaturedProducts()


// ==============================
// ---- Get Category List Function ----
// ====================================
async function getCategoryList() {
    const apiFetch = await fetch(`${api}/products/categories`)
    const data = await apiFetch.json()
    const category_div = document.getElementById("category_div")
    if (category_div) {  
        for (let i = 0; i < data.length; i++) {
            category_div.innerHTML += `<a class="category" href="/category.html?name=${data[i].name}">${data[i].name}</a>`
        }
        // ------ Code for Scrolling with Mouse on Category List --- 
        const scrollableContainer = document.getElementById("category_div");
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

// ==================================
// --- Get Categorywise products Function --- 
// ==========================================
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
        const apiFetch = await fetch(`${api}/products/categories`)
        const data = await apiFetch.json()
        const current_category = data.find(categoryName => categoryName.name === name)
        const breadcrumb_item_active = document.getElementById("breadcrumb_item_active")
        const category_products_heading = document.getElementById("category_products_heading")
        const categoryProductsDiv = document.getElementById("categoryProductsDiv")

        // --- Fetch API for Products of Category ---
        if (name) {

            category_products_heading.innerText = name
            breadcrumb_item_active.innerText = name
            const categoryProductApi = await fetch(current_category.url);
            const categoryProductData = await categoryProductApi.json();
            const categoryproducts = categoryProductData.products
            for (let i = 0; i < categoryproducts.length; i++) {
                categoryProductsDiv.innerHTML += `
            <a class="CategoryProducts" href="/details.html?title=${categoryproducts[i].title}">
            <div class="product_inner">
            <div class="product_image"><img src="${categoryproducts[i].images[0]}"/></div>
            <div class="product_details">
            <div class="product_price">$${categoryproducts[i].price}<i class="fa-solid fa-cart-plus"></i></div>
            <div class="product_title">
            ${categoryproducts[i].title}
            </div>
            <div class="product_descp">${categoryproducts[i].description}</div>
            <div class="product_rating">Rating ${categoryproducts[i].rating}</div>
            </div>
            </div>
            </a>`
            }
        }
    }
}
getProductsbyCategory()

// =================================
// ---- Details of Products Function for Details Page ----
// ===================================================
async function getDetailsOfProducts() {
    if (window.location.pathname == "/details.html" || window.location.pathname == "/details") {
        let title;
        // --- Get Query Param --- 
        const search_params = new URLSearchParams(window.location.search);
        for (const [key, value] of search_params.entries()) {
            if (key === "title") {
                title = value
            }
        }
        // --- Fetch API for Get All Products --- 
        const breadcrumb_item_active = document.getElementById("breadcrumb_item_active")
        if (title) {
            breadcrumb_item_active.innerText = title
            const apiFetch = await fetch(`${api}/products?limit=0`)
            const data = await apiFetch.json();
            const productdetails = data.products
            const current_product = productdetails.find(product => product.title === title)
            console.log(current_product);

        }
    }
}
getDetailsOfProducts()
