const updateSummary = async () => {
    const res = await fetch('/cart/summary')
    const data = await res.json()
    // console.log(data)
    if(data.success){
         document.querySelector('.subtotal-value').textContent = `₹${data.subtotal.toFixed(2)}`
         document.querySelector('.shipping-value').textContent = `₹${data.shipping.toFixed(2)}`
         document.querySelector('.grandtotal-value').textContent = `₹${data.grandTotal.toFixed(2)}`
    }
}
document.querySelectorAll(`.remove-btn`).forEach(btn => {
    btn.addEventListener("click",async(e) => {
        e.preventDefault()
        const productId = btn.dataset.id
        const response = await fetch(`/cart/remove/${productId}`,{
            method :"DELETE"
        })
        const data = await response.json()
        if(data.success){
            btn.closest(`.cart-card`).remove()
            updateSummary()
        }
    })
})
document.querySelectorAll(`.quantity-wrapper`).forEach(wrapper =>{
    const productId = wrapper.dataset.id
    const qtyDisplay = wrapper.querySelector(`.qty-number`)

    wrapper.querySelector(`.plus`).addEventListener(`click`,async() =>{
        const newQty = parseInt(qtyDisplay.textContent) +1
        const res = await fetch("/cart/update-cart",{
            method:"PATCH",
            headers:{"Content-Type":"application/json"},
            body :JSON.stringify({productId,quantity:newQty})
        })
        const data = await res.json()
        if(data.success)qtyDisplay.textContent = newQty
        updateSummary()
    })
    wrapper.querySelector(".minus").addEventListener("click", async () =>{
        const currentQty = parseInt(qtyDisplay.textContent)
        if(currentQty <=1){
            const res = await fetch(`/cart/remove/${productId}`,{
                method:"DELETE"})
            const data = await res.json()
            if(data.success) wrapper.closest('.cart-card').remove()
                updateSummary()
        }else{
            const newQty = currentQty -1
            const res = await fetch("/cart/update-cart",{
                method:"PATCH",
                headers:{"Content-Type":"application/json"},
                body : JSON.stringify({productId,quantity:newQty})
            })
        const data = await res.json()
        if(data.success){
            qtyDisplay.textContent = newQty
            updateSummary()
        }
    }
    })
})
document.getElementById("applyCouponBtn").addEventListener("click",async() =>{
    const code = document.getElementById("couponInput").value.trim()
    const res = await fetch("/apply-coupon",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body :JSON.stringify({code})
    })
    const data = await res.json()
    const msg = document.getElementById("couponMsg")
   if(data.success) {
    document.querySelector(".grandtotal-value").textContent = `₹${data.newTotal.toFixed(2)}`
    Swal.fire({
        icon: 'success',
        title: 'Coupon Applied!',
        text: `You saved ₹${data.discount}`,
        confirmButtonText: 'OK',
        timer: 2000
    })
}else {
        msg.style.color ="red"
        msg.textContent =data.message
    }
})
