// e-commerce site
async function fetchApi() {
    const fetch_data = await fetch(`https://api.escuelajs.co/api/v1/products`)
    const data = await fetch_data.json()
    console.log(data);
    document.getElementById("article").innerHTML = `<img src="${data[1].images[0]}" alt="" />`
    
}
fetchApi()