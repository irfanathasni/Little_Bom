document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
    radio.addEventListener('change', function () {
        if (this.value === 'cod') {
            document.getElementById('payBtn').innerHTML =
                '<i class="bi bi-box-seam"></i> &nbsp;Place Order (COD)'
        } else {
            document.getElementById('payBtn').innerHTML =
                '<i class="bi bi-lock"></i> &nbsp;Pay with Razorpay'
        }
        document.querySelectorAll('input[name="paymentMethod"]').forEach(r => {
            r.closest('label').classList.remove('selected')
        })
        this.closest('label').classList.add('selected')
    })
})

document.getElementById('payBtn').addEventListener('click', async () => {
    console.log("pay button clicked")
    const selectedAddress = document.querySelector('input[name="selectedAddress"]:checked')
    const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked').value

    if (!selectedAddress) {
        Swal.fire('Oops!', 'Please select a delivery address', 'warning')
        return
    }

    // COD flow
    if (selectedPayment === 'cod') {
        try {
            const response = await fetch('/place-order-cod', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ addressId: selectedAddress.value,
                    couponCode :document.getElementById('couponInput').value.trim() ||null
                 })
            })
            const data = await response.json()
            if (data.success) {
                    window.location.href = `/order-success/${data.orderId}`
            } else {
                Swal.fire('Error', data.message, 'error')
            }
        } catch (error) {
            console.log(error)
            Swal.fire('Error', 'Something went wrong', 'error')
        }
        return
    }

    // Razorpay flow
    try {
        const response = await fetch('/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body:JSON.stringify({
                couponCode :document.getElementById('couponInput').value.trim()||null
            })
        })
        const data = await response.json()
        if (!data.success) {
            Swal.fire('Error', data.message, 'error')
            return
        }
        const options = {
            key: document.getElementById('razorpayKeyId').value,
            amount: data.order.amount,
            currency: "INR",
            order_id: data.order.id,
            name: "LittleBom",
            description: "Order Payment",
            handler: function (paymentResponse) {
                verifyPayment(paymentResponse, selectedAddress.value)
            },
            prefill: {
                name: document.getElementById('userName').value,
                email: document.getElementById("userEmail").value
            }
        }
        const rzp = new Razorpay(options)
        rzp.open()
    } catch (error) {
        console.log("Error:", error)
        Swal.fire("Error", "Something went wrong", 'error')
    }
})

const verifyPayment = async (paymentResponse, addressId) => {
    try {
        const response = await fetch('/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
                addressId: addressId
            })
        })
        const data = await response.json()
        if (data.success) {
            window.location.href = `/order-success/${data.orderId}`
        } else {
            Swal.fire('Payment Failed', data.message, 'error')
        }
    } catch (error) {
        console.log(error)
        Swal.fire('Error', 'Something went wrong', 'error')
    }
}

document.getElementById('applyCouponBtn').addEventListener('click', async () => {
    const code = document.getElementById('couponInput').value.trim()
    const msgEl = document.getElementById('couponMsg')

    if (!code) {
        msgEl.className = 'coupon-msg error'
        msgEl.textContent = 'Please enter a coupon code'
        return
    }

    const response = await fetch('/apply-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
    })
    const data = await response.json()

    if (data.success) {
        msgEl.className = 'coupon-msg success'
        msgEl.textContent = `Coupon applied! You save ₹${data.discount}`
        document.getElementById('discountRow').style.display = 'flex'
        document.getElementById('discountVal').textContent = `-₹${data.discount}`
        document.getElementById('grandTotalVal').textContent = `₹${data.newTotal.toFixed(2)}`
    } else {
        msgEl.className = 'coupon-msg error'
        msgEl.textContent = data.message
    }
})