// Add Coupon
document.getElementById("saveCouponBtn").addEventListener("click", async () => {
    const code = document.getElementById("couponCode").value.trim()
    const discount = document.getElementById("couponDiscount").value
    const minAmount = document.getElementById("couponMinAmount").value
    const expiryDate = document.getElementById("couponExpiryDate").value
    if (!code || !discount || !minAmount || !expiryDate) {
        return Swal.fire("Error!", "Please fill all fields", "error")
    }

    const response = await fetch("/admin/coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, discount, minAmount, expiryDate })
    })

    const data = await response.json()
    if (data.success) {
        Swal.fire("Success!", data.message, "success").then(() => location.reload())
    } else {
        Swal.fire("Error!", data.message, "error")
    }
})

// Edit
document.querySelectorAll(".editBtn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.getElementById("editCouponId").value = btn.dataset.id
        document.getElementById("editCouponCode").value = btn.dataset.code
        document.getElementById("editCouponDiscount").value = btn.dataset.discount
        document.getElementById("editCouponMinAmount").value = btn.dataset.minamount
        document.getElementById("editCouponExpiryDate").value = btn.dataset.expirydate
    })
})

// Update
document.getElementById("updateCouponBtn").addEventListener("click", async () => {
    const id = document.getElementById("editCouponId").value
    const code = document.getElementById("editCouponCode").value.trim()
    const discount = document.getElementById("editCouponDiscount").value
    const minAmount = document.getElementById("editCouponMinAmount").value
    const expiryDate = document.getElementById("editCouponExpiryDate").value
    if (!code || !discount || !minAmount || !expiryDate) {
        return Swal.fire("Error!", "Please fill all fields", "error")
    }
    const response = await fetch(`/admin/coupon/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, discount, minAmount, expiryDate })
    })
    const data = await response.json()
    if (data.success) {
        Swal.fire("Updated!", data.message, "success").then(() => location.reload())
    } else {
        Swal.fire("Error!", data.message, "error")
    }
})

// Delete
document.querySelectorAll(".toggleBtn").forEach(btn => {
    btn.addEventListener("click", async () => {
        const id = btn.dataset.id
        const isActive = btn.dataset.active === "true"
        const result = await Swal.fire({
            title: isActive ? "Disable Coupon?" : "Enable Coupon?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: isActive ? "#dc3545" : "#198754",
            confirmButtonText: isActive ? "Yes, Disable" : "Yes, Enable"
        })
        if (!result.isConfirmed) return
        const response = await fetch(`/admin/coupon/${id}/toggle`, {
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