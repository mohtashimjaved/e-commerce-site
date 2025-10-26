// ----- E-commerce site -----
// ----- Name: Dealio -----
// ----- Link: dealio-site.netlify.app ---

// ==================
// --------- API Main  -----------
// ==============================
const supabaseapi = supabase.createClient('https://whmlfysqskwnizilqjbr.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndobWxmeXNxc2t3bml6aWxxamJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MTcyNjcsImV4cCI6MjA3NjE5MzI2N30.AF3Rk8iIBEjaa8Ci4XXZyLHM8_nS_NdXQ5iiOA0KYZ4')
console.log(supabaseapi);


// const api = `https://dummyjson.com`

// async function insert(title, category, brand, discount, rating, price, description, returnPolicy, sku, stock, thumbnail, images, shipping, warranty) {
//     const { data, error } = await supabaseapi
//     .from('products')
//     .insert({
//         title: title,
//         category: category,
//         brand: brand,
//         discount: discount,
//         rating: rating,
//         price: price,
//         description: description,
//         return: returnPolicy,
//         sku: sku,
//         stock: stock,
//         thumbnail: thumbnail,
//         images: images,
//         shipping: shipping,
//         warranty: warranty,

//     })
//     .select()
//     if (error) {
//         console.log(error);
//         return error
//     }
//     console.log(data);
//     return data
// }
// async function products () {
//             const fetch_api = await fetch(`${api}/products?limit=0`)
//             const data = await fetch_api.json()
//             const products = data.products
//             for (let i = 0; i < products.length; i++) {
//             const images = products[i].images;
//             const title = products[i].title;
//             const thumbnail = products[i].thumbnail;        
//             const sku = products[i].sku;
//             const rating = products[i].rating;
//             const price = products[i].price;
//             const discount = products[i].discountPercentage;
//             const description = products[i].description;
//             const stock = products[i].stock;
//             const returnPolicy = products[i].returnPolicy;
//             const warranty = products[i].warrantyInformation;
//             const shipping = products[i].shippingInformation;
//             const category = products[i].category;
//             const brand = products[i].brand;
//             insert(title, category, brand, discount, rating, price, description, returnPolicy, sku, stock, thumbnail, images, shipping, warranty)
//             console.log("datasend");
//             }
//         }
// products()        

// // =============================
// // -- Featured Products Function for Home Page --
// // ===========================================
// async function getFeaturedProducts() {
//     if (window.location.pathname === "/" || window.location.pathname === "/index.html") {
//         const fetch_api = await fetch(`${api}/products?limit=20&skip=77`)
//         const data = await fetch_api.json()
//         const products = data.products
//         console.log(products);
        
//         const products_div = document.getElementById("products_div")
//         for (let i = 0; i < products.length; i++) {
//             products_div.innerHTML += `<a class="product" href="/details.html?title=${products[i].title}">
//             <div class="product_inner">
//             <div class="product_image"><img src="${products[i].images[0]}"/></div>
//             <div class="product_details">
//             <div class="product_price">$${products[i].price}<i class="fa-solid fa-cart-plus"></i></div>
//             <div class="product_title">
//             ${products[i].title}
//             </div>
//             <div class="product_descp">${products[i].description}</div>
//             <div class="product_rating">Rating ${products[i].rating}</div>
//             </div>
//             </div>
//             </a>`
//         }
//     }
// }

// getFeaturedProducts()


// // ==============================
// // ---- Get Category List Function ----
// // ====================================
// async function getCategoryList() {
//     const apiFetch = await fetch(`${api}/products/categories`)
//     const data = await apiFetch.json()
//     const category_div = document.getElementById("category_div")
//     if (category_div) {
//         for (let i = 0; i < data.length; i++) {
//             category_div.innerHTML += `<a class="category" href="/category.html?name=${data[i].name}">${data[i].name}</a>`
//         }
//         // ------ Code for Scrolling with Mouse on Category List --- 
//         const scrollableContainer = document.getElementById("category_div");
//         let isDragging = false;
//         let startX;
//         let scrollLeft;

