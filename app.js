// e-commerce site
const api = `https://dummyjson.com`
async function categoryApi() {
    const fetch_api = await fetch(`${api}/products/categories`)
    const data = await fetch_api.json()
    console.log(data);
    const category_div = document.getElementById("category_div")
    for (let i = 0; i < data.length; i++) {
        category_div.innerHTML += `<a class="category" href="./category.html?name=${data[i].name}">${data[i].name}</a>`

    }

    let title;
    if (window.location.pathname == "/category.html") {
        const search_params = new URLSearchParams(window.location.search);
        for (const [key, value] of search_params.entries()) {
            if (key === "name") {
                title = value
            }
            console.log(`${key},${value}`);
        }
        console.log(title);
        const current_category = data.find(categoryName => categoryName.name === title)
        console.log(current_category);
        const categoryProductsDiv = document.getElementById("categoryProductsDiv");
        const categoryProductApi = await fetch(current_category.url);
        const categoryProductData = await categoryProductApi.json();
        const categoryproducts = categoryProductData.products
        console.log(categoryProductData);
        for (let i = 0; i < categoryproducts.length; i++) {
            categoryProductsDiv.innerHTML += `<a class="CategoryProducts">
            <div class="product_image"><img src="${categoryproducts[i].images[0]}"/></div>
            <div>
            <div>
            ${categoryproducts[i].title}
            </div>
            <div>$${categoryproducts[i].price}</div>
            <div>${categoryproducts[i].description}</div>
            </div>
            </div>
            </a>`
        }



    }
}
categoryApi()
async function productApi() {
    const fetch_api = await fetch(`${api}/products?limit=50&skip=0`)
    const data = await fetch_api.json()
    console.log(data);
    const products = data.products
    const products_div = document.getElementById("products_div")
    for (let i = 0; i < products.length; i++) {
        products_div.innerHTML += `<a class="product" href="">
        <div class=>
        <div class="product_image"><img src="${products[i].images[0]}"/></div>
        <div>
        <div>
        ${products[i].title}
        </div>
        <div>$${products[i].price}</div>
        <div>${products[i].description}</div>
        </div>
        </div>
        </a>`

    }
}
productApi()
