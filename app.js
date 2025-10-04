// e-commerce site
const api = `https://dummyjson.com`
// category function
async function categoryApi() {
    const fetch_api = await fetch(`${api}/products/categories`)
    const data = await fetch_api.json()
    console.log(data);
    const category_div = document.getElementById("category_div")
    for (let i = 0; i < data.length; i++) {
        category_div.innerHTML += `<a class="category" href="/category.html?name=${data[i].name}">${data[i].name}</a>`

    }
    const categoryProductsMain = document.querySelector(".categoryProductsMain")
    let name;
    if (window.location.pathname == "/category.html" || window.location.pathname == "/category") {
        const search_params = new URLSearchParams(window.location.search);
        for (const [key, value] of search_params.entries()) {
            if (key === "name") {
                name = value
            }
            console.log(`${key},${value}`);
        }
        console.log(name);
        const current_category = data.find(categoryName => categoryName.name === name)
        console.log(current_category);
        const breadcrumb_item_active = document.getElementById("breadcrumb_item_active")
        const categoryProductApi = await fetch(current_category.url);
        const categoryProductData = await categoryProductApi.json();
        const categoryproducts = categoryProductData.products
        console.log(categoryProductData);
        const category_products_heading = document.getElementById("category_products_heading")
        const categoryProductsDiv = document.getElementById("categoryProductsDiv")
        category_products_heading.innerText = name
        breadcrumb_item_active.innerText = name
        for (let i = 0; i < categoryproducts.length; i++) {
            categoryProductsDiv.innerHTML += `<a class="CategoryProducts" href="/details.html?title=${categoryproducts[i].title}">
                <div class="product_inner" >
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
    let title;
    if (window.location.pathname == "/details.html" || window.location.pathname == "/details") {
        const search_params = new URLSearchParams(window.location.search);
        for (const [key, value] of search_params.entries()) {
            if (key === "title") {
                title = value
            }
            console.log(`${key},${value}`);
        }
        console.log(title);
        const current_product = categoryproducts.find(productName => productName.title === title)
        console.log(current_product);

    }
}

categoryApi()
// product function
async function productApi() {
    const fetch_api = await fetch(`${api}/products?limit=20&skip=77`)
    const data = await fetch_api.json()
    console.log(data);
    const products = data.products
    if (window.location.pathname === "/" || window.location.pathname === "/index.html") {
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
    let title;
    if (window.location.pathname == "/details.html" || window.location.pathname == "/details") {
        const search_params = new URLSearchParams(window.location.search);
        for (const [key, value] of search_params.entries()) {
            if (key === "title") {
                title = value
            }
            console.log(`${key},${value}`);
        }
        console.log(title);
        const detailsapi = await fetch(`${api}/products?limit=194&skip=0`)
        const detailsData = await detailsapi.json();
        const products = detailsData.products
        console.log(detailsData);
        const current_product = products.find(productName => productName.title === title)
        console.log(current_product);
        



    }
}
productApi()

// mouse scroll
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