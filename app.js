// e-commerce site
const api = `https://fakestoreapi.com`
async function categoryApi() {
    const fetch_api = await fetch(`${api}/products/categories`)
    const data = await fetch_api.json()
    console.log(data);
    const category_div = document.getElementById("category_div")
    for (let i = 0; i < data.length; i++) {
        category_div.innerHTML += `<a class="category">${data[i]}</a>`
        
    }
}
categoryApi()
async function productApi() {
    const fetch_api = await fetch(`${api}/products`)
    const data = await fetch_api.json()
    console.log(data);
    const products_div = document.getElementById("products_div")
    for (let i = 0; i < data.length; i++) {
        products_div.innerHTML += `<a class="product">
        <div class=>
        <div class="product_image"><img src="${data[i].image}"/></div>
        <div>
        <div>
        ${data[i].title}
        </div>
        <div>$${data[i].price}</div>
        <div>${data[i].description}</div>
        </div>
        </div>
        </a>`
        
    }
}
productApi()