console.log("Home js is working")
const categoryImages = {
    Boys :"/images/Boys.jpg",
    Girls :"/images/Girls.jpg",
    Unisex :"/images/Unisex.jpg",
    NewBorn :"/images/NewBorn.jpg"
}
fetch("/homeData")
.then(res => res.json())
.then(data =>{
    console.log(data)
    if(data.success){
        document.getElementById("heroImage").src= data.heroImage 
        renderCategories(data.categories)
    }
})
.catch(error => console.log(error))

function renderCategories(categories){
 const container = document.getElementById("categoryContainer")
 container.innerHTML = categories.map(category =>`
<div class="col-lg-4 mb-4">
   <div class ="small-card">
        <img src="${categoryImages[category.name]}">
       <h3>${category.name} </h3>
</div>
    </div>
    `).join("")
}