//         scrollableContainer.addEventListener('mousedown', (e) => {
//             isDragging = true;
//             startX = e.pageX - scrollableContainer.offsetLeft;
//             scrollLeft = scrollableContainer.scrollLeft;
//             scrollableContainer.style.cursor = 'grabbing';
//         });

//         scrollableContainer.addEventListener('mouseleave', () => {
//             isDragging = false;
//             scrollableContainer.style.cursor = 'grab';
//         });

//         scrollableContainer.addEventListener('mouseup', () => {
//             isDragging = false;
//             scrollableContainer.style.cursor = 'grab';
//         });

//         scrollableContainer.addEventListener('mousemove', (e) => {
//             if (!isDragging) return;
//             e.preventDefault();
//             const x = e.pageX - scrollableContainer.offsetLeft;
//             const walk = (x - startX) * 2;
//             scrollableContainer.scrollLeft = scrollLeft - walk;
//         });
//     }
// }
// getCategoryList()

// // ==================================
// // --- Get Categorywise products Function --- 
// // ==========================================
// async function getProductsbyCategory() {

//     if (window.location.pathname == "/category.html" || window.location.pathname == "/category") {
//         const categoryProductsMain = document.querySelector(".categoryProductsMain")
//         let name;
//         // --- Get Query Param --- 
//         const search_params = new URLSearchParams(window.location.search);
//         for (const [key, value] of search_params.entries()) {
//             if (key === "name") {
//                 name = value
//             }
//         }
//         // ---- Fetch API for Get category Name ----
//         const apiFetch = await fetch(`${api}/products/categories`)
//         const data = await apiFetch.json()
//         const current_category = data.find(categoryName => categoryName.name === name)
//         const breadcrumb_item_active = document.getElementById("breadcrumb_item_active")
//         const category_products_heading = document.getElementById("category_products_heading")
//         const categoryProductsDiv = document.getElementById("categoryProductsDiv")

//         // --- Fetch API for Products of Category ---
//         if (name) {

//             category_products_heading.innerText = name
//             breadcrumb_item_active.innerText = name
//             const categoryProductApi = await fetch(current_category.url);
//             const categoryProductData = await categoryProductApi.json();
//             const categoryproducts = categoryProductData.products
//             for (let i = 0; i < categoryproducts.length; i++) {
//                 categoryProductsDiv.innerHTML += `
//             <a class="CategoryProducts" href="/details.html?title=${categoryproducts[i].title}">
//             <div class="product_inner">
//             <div class="product_image"><img src="${categoryproducts[i].images[0]}"/></div>
//             <div class="product_details">
//             <div class="product_price">$${categoryproducts[i].price}<i class="fa-solid fa-cart-plus"></i></div>
//             <div class="product_title">
//             ${categoryproducts[i].title}
//             </div>
//             <div class="product_descp">${categoryproducts[i].description}</div>
//             <div class="product_rating">Rating ${categoryproducts[i].rating}</div>
//             </div>
//             </div>
//             </a>`
//             }
//         }
//     }
// }
// getProductsbyCategory()

