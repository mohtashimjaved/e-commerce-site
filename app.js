// e-commerce site
const api = `https://dummyjson.com`
async function categoryApi() {
    const fetch_api = await fetch(`${api}/products/categories`)
    const data = await fetch_api.json()
    console.log(data);
    const category_div = document.getElementById("category_div")
    for (let i = 0; i < data.length; i++) {
        category_div.innerHTML += `<a class="category" href="">${data[i].name}</a>`
        
        
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