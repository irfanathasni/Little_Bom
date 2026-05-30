console.log("shop js working")
let categoryLoaded = false
function getProducts(products) {
        // console.log(data)
        const container = document.getElementById("product-container")
            container.innerHTML = products.map(product =>`
                <a href="/product/${product._id}" class="product-card">
                    <div class="product-img-wrapper">
                        <img src="${product.image[0]}" alt="${product.name}" class="product-img" loading="lazy">
                    </div>
                    <div class="product-info">
                        <div class="product-name">${product.name}</div>
                        <div class="product-price">₹${product.price}</div>
                    </div>
                </a>
            `).join("")
}
function renderCategories (categories){
    const container = document.getElementById("categoryFilter")
    container.innerHTML = `<option value ="">All categories</option>`
    categories.forEach((category) =>{
        container.innerHTML+=`<option value="${category._id}">
        ${category.name}</option>`
    })
}
function pagination(currentPage,totalPages){
    const container = document.getElementById("paginationContainer")
    container.innerHTML = ""
    for(let i =1; i<=totalPages; i++){
        container.innerHTML+=`
            <li class="page-item ${i===currentPage ? "active":""}">
                <button class="page-link" data-page="${i}">${i}</button>
            </li>`
    }
}
function searchProduct (page=1){
    const search = document.getElementById("searchInput").value
    const category = document.getElementById("categoryFilter").value
    const sort = document.getElementById("sortFilter").value
    // console.log(sort)
    fetch(`/products?search=${search}&category=${category}&sort=${sort}&page=${page}`,{
        headers:{"Accept":"application/json"}
    })
    .then(res=>res.json())
    .then(data=>{
        if(data.success){
            getProducts(data.products)
            // renderCategories(data.categories)
        if(!categoryLoaded){
            renderCategories(data.categories)
            categoryLoaded=true
        }
            pagination(data.currentPage,data.totalPages)
        }
    })
    .catch((error)=> console.log(error))    
}
document.getElementById("paginationContainer").addEventListener("click" ,(e) => {
    const btn = e.target.closest(".page-link")
    if(!btn) return;
    searchProduct(parseInt(btn.dataset.page))
})
document.getElementById("searchInput").addEventListener("input",() =>{
    searchProduct(1)
})
document.getElementById("categoryFilter").addEventListener("change",()=>{
    searchProduct(1)
})
document.getElementById("sortFilter").addEventListener("change",() =>{
    searchProduct(1)
})
document.addEventListener("DOMContentLoaded",()=>searchProduct(1))