// // =================================
// // ---- Details of Products Function for Details Page ----
// // ===================================================
// async function getDetailsOfProducts() {
//     if (window.location.pathname == "/details.html" || window.location.pathname == "/details") {
//         let title;
//         // --- Get Query Param --- 
//         const search_params = new URLSearchParams(window.location.search);
//         for (const [key, value] of search_params.entries()) {
//             if (key === "title") {
//                 title = value
//             }
//         }
//         // --- Fetch API for Get All Products --- 
//         const breadcrumb_item_active = document.getElementById("breadcrumb_item_active")
//         if (title) {
//             breadcrumb_item_active.innerText = title
//             const apiFetch = await fetch(`${api}/products?limit=0`)
//             const data = await apiFetch.json();
//             const productdetails = data.products
//             const current_product = productdetails.find(product => product.title === title)
//             console.log(current_product);
//             const images = current_product.images;
//             const Detailtitle = current_product.title;
//             const sku = current_product.sku;
//             const rating = current_product.rating;
//             const price = current_product.price;
//             const discPercent = current_product.discountPercentage;
//             const description = current_product.description;
//             const stock = current_product.stock;
//             const returnPolicy = current_product.returnPolicy;
//             const warranty = current_product.warrantyInformation;
//             const shipping = current_product.shippingInformation;
//             const detailsproductsDiv = document.getElementById("detailsProductsDiv");
//             detailsproductsDiv.innerHTML = `
//             <div class="imagesAnddetailsdiv">
//                     <div class="imagesDiv">
//                         <div id="carouselExampleIndicators" class="carousel slide  detailsCarousel"
//                             data-bs-ride="carousel">
//                             <div class="carousel-indicators">
//                             </div>
//                             <div class="carousel-inner">
//                             </div>
//                             <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
//                             <span class="carousel-control-prev-icon" aria-hidden="true"></span>
//                             <span class="visually-hidden">Previous</span>
//                         </button>
//                             <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
//                             <span class="carousel-control-next-icon" aria-hidden="true"></span>
//                             <span class="visually-hidden">Next</span>
//                             </button>
//                         </div>
//                     </div>
//                     <div class="detailsDiv">
//                         <div class="titleAndPriceDiv">
//                             <div class="title">
//                                 <h1>${Detailtitle}</h1>
//                                 <h3>${sku}</h3>
//                             </div>
//                             <div class="priceDiv">
//                                 <div class="rating"><i class="fa-solid fa-star"></i> ${rating}</div>
//                                 <div class="price">
//                                     <h2>$${price}<div><h6>${discPercent}% Off</h6></div></h2>
//                                 </div>
//                             </div>
//                         </div>
//                         <hr>
//                         <div class="descriptionAndInfoDiv">
//                             <div class="description"><h4>About this item:</h4> ${description}</div>
//                             <div class="info-section">
//                                 <div class="stock"><i class="fa-solid fa-boxes-stacked"></i> In Stock: <span>${stock}</span></div>
//                                 <div class="shipping"><i class="fa-solid fa-truck"></i> Shipping: <span>${shipping}</span></div>
//                                 <div class="warranty"><i class="fa-solid fa-shield-halved"></i> Warranty: <span>${warranty}</span></div>
//                                 <div class="policy"><i class="fa-solid fa-arrow-right-arrow-left"></i> Return Policy: <span>${returnPolicy}</span></div>
//                             </div>
//                             <button class="addToCartBtn"><i class="fa-solid fa-cart-shopping"></i> Add To Cart</button>
//                         </div>
//                     </div>
//                 </div>
//             `;

//             const carousel = document.querySelector(".carousel-indicators")
//             const carouselInner = document.querySelector(".carousel-inner")
//             let imageNumber = 0;
//             let slideNumber = 1;
//             images.map(i => {
//                 carousel.innerHTML += `
//                 <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${imageNumber}"
//                 aria-current="true" aria-label="Slide ${slideNumber} "></button>
//                 `
//                 carouselInner.innerHTML += `
//                 <div class="carousel-item">
//                 <img src="${images[imageNumber]}" class="d-block w-100 " alt="..."/>
//                 </div>                               
//                 `
//                 // console.log(images);
//                 carousel.firstElementChild.classList.add("active")
//                 carouselInner.firstElementChild.classList.add("active")
                
//                 imageNumber++;
//                 slideNumber++;
//                 console.log(imageNumber, slideNumber);
//             })
//         }
//     }
// }
// getDetailsOfProducts()
//     async function signoutfunc() {
//         const { error } = await supabaseclient.auth.signOut()
//         // console.log(event.target);
//         if (error) {
//             console.log(error);
//         }
        
//         window.location.reload();
//     }
