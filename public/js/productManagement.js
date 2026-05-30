//console.log("JS loaded")
// add product
document.getElementById("saveProductBtn").addEventListener("click", async () => {
    const name = document.getElementById("productName").value.trim()
    const category = document.getElementById("productCategory").value
    const price = document.getElementById("productPrice").value
    const stock = document.getElementById("productStock").value
    const description = document.getElementById("productDescription").value.trim()
    const imageFiles = document.getElementById("productImages").files
    if (!name || !category || !price || !stock) {
        return Swal.fire("Error!", "Please fill all fields", "error")
    }
    if (imageFiles.length === 0) {
        return Swal.fire("Error!", "Please select at least one image", "error")
    }
    const formData = new FormData()
    formData.append("name", name)
    formData.append("category", category)
    formData.append("price", price)
    formData.append("stock", stock)
    formData.append("description", description)
    for (let i = 0; i < imageFiles.length; i++) {
        formData.append("images", imageFiles[i])
    }
    const response = await fetch("/admin/products", {
          method: "POST", 
          body: formData })
    const data = await response.json()
    if (data.success) {
        Swal.fire("Success!", data.message, "success").then(() => location.reload())
    } else {
        Swal.fire("Error!", data.message, "error")
    }
})

// delete product
document.querySelectorAll(".toggleBtn").forEach(btn => {
    btn.addEventListener("click", async () => {
        const id = btn.dataset.id
        const isActive = btn.dataset.active === "true"
        const result = await Swal.fire({
            title: isActive ? "Disable Product?" : "Enable Product?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: isActive ? "#dc3545" : "#198754",
            confirmButtonText: isActive ? "Yes, Disable" : "Yes, Enable"
        })
        if (!result.isConfirmed) return

        const response = await fetch(`/admin/products/${id}/toggle`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" }
        })
        const data = await response.json()
        if (data.success) {
            Swal.fire("Success!", data.message, "success").then(() => location.reload())
        } else {
            Swal.fire("Error!", data.message, "error")
        }
    })
})

// edit product
document.querySelectorAll(".editBtn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.getElementById("editProductId").value = btn.dataset.id
        document.getElementById("editProductName").value = btn.dataset.name
       setTimeout(() => {
    document.getElementById("editProductCategory").value = btn.dataset.category
}, 100)
        document.getElementById("editProductPrice").value = btn.dataset.price
        document.getElementById("editProductStock").value = btn.dataset.stock
        document.getElementById("editProductDescription").value = btn.dataset.description

        const images = btn.dataset.images ? JSON.parse(btn.dataset.images) : []
        const container = document.getElementById("currentImages")
        container.innerHTML = ""
        images.forEach((img, index) => {
            container.innerHTML += `
                <div class="position-relative" id="imgWrapper_${index}" style="display:inline-block">
                    <img src="${img}" style="width:60px;height:60px;object-fit:cover;border-radius:6px;">
                    <button type="button" class="btn btn-danger btn-sm position-absolute top-0 end-0"
                    style="padding:1px 5px;font-size:10px;"
                     onclick="deleteImage('${btn.dataset.id}', '${img}', ${index})">x</button>
                </div>`
        })
    })
})

// image delete 
async function deleteImage(productId, imgPath, index) {
    const result = await Swal.fire({
        title: "Delete Image?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc3545",
        confirmButtonText: "Yes, Delete"
    }) 
    if (!result.isConfirmed) return
    const response = await fetch(`/admin/products/${productId}/image`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imagePath: imgPath })
    })
    const data = await response.json()
    if (data.success) {
        const wrapper = document.getElementById(`imgWrapper_${index}`)
        wrapper.innerHTML = `
            <div style="width:60px;height:60px;border:2px dashed #ccc;border-radius:6px;display:flex;align-items:center;ju stify-content:center;cursor:pointer;"
        onclick="document.getElementById('replaceInput_${index}').click()">
        <span style="font-size:24px;color:#aaa">+</span>
            </div>
            <input type="file" id="replaceInput_${index}" accept="image/*" style="display:none"
                onchange="replaceImage(this, '${productId}', ${index})">`
    } else {
        Swal.fire("Error!", data.message, "error")
    }
}

// image replace 
async function replaceImage(input, productId, index){
    const file = input.files[0]
    if (!file) return
    const formData = new FormData()
    formData.append("images", file)
    formData.append("index", index)
    const response = await fetch(`/admin/products/${productId}/replaceImage`, {
        method: "PUT",
        body: formData
    })
    const data = await response.json()
    if (data.success) {
        const wrapper = document.getElementById(`imgWrapper_${index}`)
        wrapper.innerHTML = `
            <img src="${data.imagePath}" style="width:60px;height:60px;object-fit:cover;border-radius:6px;">
            <button type="button"
            class="btn btn-danger btn-sm position-absolute top-0 end-0"
            style="padding:1px 5px;font-size:10px;"
            onclick="deleteImage('${productId}', '${data.imagePath}', ${index})">x</button>`
    } else {
        Swal.fire("Error!", data.message, "error")
    }
}

// update product
document.getElementById("updateProductBtn").addEventListener("click", async () => {
    const id = document.getElementById("editProductId").value
    const name = document.getElementById("editProductName").value.trim()
    const category = document.getElementById("editProductCategory").value
    const price = document.getElementById("editProductPrice").value
    const stock = document.getElementById("editProductStock").value
    const description = document.getElementById("editProductDescription").value.trim()
    const images = document.getElementById("editProductImages").files
    if (!name || !category || !price || !stock) {
        return Swal.fire("Error!", "Please fill all fields", "error")
    }
    const formData = new FormData()
    formData.append("name", name)
    formData.append("category", category)
    formData.append("price", price)
    formData.append("stock", stock)
    formData.append("description", description)
    for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i])
    }
    const response = await fetch(`/admin/products/${id}`, { method: "PUT", body: formData })
    const data = await response.json()
    if (data.success) {
        Swal.fire("Updated!", data.message, "success").then(() => location.reload())
    } else {
        Swal.fire("Error!", data.message, "error")
    }
})

// search
document.getElementById("searchInput").addEventListener("input", () => {
    const search = document.getElementById("searchInput").value.toLowerCase()
    const rows = document.querySelectorAll("#productTableBody tr")
    rows.forEach(row => {
        const name = row.cells[2].textContent.toLowerCase()
        row.style.display = name.includes(search) ? "" : "none"
    })
})
