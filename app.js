// e-commerce site
async function fetchApi() {
    const fetch_data = await fetch(`https://fakestoreapi.com/products/category/electronics`)
    const data = await fetch_data.json()
    console.log(data);
    // document.getElementById("article").innerHTML = `<img src="${data[1].images[0]}" alt="" />`
    
}
fetchApi()