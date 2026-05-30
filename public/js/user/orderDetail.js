const cancelOrder = async(orderId) =>{
     const result = await Swal.fire({
        title :'Cancel Order?',
        text:"Are you sure you want to cancel this order?",
        icon:"warning",
        showCancelButton:true,
        confirmButtonText:"yes,Cancel",
        cancelButtonText:"NO"
     })
     if(result.isConfirmed){
        const res = await fetch(`/orders/${orderId}/cancel`,{
            method:'POST'})
        const data = await res.json()
        if(data.success){
            Swal.fire('Cancelled!',"Your order has been Cancelled","success")
                .then(()=>location.reload())
        }else{
            Swal.fire("Error",data.message,'error')
        }
     }
}
const returnOrder = async (orderId) =>{
    const result = await Swal.fire({
        title:"Return Order?",
        text:"Are you sure you want to return this order?",
        icon:"warning",
        showCancelButton:true,
        confirmButtonText:"Yes,Return",
        cancelButtonText:"No"
    })
    if(result.isConfirmed){
        const res = await fetch(`/orders/${orderId}/return`,{
            method:'POST'
        })
        const data = await res.json()
        if(data.success){
            Swal.fire("Return Requested!","Your return has been submitted.","success")
            .then(()=>location.reload())
        }else{
            Swal.fire('Error',data.message,'error')
        }
    }
}