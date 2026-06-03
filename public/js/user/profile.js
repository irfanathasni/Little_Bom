 
const navItems = document.querySelectorAll(".nav-item")
const tabPanels = document.querySelectorAll(".tab-panel")

navItems.forEach(item => {
  item.addEventListener("click", () => {
    const target = item.dataset.tab
    navItems.forEach(n => n.classList.remove("active"))
    item.classList.add("active")
    tabPanels.forEach(panel => panel.classList.remove("active"))
    document.getElementById(`tab-${target}`).classList.add("active")
  })
})
//PROFILE UPDATE 
const originalName = document.getElementById("name").value
const originalEmail = document.getElementById("email").value

document.getElementById("discardBtn").addEventListener("click", () => {
  document.getElementById("name").value = originalName
  document.getElementById("email").value = originalEmail
})

document.getElementById("saveProfile").addEventListener("click", async () => {
  const name = document.getElementById("name").value
  const email = document.getElementById("email").value
  const response = await fetch("/update-profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email })
  })
  const data = await response.json()
  if (data.success) {
    Swal.fire({ icon: "success", title: "Profile Updated Successfully" })
    document.querySelector(".sidebar-name").textContent = name
    document.querySelector(".sidebar-email").textContent = email
    document.querySelector(".avatar-circle").textContent = name.charAt(0).toUpperCase()
  } else {
    Swal.fire({ icon: "error", title: "Update Failed" })
  }
})

//ADD / EDIT ADDRESS 
document.getElementById("saveAddress").addEventListener("click", async () => {
  const id = document.getElementById("saveAddress").dataset.id
  const name = document.getElementById("addressName").value
  const mobile = document.getElementById("addressMobile").value
  const city = document.getElementById("addressCity").value
  const house = document.getElementById("addressHouse").value
  const state = document.getElementById("addressState").value
  const pincode = document.getElementById("addressPincode").value

  if (!name || !mobile || !city || !house || !state || !pincode) {
    return Swal.fire({ icon: "warning", title: "All fields are required" })
  }

  let url = "/add-address"
  let method = "POST"
  if (id) {
    url = `/edit-address/${id}`
    method = "PATCH"
  }

  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, mobile, house, city, state, pincode })
  })
  const data = await response.json()
  if (data.success) {
    const modal = bootstrap.Modal.getInstance(document.getElementById("addressModal"))
    modal.hide()
    location.reload()
  } else {
    Swal.fire({ icon: "error", title: "Failed to save address" })
  }
})

// Clear modal when Add button clicked
document.getElementById("addressModal").addEventListener("show.bs.modal", (e) => {
  if (!e.relatedTarget || !e.relatedTarget.classList.contains("editAddress")) {
    document.getElementById("addressName").value = ""
    document.getElementById("addressMobile").value = ""
    document.getElementById("addressHouse").value = ""
    document.getElementById("addressCity").value = ""
    document.getElementById("addressState").value = ""
    document.getElementById("addressPincode").value = ""
    document.getElementById("saveAddress").dataset.id = ""
    document.getElementById("addressModalTitle").textContent = "Add Address"
  }
})

//DELETE ADDRESS
document.addEventListener("click", async (e) => {
  const button = e.target.closest(".deleteAddress")
  if (button) {
    const result = await Swal.fire({
      icon: "warning",
      title: "Remove this address?",
      showCancelButton: true,
      confirmButtonText: "Yes, remove",
      confirmButtonColor: "#c05050"
    })
    if (!result.isConfirmed) return
    const addressId = button.dataset.id
    const response = await fetch(`/delete-address/${addressId}`, { method: "DELETE" })
    const data = await response.json()
    if (data.success) {
      location.reload()
    } else {
      Swal.fire({ icon: "error", title: "Delete Failed" })
    }
  }
})

//EDIT ADDRESS
document.addEventListener("click", (e) => {
  const button = e.target.closest(".editAddress")
  if (button) {
    document.getElementById("addressName").value = button.dataset.name
    document.getElementById("addressMobile").value = button.dataset.mobile
    document.getElementById("addressHouse").value = button.dataset.house
    document.getElementById("addressCity").value = button.dataset.city
    document.getElementById("addressState").value = button.dataset.state
    document.getElementById("addressPincode").value = button.dataset.pincode
    document.getElementById("saveAddress").dataset.id = button.dataset.id
    document.getElementById("addressModalTitle").textContent = "Edit Address"
    const modal = new bootstrap.Modal(document.getElementById("addressModal"))
    modal.show()
  }
})

// CHANGE PASSWORD 
document.getElementById("updatePassword").addEventListener("click", async () => {
  const currentPassword = document.getElementById("currentPassword").value
  const newPassword = document.getElementById("newPassword").value
  const confirmPassword = document.getElementById("confirmPassword").value

  if (!currentPassword || !newPassword || !confirmPassword) {
    return Swal.fire({ icon: "warning", title: "All fields are required" })
  }
  if (newPassword.length < 6) {
    return Swal.fire({ icon: "warning", title: "Password must be at least 6 characters" })
  }
  if (newPassword !== confirmPassword) {
    return Swal.fire({ icon: "error", title: "Passwords do not match" })
  }
  try {
    const response = await fetch("/change-password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword })
    })
    const data = await response.json()
    if (data.success) {
      Swal.fire({ icon: "success", title: data.message })
      document.getElementById("currentPassword").value = ""
      document.getElementById("newPassword").value = ""
      document.getElementById("confirmPassword").value = ""
    } else {
      Swal.fire({ icon: "error", title: data.message })
    }
  } catch (error) {
    Swal.fire({ icon: "error", title: "Something went wrong" })
  }
})

// TAB MEMORY ON RELOAD 
window.addEventListener("DOMContentLoaded", () => {
  const hash = window.location.hash.replace("#", "")
  if (hash) {
    const targetNav = document.querySelector(`.nav-item[data-tab="${hash}"]`)
    if (targetNav) targetNav.click()
  }
})

navItems.forEach(item => {
  item.addEventListener("click", () => {
    history.replaceState(null, "", `#${item.dataset.tab}`)
  })
})