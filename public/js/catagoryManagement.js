//add
document.getElementById("saveCategoryBtn").addEventListener("click", async () => {
    const name = document.getElementById("categoryName").value.trim()
    const description = document.getElementById("categoryDescription").value.trim()
    if (!name) {
        return Swal.fire("Error!", "Name is required", "error")
    }
    const response = await fetch("/admin/catagory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description })
    })
    const data = await response.json()
    if (data.success) {
        Swal.fire("Success!", data.message, "success")
            .then(() => location.reload())
    } else {
        Swal.fire("Error!", data.message, "error")
    }
})
//delete
document.querySelectorAll(".toggleBtn").forEach(btn => {
    btn.addEventListener("click", async () => {
        const id = btn.dataset.id
        const isActive = btn.dataset.active === "true"

        const result = await Swal.fire({
            title: isActive ? "Disable Category?" : "Enable Category?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: isActive ? "#dc3545" : "#198754",
            confirmButtonText: isActive ? "Yes, Disable" : "Yes, Enable"
        })
        if (!result.isConfirmed) return

        const response = await fetch(`/admin/catagory/${id}/toggle`, {
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
//update
document.querySelectorAll(".editBtn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.getElementById("editCategoryId").value = btn.dataset.id
        document.getElementById("editCategoryName").value = btn.dataset.name
        document.getElementById("editCategoryDescription").value = btn.dataset.description
    })
})

document.getElementById("updateCategoryBtn").addEventListener("click", async () => {
    const id = document.getElementById("editCategoryId").value
    const name = document.getElementById("editCategoryName").value.trim()
    const description = document.getElementById("editCategoryDescription").value.trim()
    if (!name||!description) {
        return Swal.fire("Error!", "Name and description are required", "error")
    }
    const response = await fetch(`/admin/catagory/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description })
    })
    const data = await response.json()
    if (data.success) {
        Swal.fire("Updated!", data.message, "success")
            .then(() => location.reload())
    } else {
        Swal.fire("Error!", data.message, "error")
    }
}) 